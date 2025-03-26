import os
import subprocess
import uuid
from task.task import Task
from app.api.model.wan_paramter import WanTrainingParameter
from app.api.common.utils import dataset2toml
from datetime import datetime
from typing import Optional
import sys

from utils.util import getprojectpath, setup_logging

from task.manager import task_decorator
setup_logging()
import logging
logger = logging.getLogger(__name__)

class WanTrainingService():

    def __init__(self) -> 'WanTrainingService':
        self.module_path = os.path.join(getprojectpath(), "musubi-tuner")
        if not os.path.exists(self.module_path):
            raise FileNotFoundError(f"Training script not found at {self.module_path}")
        self.script = os.path.join(self.module_path, " wan_train_network.py")
        if not os.path.exists(self.script):
            raise FileNotFoundError(f"Training script not found at {self.script}")
    
    def start_train(self, parameter: WanTrainingParameter) -> Task:
        taskid = uuid.uuid4().hex
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        parameter.config.log_dir = os.path.join(getprojectpath(), "logs", f"wan-{taskid}-{timestamp}")
        os.makedirs(parameter.config.log_dir, exist_ok=True)

        datasetpath = dataset2toml(parameter.dataset)
        parameter.config.dataset = datasetpath
        configpath = dataset2toml(parameter.config)

        logger.info(f"configpath is {configpath}, datasetpath is {datasetpath}")
        return self.run_train(configpath, script=self.script, training_paramters=parameter, task_id=taskid)


    @task_decorator 
    @task_decorator 
    def run_train(self,
              config_file: str,
              script: str = "",
              training_paramters: WanTrainingParameter = None,
              cpu_threads: Optional[int] = 2,
              task_id: str=None):

        args = [
            sys.executable, "-m", "accelerate.commands.launch",
            "--num_cpu_threads_per_process", str(cpu_threads),
 --         "--mixed_precision", "bf16",
            "--quiet",
            script,
            "--config_file", config_file,
        ]

        customize_env = os.environ.copy()
        customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        customize_env["PYTHONUNBUFFERED"] = "1"
        customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"
        customize_env["NCCL_P2P_DISABLE"]="1" # For flux training, we disable NCCL P2P and IB
        customize_env["NCCL_IB_DISABLE"]="1"
        proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=customize_env)
        return Task.wrap_wan_training(proc, training_paramters, task_id)    