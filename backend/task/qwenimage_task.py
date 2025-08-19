from dataclasses import dataclass, asdict, field
from app.api.model.qwenimage_parameter import QWenImageParameter
from app.api.common.utils import dataset2toml
from task.task import Task, SubTask, TaskChian, TaskType, TaskStatus
from subprocess import Popen, PIPE, STDOUT
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
            d['frontend_config'] = self.qwenimage_parameter.frontend_config
        return d

    def update_detail_with_tb(self):
        """Update detail with tensorboard logs"""
        logdir = self.qwenimage_parameter.config.logging_dir
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
        self.detail['total_epoch'] = self.qwenimage_parameter.config.max_train_epochs
        self.detail['current_loss'] = get_value(step=current_step, tag="loss/current")
        self.detail['average_loss'] = get_value(step=current_step, tag="loss/average")
        self.detail['lr_unet'] = get_value(step=current_step, tag="lr/unet")
        self.detail['lr_group0'] = get_value(step=current_step, tag="lr/group0")
        return

    @classmethod
    def from_parameter(cls, parameter: QWenImageParameter, task_id: str, model_path: str, is_sampling: bool = False) -> 'Task':
        task = cls(parameter, model_path, is_sampling)
        task.status = TaskStatus.CREATED
        task.task_type = TaskType.QWENIMAGE_TRAINING
        task.start_time = time.time()
        if task.is_sampling:
            task.sampling_path = os.path.join(parameter.config.output_dir, "sample")        

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
            from .multi_gpu_train_args import generate_multi_gpu_args
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
