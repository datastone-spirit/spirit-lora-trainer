import os
from typing import Optional, List
import sys
from ..api.model.training_paramter import TrainingParameter
from ..api.common.utils import validate_parameter, dataset2toml, config2toml, is_flux_sampling, StateError
from utils.util import getprojectpath 
from utils.accelerate_config import accelerate_manager, AccelerateConfig
from utils.gpu_utils import gpu_manager
import uuid
import logging
import subprocess
from task.manager import task_decorator
from task.task import Task
from task.manager import tm
from utils.util import pathFormat

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)


class TrainingService:

    def __init__(self) -> 'TrainingService':
        self.script = f"{getprojectpath()}/sd-scripts/flux_train_network.py"


    def training(self, parameters :TrainingParameter):

        if tm.current_task is not None:
            logger.warning("current task is not none, don't commit task at same time")
            raise StateError("There is already a task running, please wait for it to finish")
        
        valid, reason = validate_parameter(parameters)
        if not valid:
            logger.warning(f"valid parameters error: {parameters}")
            raise ValueError(f"valid reqest failed, reason: {reason}")

        # Validate multi-GPU configuration if enabled
        if parameters.config.multi_gpu_enabled:
            is_valid, gpu_error, validation_details = self._validate_multi_gpu_config(parameters.config)
            if not is_valid:
                logger.error(f"Multi-GPU validation failed: {gpu_error}")
                raise ValueError(f"Multi-GPU configuration invalid: {gpu_error}")
            logger.info(f"Multi-GPU validation passed: {validation_details}")

        if is_flux_sampling(parameters.config):
            os.makedirs(f"{parameters.config.output_dir}/sample", exist_ok=True)
        elif parameters.config.sample_prompts is not None and not os.path.exists(parameters.config.sample_prompts):
            # if sample_prompts is not none , must be a valid path
            logger.info(f"sample_prompts is not none, but not a valid path: {parameters.config.sample_prompts}, set it to None")
            parameters.config.sample_prompts = None
        #
        # FIXME: we pre-create the taskid here, and set it to the log_prefix
        # for tensorborad log parsing, so the user log_preifix configuration will
        # be overwrited by this taskid value
        #
        taskid = uuid.uuid4().hex
        parameters.config.log_prefix = f"{taskid}-"

        dataset_path = dataset2toml(parameters.dataset)
        config_file = config2toml(parameters.config, dataset_path)

        try:
            self.clear_npz_files(parameters.dataset.datasets[0].subsets[0].image_dir)
        except Exception as e:
            logger.warning(f"clear npz files failed, ignored, error:", exc_info=e)

        return self.run_train(config_file, script=self.script, training_paramters=parameters, task_id=taskid)
    
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
            
    @task_decorator 
    def run_train(self,
              config_file: str,
              script: str = "",
              training_paramters: TrainingParameter = None,
              cpu_threads: Optional[int] = 2,
              task_id: str=None):

        # Generate accelerate launch arguments based on configuration
        if training_paramters.config.multi_gpu_enabled:
            logger.info("Using multi-GPU training configuration")
            args = self._generate_multi_gpu_args(training_paramters.config, script, config_file)
        else:
            logger.info("Using single GPU training configuration")
            # Single GPU training (original behavior)
            args = [
                sys.executable, "-m", "accelerate.commands.launch",
                "--num_processes", "1",  # Explicitly force single process to prevent auto multi-GPU detection
                "--num_cpu_threads_per_process", str(cpu_threads),
                "--quiet",
                script,
                "--config_file", config_file,
            ]
            logger.info(f"Single GPU launch command: {' '.join(args)}")

        customize_env = self._prepare_training_environment(training_paramters.config)
        proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=customize_env)
        return Task.wrap_training(proc, training_paramters, task_id)

    def _validate_multi_gpu_config(self, config) -> tuple[bool, str, dict]:
        """Validate multi-GPU configuration"""
        try:
            # Determine GPU IDs to use
            gpu_ids = config.gpu_ids
            if config.auto_gpu_selection or not gpu_ids:
                gpu_ids = gpu_manager.get_optimal_gpu_selection(
                    num_gpus=config.num_gpus,
                    memory_requirement_mb=config.memory_requirement_mb
                )
                # Update config with selected GPUs
                config.gpu_ids = gpu_ids
                logger.info(f"Auto-selected GPUs: {gpu_ids}")
            
            # Validate GPU configuration
            batch_size_per_gpu = getattr(config, 'train_batch_size', 1)
            is_valid, error_msg, validation_details = gpu_manager.validate_gpu_configuration(
                gpu_ids=gpu_ids,
                batch_size_per_gpu=batch_size_per_gpu,
                memory_requirement_mb=config.memory_requirement_mb
            )
            
            return is_valid, error_msg, validation_details
            
        except Exception as e:
            logger.error(f"Multi-GPU validation error: {e}")
            return False, f"Validation error: {str(e)}", {}

    def _generate_multi_gpu_args(self, config, script: str, config_file: str) -> List[str]:
        """Generate accelerate launch arguments for multi-GPU training"""
        
        # Create accelerate configuration
        accelerate_config = accelerate_manager.create_config(
            num_gpus=config.num_gpus,
            gpu_ids=config.gpu_ids,
            mixed_precision=getattr(config, 'mixed_precision', 'bf16'),
            gradient_accumulation_steps=getattr(config, 'gradient_accumulation_steps', 1),
            memory_requirement_mb=config.memory_requirement_mb
        )
        
        # Generate launch arguments
        script_args = ["--config_file", config_file]
        args = accelerate_manager.generate_launch_args(accelerate_config, script, script_args)
        
        logger.info(f"Generated multi-GPU launch command with {config.num_gpus} GPUs: {config.gpu_ids}")
        return args

    def _prepare_training_environment(self, config) -> dict:
        """Prepare environment variables for training"""
        customize_env = os.environ.copy()
        customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        customize_env["PYTHONUNBUFFERED"] = "1"
        customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"
        
        # Multi-GPU specific environment settings
        if config.multi_gpu_enabled:
            # Use configured backend, fallback to nccl for multi-GPU
            backend = getattr(config, 'distributed_backend', 'nccl')
            if backend == 'nccl':
                # NCCL optimizations for multi-GPU training
                customize_env["NCCL_TIMEOUT"] = "1800"  # 30 minutes timeout
                customize_env["NCCL_DEBUG"] = "WARN"    # Reduce NCCL verbosity
                
                # Only disable P2P/IB if explicitly configured or for stability
                if getattr(config, 'disable_nccl_p2p', False):
                    customize_env["NCCL_P2P_DISABLE"] = "1"
                if getattr(config, 'disable_nccl_ib', False):
                    customize_env["NCCL_IB_DISABLE"] = "1"
            
            # Set GPU visibility
            if config.gpu_ids:
                customize_env["CUDA_VISIBLE_DEVICES"] = ",".join(map(str, config.gpu_ids))
                logger.info(f"Set CUDA_VISIBLE_DEVICES={customize_env['CUDA_VISIBLE_DEVICES']}")
        else:
            # Single GPU training - keep original settings for compatibility
            customize_env["NCCL_P2P_DISABLE"] = "1"
            customize_env["NCCL_IB_DISABLE"] = "1"
            
            # For single GPU training, explicitly limit to GPU 0 to prevent accidental multi-GPU usage
            # unless a specific GPU is configured
            if not customize_env.get("CUDA_VISIBLE_DEVICES"):
                customize_env["CUDA_VISIBLE_DEVICES"] = "0"
                logger.info("Single GPU training: Set CUDA_VISIBLE_DEVICES=0")
        
        return customize_env

    def get_all_gpus(self):
        """Get all GPUs without filtering - returns complete GPU information"""
        return [gpu.to_dict() for gpu in gpu_manager.get_gpu_info()]
    
    def validate_gpu_selection(self, gpu_ids: List[int], memory_requirement_mb: int = 8000):
        """Validate specific GPU selection"""
        is_valid, error_msg, details = gpu_manager.validate_gpu_configuration(
            gpu_ids=gpu_ids,
            memory_requirement_mb=memory_requirement_mb
        )
        return {
            "is_valid": is_valid,
            "error_message": error_msg,
            "validation_details": details
        }
    
    def estimate_training_memory(self, batch_size: int, num_gpus: int = 1):
        """Estimate memory requirements for training configuration"""
        memory_per_gpu = accelerate_manager.estimate_memory_usage(
            batch_size=batch_size,
            model_size="flux-dev"
        )
        
        return {
            "per_gpu_memory_mb": memory_per_gpu,
            "total_memory_mb": memory_per_gpu["total_memory_mb"] * num_gpus,
            "recommended_memory_mb": memory_per_gpu["recommended_memory_mb"] * num_gpus
        }

    def get_gpu_info(self):
        try:
            # 调用 nvidia-smi 获取 GPU 信息
            result = subprocess.run(
                ["nvidia-smi", "--query-gpu=index,name,power.draw,power.limit,memory.total,memory.used", "--format=csv,noheader,nounits"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if result.returncode != 0:
                raise RuntimeError(f"nvidia-smi error: {result}")

            gpu_info_list = []

            # 分组处理每个 GPU 数据
            for line in result.stdout.strip().split("\n"):
                gpu_index, gpu_name, power_draw, limit, memory_total, memory_used = line.split(", ")
                gpu_index = int(gpu_index)
                power_draw = float(power_draw)
                power_total = float(limit)
                memory_total = float(memory_total)
                memory_used = float(memory_used)

                gpu_info_list.append({
                    "gpu_index": gpu_index,
                    "gpu_name": gpu_name,
                    "power_draw_watts": power_draw,
                    "power_total_watts": power_total,
                    "memory_total_mb": memory_total,
                    "memory_used_mb": memory_used,
                    "memory_free_mb": memory_total - memory_used
                })

            return gpu_info_list

        except FileNotFoundError:
            logger.warning("nvidia-smi not found")
            raise Exception("nvidia-smi not found")
        except Exception as e:
            logger.warning("get_gpu_info failed: ", exc_info=e)
            raise e