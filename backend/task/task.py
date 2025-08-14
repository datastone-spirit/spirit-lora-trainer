from enum import Enum
from typing import Optional, Callable, List
from dataclasses import dataclass, asdict, field
from app.api.model.training_paramter import TrainingParameter
from app.api.model.wan_paramter import WanTrainingParameter, is_i2v
from app.api.model.hunyuan_paramter import HunyuanTrainingParameter
from app.api.model.kontext_parameter import KontextTrainingParameter
from app.api.model.qwenimage_parameter import QWenImageParameter
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
        task.is_sampling = is_flux_sampling(training_paramter.config)
        if task.is_sampling:
            task.sampling_path = os.path.join(training_paramter.config.output_dir, "sample")
        task.stdout_lines = []
        return task

    @staticmethod
    def wrap_hunyuan_training(proc : Popen, training_paramter: HunyuanTrainingParameter, task_id: str) -> 'Task':
        task = HunyuanTrainingTask()
        task.status = TaskStatus.CREATED
        task.proc = proc 
        task.hunyuan_parameters = training_paramter
        if not task_id:
            task.id = uuid.uuid4().hex
        else:
            task.id = task_id
        task.detail = {
            #total': caculate_image_steps([(dir.path, dir.num_repeats) for dir in training_paramter.dataset.directory]) * training_paramter.config.epochs,
            'current': 0
        }
        task.task_type = TaskType.HUNYUAN_TRAINING
        task.start_time = time.time()
        task.stdout_lines = []
        return task

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

    @staticmethod
    def wrap_wan_training(parameter: WanTrainingParameter, task_id: str, model_path :str, is_sampling: bool = False) -> 'Task':
        task = WanTrainingTask(parameter, model_path, is_sampling)
        if not task_id:
            task.id = uuid.uuid4().hex
        else:
            task.id = task_id
        task.detail = {
            #total': caculate_image_steps([(dir.path, dir.num_repeats) for dir in training_paramter.dataset.directory]) * training_paramter.config.epochs,
            'current': 0
        }
        task.task_type = TaskType.WAN_TRAINING
        task.start_time = time.time()
        task.status = TaskStatus.CREATED
        task.stdout_lines = []
        if task.is_sampling:
            task.sampling_path = os.path.join(parameter.config.output_dir, "sample")
        return task

    @staticmethod
    def wrap_kontext_training(proc: Popen, training_parameter: KontextTrainingParameter, task_id: str) -> 'Task':
        task = KontextTrainingTask()
        task.status = TaskStatus.CREATED
        task.proc = proc
        task.kontext_parameters = training_parameter
        task.detail = {
            'current': 0,
            'stage': 'prepare'
        }
        
        if task_id is not None and task_id != '':
            task.id = task_id
        else:
            task.id = uuid.uuid4().hex

        task.task_type = TaskType.KONTEXT_TRAINING
        task.start_time = time.time()
        task.stdout_lines = []
        task.is_sampling = training_parameter.is_sampling()
        task.sampling_path = training_parameter.sampling_path()
        return task

    @staticmethod
    def wrap_qwenimage_training(parameter: QWenImageParameter, task_id: str, model_path: str, is_sampling: bool = False) -> 'Task':
        task = QwenImageTrainingTask(parameter, model_path, is_sampling)
        task.status = TaskStatus.CREATED
        task.task_type = TaskType.QWENIMAGE_TRAINING
        task.start_time = time.time()
        if not task_id:
            task.id = uuid.uuid4().hex
        else:
            task.id = task_id
        task.detail = {
            'total': 0,
            'current': 0,
            'loss': 0.0,
            'loss_avr': 0.0,
            'lr_unet': 0.0,
            'progress': 0.0
        }
        task.stdout_lines = []
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
    
    def to_dict(self, verbose: bool = False, show_config: bool = False):
        raise NotImplementedError 
    
    def get_log(self) -> List:
        if self.stdout_lines:
            return self.stdout_lines
        return []    

    def __str__(self):
        return f"{self.to_dict(verbose=True)}"

