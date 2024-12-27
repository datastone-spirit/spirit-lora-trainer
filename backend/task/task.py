from enum import Enum
from typing import Optional, Callable, List, Dict
from subprocess import Popen
from dataclasses import dataclass, asdict
from app.api.model.training_paramter import TrainingParameter
from app.api.model.captioning_model import CaptioningModelInfo
from subprocess import Popen, TimeoutExpired
import uuid
import re
from tbparse import SummaryReader
import time


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class TaskType(Enum):
    NONE = "none"
    TRAINING = "training"
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

    @staticmethod
    def wrap_training(proc : Popen, training_paramter: TrainingParameter, task_id: str) -> 'Task':
        task = TrainingTask()
        task.status = TaskStatus.CREATED
        task.proc = proc
        task.training_parameters = training_paramter
        task.detail = {}
        if training_paramter.config.log_prefix is None or training_paramter.config.log_prefix == '':
            raise Exception("[Bug] log_prefix should not be empty or none")

        if task_id is not None or task_id != '':
            task.id = task_id
        elif training_paramter.config.log_prefix is not None or training_paramter.config.log_prefix != '':
            task.id = training_paramter.config.log_prefix
        else:
            task.id = uuid.uuid4().hex

        task.task_type = TaskType.TRAINING
        task.start_time = time.time()
        return task

    @staticmethod
    def wrap_captioning_task(image_paths: List[str], output_dir: str, cap_model: CaptioningModelInfo) -> 'Task':
        task = CaptioningTask()
        task.status = TaskStatus.CREATED
        task.image_paths = image_paths
        task.output_dir = output_dir
        task.detail = {
            'captions': [],
            'total': len(image_paths),
            'current': -1
        }
        task.model_info = cap_model
        task.id = uuid.uuid4().hex
        task.task_type = TaskType.CAPTIONING
        task.captioning = cap_model.captioning
        return task    

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
    
    def to_dict(self, verbose: bool = False):
        raise NotImplementedError 
    
    def __str__(self):
        return f"{self.to_dict(verbose=True)}"

