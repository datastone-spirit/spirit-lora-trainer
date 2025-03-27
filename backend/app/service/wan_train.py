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
    
    def start_train(self, parameter: WanTrainingParameter) -> Task:
        taskid = uuid.uuid4().hex
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        parameter.config.log_dir = os.path.join(getprojectpath(), "logs", f"wan-{taskid}-{timestamp}")
        os.makedirs(parameter.config.log_dir, exist_ok=True)
        return self.run_train(parameter, task_id=taskid, module_path=self.module_path)


    @task_decorator 
    def run_train(self, training_paramters: WanTrainingParameter, task_id: str=None, module_path:str = None):
        return Task.wrap_wan_training(training_paramters, task_id, module_path)    