import os
import yaml
from slugify import slugify
import gradio as gr
from typing import Optional
import sys
import toml
from gradio_logsview import LogsView, LogsViewRunner
from ..api.model.training_paramter import TrainingParameter
from ..api.common.utils import config2args, validate_parameter,config2args2, dataset2toml, config2toml
from utils.util import getprojectpath
MAX_IMAGES = 150

with open('models.yaml', 'r') as file:
    models = yaml.safe_load(file)

class TrainingService:

    def training(self,parameters :TrainingParameter):
        dataset_path = dataset2toml(parameters.dataset) 

        config_path = config2args(parameters.config, dataset_path)
        print(f"file {config_path}, {dataset_path}")

        # TODO: generate shell scripts and run
        command = self.run_train(config_path, script=f"{getprojectpath()}/sd-scripts/flux_train_network.py")

        # subprocess.Popen(self.command, env=self.environ)
        # sh = self.gen_sh(parameters)

    def resolve_path(self, p):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        norm_path = os.path.normpath(os.path.join(current_dir, p))
        return f"\"{norm_path}\""
    def resolve_path_without_quotes(self, p):
        # 获取当前脚本所在的目录
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 规范化路径
        norm_path = os.path.normpath(os.path.join(current_dir, p))

        # 获取目录路径
        dir_path = os.path.dirname(norm_path)

        # 如果目录不存在，创建目录
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)

        # 如果文件不存在，创建文件（写入空内容）
        if not os.path.exists(norm_path):
            with open(norm_path, 'w') as f:
                f.write("")  # 可以根据需要写入初始内容

        return norm_path

    def gen_sh(
        self,
        parameters: TrainingParameter
    ):
        
        validated, reason = validate_parameter(parameters)
        if not validated:
            raise Exception(f"parameter validate faild {reason}")
        
        arguments = config2args2(parameters.config)
        command = "accelerate launch "
        args_parts = "\\\n".join(arguments)
        sh = command + "\\\n" + args_parts
        print(f"sh ------------- {sh}")
        return sh
    
    def run_train(toml_path: str,
              script: str = "",
              gpu_ids: Optional[list] = None,
              cpu_threads: Optional[int] = 2):
        args = [
            sys.executable, "-m", "accelerate.commands.launch",
            "--num_cpu_threads_per_process", str(cpu_threads),
            "--quiet",
            script,
            "--config_file", toml_path,
        ]
        print(f"args ------------------- {args}")

        subprocess.Popen(self.command, env=self.environ)


        # customize_env = os.environ.copy()
        # customize_env["ACCELERATE_DISABLE_RICH"] = "1"
        # customize_env["PYTHONUNBUFFERED"] = "1"
        # customize_env["PYTHONWARNINGS"] = "ignore::FutureWarning,ignore::UserWarning"

        # if gpu_ids:
        #     customize_env["CUDA_VISIBLE_DEVICES"] = ",".join(gpu_ids)
        #     print(f"使用 GPU: {gpu_ids}")

        #     if len(gpu_ids) > 1:
        #         args[3:3] = ["--multi_gpu", "--num_processes", str(len(gpu_ids))]
        #         if sys.platform == "win32":
        #             customize_env["USE_LIBUV"] = "0"
        #             args[3:3] = ["--rdzv_backend", "c10d"]

        # if not (task := tm.create_task(args, customize_env)):
        #     return APIResponse(status="error", message="Failed to create task / 无法创建训练任务")

        # def _run():
        #     try:
        #         task.execute()
        #         result = task.communicate()
        #         if result.returncode != 0:
        #             log.error(f"Training failed / 训练失败")
        #         else:
        #             log.info(f"Training finished / 训练完成")
        #     except Exception as e:
        #         log.error(f"An error occurred when training / 训练出现致命错误: {e}")

        # coro = asyncio.to_thread(_run)
        # asyncio.create_task(coro)

        # return APIResponse(status="success", message=f"Training started / 训练开始 ID: {task.task_id}")