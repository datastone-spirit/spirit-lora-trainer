from enum import Enum
from typing import Optional, Callable, List
from dataclasses import dataclass, asdict, field
from app.api.model.training_paramter import TrainingParameter
from app.api.model.hunyuan_paramter import HunyuanTrainingParameter
from app.api.model.kontext_parameter import KontextTrainingParameter
from app.api.model.captioning_model import CaptioningModelInfo
from app.api.common.utils import is_flux_sampling, dataset2toml, get_dataset_contents
from subprocess import Popen, TimeoutExpired, PIPE, STDOUT
from utils.util import parse_kohya_stdout, parse_kohya_progress_line
import uuid
from tbparse import SummaryReader
import time
import os
import tempfile


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class TaskType(Enum):
    NONE = "none"
    TRAINING = "training"
    HUNYUAN_TRAINING = "hunyuan_training"
    WAN_TRAINING = "wan_training"
    KONTEXT_TRAINING = "kontext_training"
    QWENIMAGE_TRAINING = "qwenimage_training"
    CAPTIONING = "captioning"

class TaskStatus(Enum):
    CREATED = "created"
    RUNNING = "running"
    COMPLETE = "complete"
    FAILED = "failed"

def get_logdir(log_dir, log_prefix):
    import os
    for file in os.listdir(log_dir):
        if file.startswith(log_prefix):
            return os.path.join(log_dir, file)
    return None

@dataclass
class Task:
    status = TaskStatus.CREATED
    task_type: TaskType = TaskType.NONE
    start_time: float = None
    end_time: float = None
    id: str = None
    detail: Optional[dict] = None
    stdout_lines: Optional[List] = field(default_factory=list)
    @staticmethod
    def wrap_captioning_task(image_paths: List[str], output_dir: str, class_token: str, cap_model: CaptioningModelInfo, prompt_type, global_prompt, is_append) -> 'Task':
        task = CaptioningTask()
        task.status = TaskStatus.CREATED
        task.image_paths = image_paths
        task.class_token = class_token
        task.output_dir = output_dir
        task.prompt_type = prompt_type
        task.detail = {
            'captions': [],
            'total': len(image_paths),
            'current': -1
        }
        task.model_info = cap_model
        task.id = uuid.uuid4().hex
        task.task_type = TaskType.CAPTIONING
        task.captioning = cap_model.captioning
        task.global_prompt = global_prompt
        task.is_append = is_append
        task.stdout_lines = []
        return task    

    def to_dict(self, verbose: bool = False, show_config: bool = False):
        raise NotImplementedError 
    
    def get_log(self) -> List:
        if self.stdout_lines:
            return self.stdout_lines
        return []    

    def __str__(self):
        return f"{self.to_dict(verbose=True)}"

    def run(self):
        self.status = TaskStatus.RUNNING
        try:
            self.start_time = time.time()
            self._run()
        except Exception as e:
            logger.error(f"task {self.id} running failed", exc_info=e)
            self.status = TaskStatus.FAILED
            self.detail = str(e)
            self.end_time = time.time()
            return 
            
        self.status = TaskStatus.COMPLETE
        self.end_time = time.time()
        return

@dataclass
class CaptioningTask(Task):
    image_paths: List[str] = None
    output_dir: str = None
    class_token: str = None
    captioning: Optional[Callable] = None
    model_info: Optional[CaptioningModelInfo] = None
    prompt_type: str = None
    global_prompt: str = None
    is_append: bool = False

    def _run(self):
        self.captioning(self.image_paths, self.output_dir, self.model_info, self.update_captioning_status, 
                        class_token=self.class_token, prompt_type=self.prompt_type,
                        global_prompt=self.global_prompt,
                        is_append=self.is_append)

    def update_captioning_status(self, current_step: int, image_name: str, caption: str, cap_file_path: str, success: bool = False):
        self.detail['current'] = current_step
        self.detail['captions'].append({
            'image': image_name,
            'caption': caption if self.class_token is None or self.class_token == "" else f"{self.class_token}, {caption}",
            'path': cap_file_path,
            'success': success
        })
        return 

    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to enum """
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        
        d.pop('model_info')
        d.pop('captioning')
        # Convert training parameters
        if verbose is True and self.model_info:
            d['model_info'] = asdict(self.model_info)
            d['captioning'] = self.captioning.__name__
        
        return d

    def update_detail_with_tb(self):
        # do nothing
        pass

class TaskChian:

    def __init__(self, task: Task, sub_tasks: List['SubTask']):
        self.task = task
        self.sub_tasks = sub_tasks
        self.current = 0
    
    def excute(self):
        if self.current == len(self.sub_tasks):
            return
        sub_task = self.sub_tasks[self.current]
        self.current += 1
        self.task.phase = type(sub_task).__name__
        sub_task.do_task(self.task, self)


class SubTask:

    def __init__(self, module_path: str):
        self.module_path = module_path
        self.executable = os.path.join(module_path, "venv", "bin", "python")
        self.customize_env = os.environ.copy()
        self.customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        self.customize_env["PYTHONUNBUFFERED"] = "1"
        self.customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"
        self.customize_env["NCCL_P2P_DISABLE"]="1" # For flux training, we disable NCCL P2P and IB
        self.customize_env["NCCL_IB_DISABLE"]="1"
        self.customize_env["PYTHONPATH"] = f"{self.module_path}:{os.path.join(self.module_path, 'src')}"

    def wait(self, proc: Popen, task: Task = None, detail: dict = None):
        try:
            logger.info("beginning to run proc communication with task training process")
            linestr = ''
            line = bytearray()
            while True:
                ch = proc.stdout.read(1)
                if ch == b'' and proc.poll() is not None:
                    break
                line.extend(ch)
                if ch == b'\n' or ch == b'\r':
                    linestr = line.decode('utf-8', errors='ignore')
                    print(linestr, end='')
                    if task is not None:
                        task.stdout_lines.append(linestr)
                    if detail is not None:
                        parse_kohya_progress_line(linestr, detail)
                        parse_kohya_stdout(linestr, detail)
                    line = bytearray()  #

            stdout, stderr = proc.communicate()
        except TimeoutExpired as exc:
            proc.kill()
            proc.wait()
            raise
        except:
            proc.kill()
            raise

        retcode = proc.poll()
        if retcode != 0:
            logger.error(f"training subprocess {self.__class__.__name__} run failed, retcode is {retcode}")
            raise Exception(f"training subprocess {self.__class__.__name__}run failed, retcode is {retcode}")

        logger.info(f"training subprocess {self.__class__.__name__} run complete successfully, retcode is {retcode}")
        return          