@dataclass
class TrainingTask(Task):
    proc: Popen = None
    training_parameters: TrainingParameter = None 
    is_sampling :bool =  True

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
                    self.stdout_lines.append(linestr)
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

    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to handle Popen serialization"""
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        d.pop('training_parameters') 
        d.pop('proc') 
        d.pop('stdout_lines', None)
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
        
        if show_config is True and self.training_parameters:
            d['frontend_config'] = self.training_parameters.frontend_config
        return d

    def parse_stdout(self, stdout):
        parse_kohya_stdout(stdout, self.detail)

    def parse_progress_line(self, line):
        parse_kohya_progress_line(line, self.detail)


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
        
        # Replace chained indexing with single filter query operation to suppress warning messages
        
        self.detail['loss_avr'] = float(df.query('step==@current and tag=="loss/average"')['value'].iloc[0])
        self.detail['loss'] = float(df.query('step==@current and tag=="loss/current"')['value'].iloc[0]) 
        self.detail['lr_unet'] = float(df.query('step==@current and tag=="lr/unet"')['value'].iloc[0])        
        
        #self.detail['loss_avr'] = float(df[df['step']==current][df['tag']=='loss/average']['value'].values[0])
        #self.detail['loss'] = float(df[df['step']==current][df['tag']=='loss/current']['value'].values[0])
        #self.detail['lr_unet'] = float(df[df['step']==current][df['tag']=='lr/unet']['value'].values[0])
        
        total = int(self.detail.get('total', 0))
        if total > 0:
            self.detail['progress'] = round((current / total * 100), 2)

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

@dataclass
class HunyuanTrainingTask(Task):
    proc: Popen = None
    hunyuan_parameters: HunyuanTrainingParameter = None 

    def _run(self):
        try:
            logger.info("beginning to run proc communication with hunyuan training process")
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
                    self.stdout_lines.append(linestr)
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

    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to enum """
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        d.pop('hunyuan_parameters') 
        d.pop('proc') 
        d.pop('stdout_lines', None)
        if show_config is True and self.hunyuan_parameters:
            d['frontend_config'] = self.hunyuan_parameters.frontend_config
        return d

    def update_detail_with_tb(self):
        logdir = self.hunyuan_parameters.config.log_dir
        reader = SummaryReader(logdir)
        df=reader.scalars
        current_step = max(df.get('step', [0]))
        if current_step == 0:
            return 

        def get_value(step=None, tag=None):
            try:
                return df.query('step==@step and tag==@tag')['value'].iloc[0]
            except Exception as e:
                logger.warning(f"get value failed with step {step} and tag {tag}, error: {e}")
                return 0

        self.detail['current'] = current_step
        self.detail['elapsed'] = time.time() - self.start_time
        self.detail['loss'] = get_value(step=current_step, tag="train/loss")
        self.detail['total_epoch'] = self.hunyuan_parameters.config.epochs

        epoch_seq = df.query('tag=="train/epoch_loss"').get('step', None)
        if epoch_seq is None or len(epoch_seq) == 0:
            return
        current_epoch = max(epoch_seq.values)
        self.detail['current_epoch'] = int(current_epoch)
        if current_epoch == 1:
            self.detail['estimate_steps_per_epoch'] = current_step
        self.detail['epoch_loss']=get_value(step=current_epoch, tag="train/epoch_loss")
        
