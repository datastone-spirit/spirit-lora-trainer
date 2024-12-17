import os
import shutil
import yaml
from typing import Optional
import sys
from ..api.model.training_paramter import TrainingParameter
from ..api.common.utils import validate_parameter, dataset2toml, config2toml
from utils.util import getprojectpath, resolveProjectPath
import logging
import subprocess
from task.manager import task_decorator
from task.task import Task

class TrainingService:

    def training(self,parameters :TrainingParameter):
        valid, reason = validate_parameter(parameters)
        if not valid:
            logging.warning(f"valid parameters error: {parameters}")
            raise ValueError(f"valid reqest failed, reason{reason}")
        
        dataset_path = dataset2toml(parameters.dataset)
        config_path = config2toml(parameters.config, dataset_path)
        #self.generate_dir(parameters)

        return self.run_train(config_path, script=f"{getprojectpath()}/sd-scripts/flux_train_network.py", training_paramters=parameters)
        
    # 生成训练目录
    def generate_dir(self, parameters: TrainingParameter):
        # 创建目标文件夹名
        train_dir = parameters.dataset.datasets[0].subsets[0].image_dir
        
        if not train_dir.startswith('/'):
           train_dir = f"{getprojectpath()}/{train_dir}/{parameters.config.dataset_repeats}_{parameters.config.output_name}" 
            
        folder_name = f"{resolveProjectPath(parameters.dataset.datasets[0].subsets[0].image_dir)}/{parameters.config.dataset_repeats}_{parameters.config.output_name}"
        folder_path = os.path.abspath(folder_name)
        # 删除当前目录中所有数字开头的文件夹
        current_dir = f"{resolveProjectPath(parameters.dataset.datasets[0].subsets[0].image_dir)}"
        for item in os.listdir(current_dir):
            item_path = os.path.join(current_dir, item)
            if os.path.isdir(item_path) and item[0].isdigit():
                shutil.rmtree(item_path)

        # 创建目标文件夹
        os.makedirs(folder_path, exist_ok=True)
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'}
        # 拷贝 captions_output 目录下的所有 .txt 文件
        captions_dir = f"{resolveProjectPath(parameters.dataset.datasets[0].subsets[0].image_dir)}"
        if os.path.exists(captions_dir) and os.path.isdir(captions_dir):
            for filename in os.listdir(captions_dir):
                if filename.endswith('.txt'):
                    src_path = os.path.join(captions_dir, filename)
                    shutil.copy(src_path, folder_path)
        # 拷贝当前目录下的所有图片文件
        for filename in os.listdir(current_dir):
            file_ext = os.path.splitext(filename)[1].lower()
            if file_ext in image_extensions:
                src_path = os.path.join(current_dir, filename)
                shutil.copy(src_path, folder_path)
    @task_decorator 
    def run_train(self,
              toml_path: str,
              script: str = "",
              training_paramters: TrainingParameter = None,
              gpu_ids: Optional[list] = None,
              cpu_threads: Optional[int] = 2):
        args = [
            sys.executable, "-m", "accelerate.commands.launch",
            "--num_cpu_threads_per_process", str(cpu_threads),
            "--quiet",
            script,
            "--config_file", toml_path,
        ]

        customize_env = os.environ.copy()
        customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        customize_env["PYTHONUNBUFFERED"] = "1"
        customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"
        #customize_env["CUDA_VISIBLE_DEVICES"] = "0"
        customize_env["NCCL_P2P_DISABLE"]="1"
        customize_env["NCCL_IB_DISABLE"]="1"

        return Task.wrap_training(subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=customize_env), training_paramters)

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

            gpu_info_dict = {}

            # 分组处理每个 GPU 数据
            for line in result.stdout.strip().split("\n"):
                gpu_index, gpu_name, power_draw, memory_total, memory_used = line.split(", ")
                gpu_index = int(gpu_index)
                power_draw = float(power_draw)
                memory_total = float(memory_total)
                memory_used = float(memory_used)

                # 将每个 GPU 的信息存储到字典
                gpu_info_dict[gpu_index] = {
                    "gpu_name": gpu_name,
                    "power_draw_watts": power_draw,
                    "memory_total_mb": memory_total,
                    "memory_used_mb": memory_used,
                    "memory_free_mb": memory_total - memory_used
                }

            return gpu_info_dict
        except FileNotFoundError:
            return {"error": "nvidia-smi not found"}
        except Exception as e:
            return {"error": str(e)}