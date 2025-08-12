import os
import uuid
from task.task import Task
from app.api.model.qwenimage_parameter import QWenImageParameter
from app.api.common.utils import dataset2toml
from datetime import datetime
from utils.util import getprojectpath, setup_logging
from task.manager import task_decorator

setup_logging()
import logging
logger = logging.getLogger(__name__)


class QwenImageTrainingService():
    def __init__(self) -> 'QwenImageTrainingService':
        self.module_path = os.path.join(getprojectpath(), "musubi-tuner")
        if not os.path.exists(self.module_path):
            raise FileNotFoundError(f"Training module not found at {self.module_path}")

    def start_train(self, parameter: QWenImageParameter) -> Task:
        taskid = uuid.uuid4().hex
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        parameter.config.logging_dir = os.path.join(getprojectpath(), "logs", f"qwenimage-{taskid}-{timestamp}")
        os.makedirs(parameter.config.logging_dir, exist_ok=True)
        return self.run_train(parameter, task_id=taskid, module_path=self.module_path)

    @task_decorator
    def run_train(self, parameter: QWenImageParameter, task_id: str, module_path: str) -> Task:
        return Task.wrap_qwenimage_training(parameter, task_id, module_path, is_sampling=False)