@dataclass
class WanTrainingTask(Task):
    wan_parameter: WanTrainingParameter = None 
    is_sampling :bool = False
    phase: str = None
    model_path: str = None

    def __init__(self, parameter: WanTrainingParameter, module_path: str, is_sampling: bool):
        self.wan_parameter = parameter
        self.is_sampling = is_sampling
        self.task_chain = TaskChian(self, [
            WanPrepareJsonlFileSubTask(module_path),
            WanCacheLatentSubTask(module_path), 
            WanTextEncoderOutputCacheSubTask(module_path), 
            WanTrainingSubTask(module_path)])
    
    def _run(self):
        logger.info("beginning to run all subtasks")
        self.task_chain.excute()
        return
    
    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to enum """
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        d.pop('wan_parameter') 
        d.pop('task_chain')
        d.pop('stdout_lines', None)
        if show_config is True and self.wan_parameter:
            d['frontend_config'] = self.wan_parameter.frontend_config
        return d

    def update_detail_with_tb(self):
        logdir = self.wan_parameter.config.logging_dir
        reader = SummaryReader(logdir)
        df=reader.scalars
        current_step = max(df.get('step', [0]))
        if current_step == 0:
            return 

        def get_value(step=None, tag=None):
            try:
                return df.query('step==@step and tag==@tag')['value'].iloc[0]
            except Exception as e:
                logger.warning(f"get value failed with step {step} and tag {tag}, error: {e}")
                return 0

        self.detail['current'] = current_step
        self.detail['loss'] = get_value(step=current_step, tag="loss/current")
        self.detail['total_epoch'] = self.wan_parameter.config.max_train_epochs
        self.detail['current_loss'] = get_value(step=current_step, tag="loss/current")
        self.detail['average_loss'] = get_value(step=current_step, tag="loss/average")
        self.detail['lr_unet'] = get_value(step=current_step, tag="lr/unet")
        self.detail['lr_group0'] = get_value(step=current_step, tag="lr/group0")
        return

@dataclass
class KontextTrainingTask(Task):
    proc: Popen = None
    kontext_parameters: KontextTrainingParameter = None

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
            logger.info("beginning to run proc communication with kontext training process")
            linestr = ''
            line = bytearray()
            while True:
                ch = self.proc.stdout.read(1)
                if ch == b'' and self.proc.poll() is not None:
                    break
                line.extend(ch)
                if ch == b'\n' or ch == b'\r':
                    linestr = line.decode('utf-8', errors='ignore')
                    print(linestr, end='')
                    self.parse_kontext_progress_line(linestr)
                    self.stdout_lines.append(linestr)
                    line = bytearray()
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
            logger.error(f"kontext training subprocess run failed, retcode is {retcode}")
            raise Exception(f"kontext training subprocess run failed, retcode is {retcode}")

        logger.info(f"kontext training subprocess run complete successfully, retcode is {retcode}")
        return

    def parse_kontext_progress_line(self, line):
        """Parse Kontext training output to extract training status"""
        import re
        
        line = line.strip()
        
        # Check if we're still in preparation stage
        if any(keyword in line for keyword in [
            "Loading Flux Kontext model", "Loading transformer", "Loading T5", 
            "Loading CLIP", "Loading VAE", "Making pipe", "Preparing Model",
            "create LoRA network", "Dataset:", "Preprocessing image dimensions",
            "Found", "images", "Bucket sizes", "Caching latents", "Generating baseline samples"
        ]):
            self.detail['stage'] = 'prepare'
            # Extract dataset information
            if "Dataset:" in line:
                dataset_path = line.split("Dataset:")[-1].strip()
                self.detail['dataset_path'] = dataset_path
            elif "Found" in line and "images" in line:
                # Extract number of images found
                match = re.search(r'Found (\d+) images', line)
                if match:
                    self.detail['total_images'] = int(match.group(1))
            return

        # Get model name from configuration
        model_name = self.kontext_parameters.config.name if self.kontext_parameters and self.kontext_parameters.config else "unknown"
        
        # Parse the main training progress line using the specific model name from configuration
        # Format: model_name: progress% |progress_bar| step/total_steps [elapsed<remaining, speed, lr: learning_rate loss: loss_value]
        # Use model name from configuration to create specific pattern
        escaped_model_name = re.escape(model_name)
        progress_pattern = rf'{escaped_model_name}:\s*(\d+)%\|[^|]*\|\s*(\d+)/(\d+)\s*\[([^,]+)<([^,]+),\s*([^,]+),\s*lr:\s*([\d.e-]+)\s+loss:\s*([\d.e-]+)\]'
        
        match = re.search(progress_pattern, line)
        if match:
            progress_percent = int(match.group(1))
            current_step = int(match.group(2))
            total_steps = int(match.group(3))
            elapsed_time = match.group(4).strip()
            remaining_time = match.group(5).strip()
            speed = match.group(6).strip()
            learning_rate = float(match.group(7))
            loss_value = float(match.group(8))
            
            # Update detail dictionary using model name from configuration
            self.detail.update({
                'stage': 'training',
                'model_name': model_name,  # Use model name from configuration
                'progress_percent': progress_percent,
                'current': current_step,
                'total': total_steps,
                'elapsed_time_str': elapsed_time,
                'remaining_time_str': remaining_time,
                'speed_str': speed,
                'learning_rate': learning_rate,
                'loss': loss_value
            })
            
            # Calculate estimated total training time
            if current_step > 0:
                elapsed_seconds = time.time() - self.start_time
                estimated_total_seconds = (elapsed_seconds / current_step) * total_steps
                self.detail['estimated_total_time_seconds'] = estimated_total_seconds
                
                # Parse speed to get actual step time
                speed_match = re.search(r'([\d.]+)s/it', speed)
                if speed_match:
                    seconds_per_step = float(speed_match.group(1))
                    self.detail['seconds_per_step'] = seconds_per_step

    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to handle Popen serialization"""
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        d.pop('kontext_parameters', None)
        d.pop('proc', None)
        d.pop('stdout_lines', None)
        
        # Replace proc with safe dict
        if verbose is True and self.proc:
            d['proc'] = self._get_proc_info()
        
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        
        # Convert training parameters
        if verbose is True and self.kontext_parameters:
            d['kontext_parameters'] = asdict(self.kontext_parameters)
        
        if show_config is True and self.kontext_parameters:
            d['frontend_config'] = self.kontext_parameters.frontend_config
        
        return d

    def update_detail_with_tb(self):
        # Kontext training doesn't use tensorboard by default
        # The progress is parsed from stdout directly
        pass

    


