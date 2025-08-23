import os
import subprocess
import uuid
from task.task import Task
from task.hunyuan_task import HunyuanTrainingTask
from app.api.model.hunyuan_paramter import HunyuanTrainingParameter
from app.api.common.utils import dataset2toml
from datetime import datetime

from utils.util import getprojectpath, setup_logging

from task.manager import task_decorator
setup_logging()
import logging
logger = logging.getLogger(__name__)

class HunyuanTrainingService():

    def __init__(self) -> 'HunyuanTrainingService':
        self.module_path = os.path.join(getprojectpath(), "diffusion-pipe")
        self.script = os.path.join(self.module_path, "train.py")
        if not os.path.exists(self.script):
            raise FileNotFoundError(f"Training script not found at {self.script}")
    
    def start_train(self, parameter: HunyuanTrainingParameter) -> Task:
        taskid = uuid.uuid4().hex
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        parameter.config.log_dir = os.path.join(getprojectpath(), "logs", f"hunyuan-{taskid}-{timestamp}")
        os.makedirs(parameter.config.log_dir, exist_ok=True)

        datasetpath = dataset2toml(parameter.dataset)
        parameter.config.dataset = datasetpath
        configpath = dataset2toml(parameter.config)

        logger.info(f"configpath is {configpath}, datasetpath is {datasetpath}")
        return self.run_train(configpath, script=self.script, training_paramters=parameter, task_id=taskid)


    @task_decorator 
    def run_train(self,
              config_file: str,
              script: str = "",
              training_paramters: HunyuanTrainingParameter = None,
              task_id: str=None):
        
        executable = os.path.join(getprojectpath(), "diffusion-pipe", "venv", "bin", "deepspeed")
        if not os.path.exists(executable):
            raise FileNotFoundError(f"Deepspeed executable not found at {executable}")

        args = [
            executable,
            script,
            "--deepspeed",
            "--config", config_file,
        ]

        customize_env = os.environ.copy()
        customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        customize_env["PYTHONUNBUFFERED"] = "1"
        customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"
        customize_env["NCCL_P2P_DISABLE"]="1" # For flux training, we disable NCCL P2P and IB
        customize_env["NCCL_IB_DISABLE"]="1"
        proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=customize_env, 
                                cwd=self.module_path)  
        return HunyuanTrainingTask.from_parameter(proc, training_paramters, task_id)