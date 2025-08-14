from dataclasses import dataclass
from app.api.model.training_paramter import TrainingParameter
from app.api.model.wan_paramter import WanTrainingParameter, is_i2v
from app.api.common.utils import dataset2toml, get_dataset_contents
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

    @classmethod
    def from_parameter(cls, parameter: WanTrainingParameter, task_id: str, model_path :str, is_sampling: bool = False) -> 'Task':
        task = cls(parameter, model_path, is_sampling)
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

