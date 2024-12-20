import os
import shutil
import yaml
from typing import Optional
import sys
from ..api.model.training_paramter import TrainingParameter
from ..api.common.utils import validate_parameter, dataset2toml, config2toml
from utils.util import getprojectpath 
import uuid
import logging
import subprocess
from task.manager import task_decorator
from task.task import Task
import re
from utils.util import pathFormat

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)


class TrainingService:

    def __init__(self) -> 'TrainingService':
        self.script = f"{getprojectpath()}/sd-scripts/flux_train_network.py"


    def training(self, parameters :TrainingParameter):
        valid, reason = validate_parameter(parameters)
        if not valid:
            logger.warning(f"valid parameters error: {parameters}")
            raise ValueError(f"valid reqest failed, reason: {reason}")
        
        #
        # FIXME: we pre-create the taskid here, and set it to the log_prefix
        # for tensorborad log parsing, so the user log_preifix configuration will
        # be overwrited by this taskid value
        #
        taskid = uuid.uuid4().hex
        parameters.config.log_prefix = taskid

        dataset_path = dataset2toml(parameters.dataset)
        config_file = config2toml(parameters.config, dataset_path)

        try:
            self.clear_npz_files(parameters.dataset.datasets[0].subsets[0].image_dir)
        except Exception as e:
            logger.warning(f"clear npz files failed, ignored, error:", exc_info=e)

        return self.run_train(config_file, script=self.script, training_paramters=parameters)
    
    def clear_npz_files(self, directory: str):
        """
        Deletes all .npz files in the specified directory.

        Args:
            directory (str): The path to the directory where .npz files will be deleted.
        """
        full_path = pathFormat(directory)
        # Iterate through files in the directory
        for file_name in os.listdir(full_path):
            file_path = os.path.join(full_path, file_name)
            # Check if it is a .npz file and delete it
            if os.path.isfile(file_path) and file_name.endswith('.npz'):
                try:
                    os.remove(file_path)
                    logger.info(f"Deleted: {file_path}")
                except Exception as e:
                    logger.warning(f"Error deleting {file_path}: {e}")
    

    def prepare_dataset_dir(self, root_dir : str, repeat_num : int, lora_name : str ) -> str:
        
        # Define the pattern to match old training directories
        pattern = re.compile(rf"^{repeat_num}_.+$")

        # Iterate through subdirectories
        for subdir in os.listdir(root_dir):
            subdir_path = os.path.join(root_dir, subdir)
            if os.path.isdir(subdir_path) and pattern.match(subdir):
                # Remove old training directory
                shutil.rmtree(subdir_path)
                logger.info(f"Removed old training directory: {subdir_path}")

        # Create new subdirectory
        new_subdir_name = f"{repeat_num}_{lora_name}"
        new_subdir_path = os.path.join(root_dir, new_subdir_name)
        os.makedirs(new_subdir_path, exist_ok=True)
        logger.info(f"Created new training directory: {new_subdir_path}")

        # Copy image files from root directory to new subdirectory
        for file_name in os.listdir(root_dir):
            file_path = os.path.join(root_dir, file_name)
            if os.path.isfile(file_path) and file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                shutil.copy(file_path, new_subdir_path)
                logger.info(f"Copied {file_name} to {new_subdir_path}")

        return new_subdir_path
            
    @task_decorator 
    def run_train(self,
              config_file: str,
              script: str = "",
              training_paramters: TrainingParameter = None,
              gpu_ids: Optional[list] = None,
              cpu_threads: Optional[int] = 2):

        args = [
            sys.executable, "-m", "accelerate.commands.launch",
            "--num_cpu_threads_per_process", str(cpu_threads),
            "--quiet",
            script,
            "--config_file", config_file,
        ]

        customize_env = os.environ.copy()
        customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        customize_env["PYTHONUNBUFFERED"] = "1"
        customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"
        #customize_env["CUDA_VISIBLE_DEVICES"] = "0"
        customize_env["NCCL_P2P_DISABLE"]="1"
        customize_env["NCCL_IB_DISABLE"]="1"
        proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=customize_env)
        return Task.wrap_training(proc, training_paramters)

    def get_gpu_info(self):
        try:
            # 调用 nvidia-smi 获取 GPU 信息
            result = subprocess.run(
                ["nvidia-smi", "--query-gpu=index,name,power.draw,memory.total,memory.used", "--format=csv,noheader,nounits"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if result.returncode != 0:
                raise RuntimeError(f"nvidia-smi error: {result.stderr.strip()}")

            gpu_info_list = []

            # 分组处理每个 GPU 数据
            for line in result.stdout.strip().split("\n"):
                gpu_index, gpu_name, power_draw, memory_total, memory_used = line.split(", ")
                gpu_index = int(gpu_index)
                power_draw = float(power_draw)
                memory_total = float(memory_total)
                memory_used = float(memory_used)

                gpu_info_list.append({
                    "gpu_index": gpu_index,
                    "gpu_name": gpu_name,
                    "power_draw_watts": power_draw,
                    "memory_total_mb": memory_total,
                    "memory_used_mb": memory_used,
                    "memory_free_mb": memory_total - memory_used
                })

            return gpu_info_list

        except FileNotFoundError:
            return {"error": "nvidia-smi not found"}
        except Exception as e:
            return {"error": str(e)}