@dataclass
class TrainingTask(Task):
    proc: Popen = None
    training_parameters: TrainingParameter = None 

    def _get_proc_info(self):
        """Extract relevant info from Popen object"""
        if not self.proc:
            return None
        return {
            'pid': self.proc.pid if self.proc.pid else None,
            'returncode': self.proc.returncode,
            'args': self.proc.args
        }

    def _run(self):
        try:
            logger.info("beginning to run proc communication with training process")
            #self.proc = subprocess.Popen(self.proc.args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            stdout_lines = []
            linestr = ''
            line = bytearray()
            while True:
                ch = self.proc.stdout.read(1)
                if ch == b'' and self.proc.poll() is not None:
                    break
                line.extend(ch)
                if ch == b'\n':
                    linestr = line.decode('utf-8', errors='ignore')
                    print(linestr, end='')
                    self.parse_progress_line(linestr) 
                    stdout_lines.append(linestr)
                    self.parse_stdout(linestr)
                    line = bytearray()  #
            stdout, stderr = self.proc.communicate()
        except TimeoutExpired as exc:
            self.proc.kill()
            self.proc.wait()
            raise
        except:
            self.proc.kill()
            raise

        retcode = self.proc.poll()
        if retcode != 0:
            logger.error(f"training subprocess run failed, retcode is {retcode}")
            raise Exception(f"training subprocess run failed, retcode is {retcode}")

        logger.info(f"training subprocess run complete successfully, retcode is {retcode}")
        return 

    def to_dict(self, verbose: bool = False):
        """Override to_dict to handle Popen serialization"""
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        d.pop('training_parameters') 
        d.pop('proc') 
        # Replace proc with safe dict
        if verbose is True and self.proc:
            d['proc'] = self._get_proc_info()
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        # Convert training parameters
        if verbose is True and self.training_parameters:
            d['training_parameters'] = asdict(self.training_parameters)
        return d

    def parse_stdout(self, stdout):
        """_summary_

        Args:
            stdout (_type_): _description_

need to parse the following information, include number of train images, number of reg images, number of batches per epoch, number of epochs, batch size per device, gradient accumulation steps, total optimization steps
running training / 学習開始
num train images * repeats / 学習画像の数×繰り返し回数: 10
num reg images / 正則化画像の数: 0
num batches per epoch / 1epochのバッチ数: 10
num epochs / epoch数: 10
batch size per device / バッチサイズ: 1
gradient accumulation steps / 勾配を合計するステップ数 = 1
total optimization steps / 学習ステップ数: 100
        """
        pattern = {
             "num_train_images": r"num train images \* repeats .*?: (\d+)",
             "num_reg_images": r"num reg images .*?: (\d+)",
             "num_batches_per_epoch": r"num batches per epoch .*?: (\d+)",
             "num_epochs": r"num epochs .*?: (\d+)",
             "batch_size_per_device": r"batch size per device .*?: (\d+)",
             "gradient_accumulation_steps": r"gradient accumulation steps .*?=? (\d+)",
             "total_optimization_steps": r"total optimization steps .*?: (\d+)"
         }
         
        for key, regex in pattern.items():
            match = re.search(regex, stdout)
            if match:
                self.detail[key] = int(match.group(1))

    def parse_progress_line(self, line):
        """Parse elements from progress bar output
        
        Examples:
            >>> parse_progress_line("steps: 100%|██████████| 40/40 [00:42<00:00,  1.07s/it, avr_loss=0.145]")
            {
                'progress': 100,
                'current': 40,
                'total': 40,
                'elapsed': '00:42',
                'remaining': '00:00',
                'speed': 1.07,
                'loss': 0.145
            }
        """
        if not ('|' in line and '%' in line and 'steps' in line and '/' in line ):
            return
            
        patterns = {
            'steps': r'\|?\s*(\d+)/(\d+)',
            'time': r'\[(.*?)(?=<)<(.*?)(?=,)',  # Using lookahead to exclude < and ,
            'speed': r'([\d.]+)s/it',
            'loss': r'avr_loss=([\d.]+)'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, line)
            if match:
                if key == 'steps' and self.detail.get('total') is None:
                    self.detail['total'] = int(match.group(2))
                elif key == 'time':
                    self.detail['elapsed'] = match.group(1)
                    self.detail['remaining'] = match.group(2)
                elif key == 'speed':
                    self.detail[key] = float(match.group(1))

    def update_detail_with_tb(self):
        import os
        log_path = get_logdir(self.training_parameters.config.logging_dir, self.training_parameters.config.log_prefix)
        if log_path is None:
            #logger.warning(f"task {self.id} log path is not found")
            return
        if not os.path.exists(log_path):
            #logger.warning(f"task {self.id} log path {log_path} is not exists, waiting the training start")
            return
        reader = SummaryReader(log_path)
        df=reader.scalars
        current = max(df['step'])
        self.detail['current'] = current
        self.detail['loss_avr'] = float(df[df['step']==current][df['tag']=='loss/average']['value'].values[0])
        self.detail['loss'] = float(df[df['step']==current][df['tag']=='loss/current']['value'].values[0])
        self.detail['lr_unet'] = float(df[df['step']==current][df['tag']=='lr/unet']['value'].values[0])
        total = int(self.detail.get('total', 0))
        if total > 0:
            self.detail['progress'] = round((current / total * 100), 2)
        





@dataclass
class CaptioningTask(Task):
    image_paths: List[str] = None
    output_dir: str = None
    captioning: Optional[Callable] = None
    model_info: Optional[CaptioningModelInfo] = None

    def _run(self):
        self.captioning(self.image_paths, self.output_dir, self.model_info, self.update_captioning_status)

    def update_captioning_status(self, current_step: int, image_name: str, caption: str, cap_file_path: str, success: bool = False):
        self.detail['current'] = current_step
        self.detail['captions'].append({
            'image': image_name,
            'caption': caption,
            'path': cap_file_path,
            'success': success
        })
        return 

    def to_dict(self, verbose: bool = False):
        """Override to_dict to enum """
        logger.info(f"let the task: {self.id} to dict")
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
        
        logger.info(f"task dict result: {d}")
        return d