class TaskChian:

    def __init__(self, task: WanTrainingTask, sub_tasks: List['SubTask']):
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

    def wait(self, proc: Popen, task: WanTrainingTask = None, detail: dict = None):
        try:
            logger.info("beginning to run proc communication with task training process")
            linestr = ''
            line = bytearray()
            while True:
                ch = proc.stdout.read(1)
                if ch == b'' and proc.poll() is not None:
                    break
                line.extend(ch)
                if ch == b'\n':
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
    
class WanPrepareJsonlFileSubTask(SubTask):
    def __init__(self, module_path: str):
        super().__init__(module_path)
    
    def _gen_jsonl_file(self, data_dir: str, is_video: bool = False):
        import json
        json_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jsonl")
        exts = [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".tif", ".gif"]
        if is_video:
            exts = [".mp4", ".avi", ".mov", ".mkv", ".flv", ".wmv"]

        with open(json_file.name, 'w+', encoding='utf-8') as f:
            for path, caption, _ in get_dataset_contents(data_dir, exts):
                if is_video:
                    entry = {
                        "video_path": path,
                        "caption": caption,
                    }
                else:
                    entry = {
                        "image_path": path,
                        "caption": caption,
                        "init_frame_weight": 0.8
                    }
                f.write(json.dumps(entry, ensure_ascii=False))
                f.write("\n")
        return json_file.name 
    
    def do_task(self, task: WanTrainingTask, task_chain: TaskChian):
        logger.info("beginning to run prepare wan jsonl file sub task")
        for i in range(len(task.wan_parameter.dataset.datasets)):
            ds = task.wan_parameter.dataset.datasets[i] 
            video_data = True
            if ds.video_directory and os.path.exists(ds.video_directory):
                task.wan_parameter.dataset.datasets[i].video_jsonl_file = self._gen_jsonl_file(ds.video_directory, is_video=True)
            elif ds.image_directory and os.path.exists(ds.image_directory):
                video_data = False
                task.wan_parameter.dataset.datasets[i].image_jsonl_file= self._gen_jsonl_file(ds.image_directory)
            else:
                logger.warning(f"dataset {i} video_directory {ds.video_directory} and image_directory {ds.image_directory} are both not exists")
                raise Exception(f"dataset {i} video_directory {ds.video_directory} and image_directory {ds.image_directory} are both not exists")

            if video_data and os.path.getsize(task.wan_parameter.dataset.datasets[i].video_jsonl_file) == 0:
                logger.warning(f"dataset {i} video jsonl exists but empty, "
                               f"there are no valid data file in the directory {ds.video_directory} ")
                raise Exception(f"dataset {i} video jsonl file are both empty,"
                                f" there are no valid data files in the directory {ds.video_directory}")

            if not video_data and os.path.getsize(task.wan_parameter.dataset.datasets[i].image_jsonl_file) == 0:
                logger.warning(f"dataset {i} image jsonl file is empty, "
                               f"there is no valid data file in the directory {ds.image_directory} ")
                raise Exception(f"dataset {i} image jsonl file is empty,"
                               f"there is no valid data file in the directory {ds.image_directory} ")

            logger.info(f"Dataset {i}: video_jsonl_file={task.wan_parameter.dataset.datasets[i].video_jsonl_file}, "
                        f"image_jsonl_file={task.wan_parameter.dataset.datasets[i].image_jsonl_file}")
        return task_chain.excute()

