import os
import subprocess
import uuid
from task.task import Task
from app.api.model.kontext_parameter import KontextTrainingParameter
from app.api.common.utils import dataset2toml
from datetime import datetime
from utils.dataclass_yaml import save_dataclass_config
import tempfile

from utils.util import getprojectpath, setup_logging

from task.manager import task_decorator
setup_logging()
import logging
logger = logging.getLogger(__name__)

class KontextTrainingService():

    def __init__(self) -> 'KontextTrainingService':
        self.module_path = os.path.join(getprojectpath(), "ai-toolkit")
        self.script = os.path.join(self.module_path, "run.py")
        if not os.path.exists(self.script):
            raise FileNotFoundError(f"Training script not found at {self.script}")
    
    def start_train(self, parameter: KontextTrainingParameter) -> Task:
        taskid = uuid.uuid4().hex
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".yaml")
        temp_file_path = temp_file.name
        # Generate YAML configuration file from KontextTrainingParameter
        configpath = save_dataclass_config(
            obj=parameter,
            output_dir=os.path.dirname(temp_file_path),
            filename=f"{os.path.basename(temp_file_path)}.yaml"
        )

        logger.info(f"Kontext training config path: {configpath}")
        return self.run_train(configpath, script=self.script, training_parameters=parameter, task_id=taskid)

    @task_decorator 
    def run_train(self,
              config_file: str,
              script: str = "",
              training_parameters: KontextTrainingParameter = None,
              task_id: str = None):
        
        # Check if virtual environment exists
        venv_path = os.path.join(self.module_path, "venv")
        python_executable = os.path.join(venv_path, "bin", "python")
        
        if not os.path.exists(python_executable):
            raise FileNotFoundError(f"Python executable not found at {python_executable}")

        args = [
            python_executable,
            script,
            config_file,
        ]

        # Set up environment variables
        customize_env = os.environ.copy()
        customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        customize_env["PYTHONUNBUFFERED"] = "1"
        customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"
        customize_env["NCCL_P2P_DISABLE"] = "1"  # For Kontext LoRA training, disable NCCL P2P and IB
        customize_env["NCCL_IB_DISABLE"] = "1"
        
        proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=customize_env, 
                                cwd=self.module_path)  
        return Task.wrap_kontext_training(proc, training_parameters, task_id)