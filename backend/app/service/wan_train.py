import os
import uuid
from task.task import Task
from task.wan_task import WanTrainingTask
from app.api.model.wan_paramter import WanTrainingParameter, is_wan22_task, is_i2v 
from datetime import datetime

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
        log_prefix = ""
        if is_wan22_task(parameter.config.task):
            if is_i2v(parameter.config.task):
                log_prefix = f'wan22-{parameter.config.output_name}-{"low" if parameter.dit_model_type == "low" else "high"}-i2v-{timestamp}-{taskid}'
            else:
                log_prefix = f'wan22-{parameter.config.output_name}-{"low" if parameter.dit_model_type == "low" else "high"}-t2v-{timestamp}-{taskid}'
        else:
            if is_i2v(parameter.config.task):
                log_prefix = f'wan20-{parameter.config.output_name}-i2v-{timestamp}-{taskid}'
            else:
                log_prefix = f'wan21-{parameter.config.output_name}-t2v-{timestamp}-{taskid}'
            
        parameter.config.logging_dir = os.path.join(getprojectpath(), "logs", log_prefix)
        os.makedirs(parameter.config.logging_dir, exist_ok=True)
        return self.run_train(parameter, task_id=taskid, module_path=self.module_path)


    @task_decorator 
    def run_train(self, training_paramters: WanTrainingParameter, task_id: str=None, module_path:str = None):
        return WanTrainingTask.from_parameter(training_paramters, task_id, module_path,
                                      is_sampling = True \
                                          if training_paramters.config.sample_prompts \
                                          and os.path.exists(training_paramters.config.sample_prompts) \
                                              else False)