class WanCacheLatentSubTask(SubTask):

    def __init__(self, module_path: str):
        super().__init__(module_path)
        self.script = os.path.join(module_path, "wan_cache_latents.py")
    
    def do_task(self, task: WanTrainingTask, task_chain: TaskChian):
        logger.info("beginning to run cache latent sub task")
        if task.wan_parameter.skip_cache_latent:
            logger.warning("Cache latent sub task is skipped due to skip_cache_latent is set to True")
            return task_chain.excute()
        
        args = [
            self.executable, 
            self.script,
            "--dataset_config", 
            dataset2toml(task.wan_parameter.dataset),
            "--vae",
            task.wan_parameter.config.vae,
        ]
        if is_i2v(task.wan_parameter.config.task):
            args.append("--clip")
            args.append(task.wan_parameter.config.clip)
        self.wait(Popen(args, stdout=PIPE, stderr=STDOUT, env=self.customize_env), task=task)
        return task_chain.excute()

class WanTextEncoderOutputCacheSubTask(SubTask):
    
    def __init__(self, module_path: str):
        super().__init__(module_path)
        self.script = os.path.join(module_path, "wan_cache_text_encoder_outputs.py")
    
    def do_task(self, task: WanTrainingTask, task_chain: TaskChian):
        logger.info("beginning to run text encoder output cache sub task")
        if task.wan_parameter.skip_cache_text_encoder_latent:
            logger.warning("Cache text encoder latent sub task is skipped due to skip_text_encoder_latent is set to True")
            return task_chain.excute()

        args = [
            self.executable, 
            self.script,
            "--dataset_config",
            dataset2toml(task.wan_parameter.dataset),
            "--batch_size", 
            "16",
            "--t5", 
            task.wan_parameter.config.t5,
        ]
        self.wait(Popen(args, stdout=PIPE, stderr=STDOUT, env=self.customize_env), task=task)
        return task_chain.excute()

class WanTrainingSubTask(SubTask):
    def __init__(self, module_path: str):
        super().__init__(module_path)
        self.executable = os.path.join(module_path, "venv", "bin","accelerate")
        self.script = os.path.join(module_path, "wan_train_network.py")
    
    def do_task(self, task: WanTrainingTask, task_chain: TaskChian):
        #task.wan_parameter.config.dataset_config = dataset2toml(task.wan_parameter.dataset)
        args = [
            self.executable,
            "launch",
            "--num_processes", "4",
            "--mixed_precision", "bf16",
            self.script,
            "--config", dataset2toml(task.wan_parameter.config),
            "--dataset_config", dataset2toml(task.wan_parameter.dataset),
        ]
        self.wait(Popen(args, stdout=PIPE, stderr=STDOUT, env=self.customize_env), task=task, detail=task.detail)
        return task_chain.excute()


