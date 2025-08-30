import os
import uuid
from task.task import Task
from task.qwenimage_task import QwenImageTrainingTask
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
        parameter.config.logging_dir = os.path.join(getprojectpath(), "logs", f"qwenimage-{parameter.config.output_name}{'-edit' if parameter.config.edit else ''}-{timestamp}-{taskid}")
        os.makedirs(parameter.config.logging_dir, exist_ok=True)
        return self.run_train(parameter, task_id=taskid, module_path=self.module_path)

    @task_decorator
    def run_train(self, parameter: QWenImageParameter, task_id: str, module_path: str) -> Task:
        return QwenImageTrainingTask.from_parameter(parameter, task_id, module_path,
                                                    is_sampling = True if parameter.config.sample_prompts \
                                                        and os.path.exists(parameter.config.sample_prompts) \
                                                        else False)
