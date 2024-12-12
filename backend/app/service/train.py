import os
import yaml
from slugify import slugify
import gradio as gr
import toml
from gradio_logsview import LogsView, LogsViewRunner
from ..api.model.training_paramter import TrainingParameter
from ..api.common.utils import config2args
MAX_IMAGES = 150
training_parameters: TrainingParameter
with open('models.yaml', 'r') as file:
    models = yaml.safe_load(file)

class TrainingService:

    def training(self,parameters :TrainingParameter):
        global training_parameters
        temp_file_path = parameters.dataset.to_file()
        print(f"file {temp_file_path}")

        # TODO: generate shell scripts and run
        sh = self.gen_sh(parameters)

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
        
        parameters.validate()
        arguments = config2args(parameters.config)
        line_break = "\\"
        command = "accelerate launch"
        args_parts = "\\\n".join(arguments)
        sh = command + "\\\n" + args_parts
        return sh
    
    def start_training(
        self,
        lora_name,
        train_script,
        train_config,
        sample_prompts,
    ):
        # write custom script and toml
        if not os.path.exists("outputs"):
            os.makedirs("outputs", exist_ok=True)
        output_name = slugify(lora_name)
        output_dir = self.resolve_path_without_quotes(f"outputs/{output_name}")
        if not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)


        file_type = "sh"

        sh_filename = f"train.{file_type}"
        sh_filepath = self.resolve_path_without_quotes(f"outputs/{output_name}/{sh_filename}")
        with open(sh_filepath, 'w', encoding="utf-8") as file:
            file.write(train_script)
        gr.Info(f"Generated train script at {sh_filename}")


        dataset_path = self.resolve_path_without_quotes(f"outputs/{output_name}/dataset.toml")
        # with open(dataset_path, 'w', encoding="utf-8") as file:
        #     file.write(train_config)
        with open(dataset_path, "w", encoding="utf-8") as f:
            toml.dump(train_config, f)
        gr.Info(f"Generated dataset.toml")

        sample_prompts_path = self.resolve_path_without_quotes(f"outputs/{output_name}/sample_prompts.txt")
        with open(sample_prompts_path, 'w', encoding='utf-8') as file:
            file.write(sample_prompts)
        gr.Info(f"Generated sample_prompts.txt")

        # Train
        
        command = f"bash \"{sh_filepath}\""

        # Use Popen to run the command and capture output in real-time
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'
        env['LOG_LEVEL'] = 'DEBUG'
        runner = LogsViewRunner()
        cwd = os.path.dirname(os.path.abspath(__file__))
        gr.Info(f"Started training")
        yield from runner.run_command([command], cwd=cwd)
        yield runner.log(f"Runner: {runner}")

        gr.Info(f"Training Complete. Check the outputs folder for the LoRA files.", duration=None)