@dataclass
class QwenImageTrainingTask(Task):
    qwenimage_parameter: QWenImageParameter = None
    is_sampling: bool = False
    phase: str = None
    model_path: str = None

    def __init__(self, parameter: QWenImageParameter, model_path: str, is_sampling: bool):
        super().__init__()
        self.qwenimage_parameter = parameter
        self.model_path = model_path
        self.is_sampling = is_sampling
        self.detail = {'current': 0, 'total': 0}
        
        # Initialize task chain with subtasks
        sub_tasks = [
            QwenImageCacheLatentSubTask(model_path),
            QwenImageCacheTextEncoderOutputSubTask(model_path),
            QwenImageTrainingSubTask(model_path)
        ]
        self.task_chain = TaskChian(self, sub_tasks)
    
    def _run(self):
        logger.info("beginning to run QwenImage training task chain")
        self.task_chain.excute()
    
    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to handle serialization"""
        d = dict(self.__dict__)
        d.pop('qwenimage_parameter')
        d.pop('task_chain', None)
        d.pop('stdout_lines', None)
        
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        
        if verbose is True and self.qwenimage_parameter:
            d['qwenimage_parameter'] = asdict(self.qwenimage_parameter)
        
        if show_config is True and self.qwenimage_parameter:
            d['config'] = asdict(self.qwenimage_parameter)
        return d

    def update_detail_with_tb(self):
        """Update detail with tensorboard logs"""
        pass  # TODO: Implement tensorboard reading for QwenImage training


class QwenImageCacheLatentSubTask(SubTask):
    
    def __init__(self, module_path: str):
        super().__init__(module_path)
        self.script = os.path.join(module_path, "src", "musubi_tuner", "qwen_image_cache_latents.py")
    
    def do_task(self, task: QwenImageTrainingTask, task_chain: TaskChian):
        logger.info("beginning to run QwenImage cache latent sub task")
        if task.qwenimage_parameter.skip_cache_latent:
            logger.info("skip cache latent as requested")
            return task_chain.excute()
        
        args = [
            self.executable,
            self.script,
            "--dataset_config", 
            dataset2toml(task.qwenimage_parameter.dataset),
            "--vae",
            task.qwenimage_parameter.config.vae,
        ]
            
        self.wait(Popen(args, stdout=PIPE, stderr=STDOUT, env=self.customize_env), task=task)
        return task_chain.excute()


class QwenImageCacheTextEncoderOutputSubTask(SubTask):
    
    def __init__(self, module_path: str):
        super().__init__(module_path)
        self.script = os.path.join(module_path, "src", "musubi_tuner", "qwen_image_cache_text_encoder_outputs.py")
    
    def do_task(self, task: QwenImageTrainingTask, task_chain: TaskChian):
        logger.info("beginning to run QwenImage text encoder output cache sub task")
        if task.qwenimage_parameter.skip_cache_text_encoder_output:
            logger.info("skip cache text encoder output as requested")
            return task_chain.excute()

        args = [
            self.executable,
            self.script,
            "--dataset_config",
            dataset2toml(task.qwenimage_parameter.dataset),
            "--text_encoder", 
            task.qwenimage_parameter.config.text_encoder,
        ]
        
            
        if task.qwenimage_parameter.config.fp8_vl:
            args.append("--fp8_vl")
            
        self.wait(Popen(args, stdout=PIPE, stderr=STDOUT, env=self.customize_env), task=task)
        return task_chain.excute()


class QwenImageTrainingSubTask(SubTask):
    
    def __init__(self, module_path: str):
        super().__init__(module_path)
        self.executable = os.path.join(module_path, "venv", "bin", "accelerate")
        self.script = os.path.join(module_path, "src", "musubi_tuner", "qwen_image_train_network.py")
    
    def do_task(self, task: QwenImageTrainingTask, task_chain: TaskChian):
        logger.info("beginning to run QwenImage training sub task")

        base_args = [
               self.script,
               "--config_file", dataset2toml(task.qwenimage_parameter.config),
               "--dataset_config", dataset2toml(task.qwenimage_parameter.dataset),
        ]

        args = [self.executable, "launch"]
        if task.qwenimage_parameter.is_enable_multi_gpu_train():
            from multi_gpu_train_args import generate_multi_gpu_args
            args.extend(generate_multi_gpu_args(task.qwenimage_parameter.multi_gpu_config))
        else: 
            gpu_ids = os.environ.get("CUDA_VISIBLE_DEVICES", "0")
            args.extend([
               "--gpu_ids", gpu_ids,
               "--num_processes", "1",  # Start with single GPU, more processes more memory
               "--mixed_precision", "bf16",
               "--gradient_accumulation_steps", "4",
            ])
        
        args.extend(base_args)
        logger.info(f"Running QwenImage training with args: {args}")
        self.wait(Popen(args, stdout=PIPE, stderr=STDOUT, env=self.customize_env), task=task, detail=task.detail)
        return task_chain.excute()
