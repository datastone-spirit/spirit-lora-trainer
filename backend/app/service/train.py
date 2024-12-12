import os
import yaml
from slugify import slugify
import gradio as gr
import toml
from gradio_logsview import LogsView, LogsViewRunner
from ..api.model.training_paramter import TrainingParameter

MAX_IMAGES = 150
training_parameters: TrainingParameter
with open('models.yaml', 'r') as file:
    models = yaml.safe_load(file)

class TrainingService:

    def training(self,parameters :TrainingParameter):
        global training_parameters
        training_parameters = parameters
        # ------------
        dataset_path = self.resolve_path_without_quotes(f"/outputs/bbbbb/dataset.toml")
        # with open(dataset_path, 'w', encoding="utf-8") as file:
        #     file.write(train_config)
        train_config = {
            "datasets": {
                "batch_size": 1,
                "keep_tokens": 1,
                "resolution": 512,
                "subsets": {
                    "class_tokens": "aaa",
                    "image_dir": "/spirit/fluxgym/datasets/aaa",
                    "num_repeats": 10
                }
            },
            "general": {
                "caption_extension": ".txt",
                "keep_tokens": 1,
                "shuffle_caption": True
            }
        }
        with open(dataset_path, "w", encoding="utf-8") as f:
            toml.dump(train_config, f)
        gr.Info(f"Generated dataset.toml")


        # ---------------------
        print(f'trainingparameters is {parameters.output_name} {parameters.class_tokens}')
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

        output_dir = self.resolve_path(f"outputs/{parameters.output_name}")
        sample_prompts_path = self.resolve_path(f"outputs/{parameters.output_name}/sample_prompts.txt")

        line_break = "\\"

        ############# Sample args ########################
        sample = ""
        if len(parameters.sample_prompts) > 0 and parameters.sample_every_n_steps > 0:
            sample = f"""--sample_prompts={sample_prompts_path} --sample_every_n_steps="{parameters.sample_every_n_steps}" {line_break}"""

        if parameters.vram == "16G":
            # 16G VRAM
            optimizer = f"""--optimizer_type adafactor {line_break}
            --optimizer_args "relative_step=False" "scale_parameter=False" "warmup_init=False" {line_break}
            --lr_scheduler constant_with_warmup {line_break}
            --max_grad_norm 0.0 {line_break}"""
        elif parameters.vram == "12G":
        # 12G VRAM
            optimizer = f"""--optimizer_type adafactor {line_break}
            --optimizer_args "relative_step=False" "scale_parameter=False" "warmup_init=False" {line_break}
            --split_mode {line_break}
            --network_args "train_blocks=single" {line_break}
            --lr_scheduler constant_with_warmup {line_break}
            --max_grad_norm 0.0 {line_break}"""
        else:
            # 20G+ VRAM
            optimizer = f"--optimizer_type adamw8bit {line_break}"


        #######################################################
        model_config = models[parameters.base_model]
        model_file = model_config["file"]
        repo = model_config["repo"]
        if parameters.base_model == "flux-dev" or parameters.base_model == "flux-schnell":
            model_folder = "models/unet"
        else:
            model_folder = f"models/unet/{repo}"
        model_path = os.path.join(model_folder, model_file)
        pretrained_model_path = self.resolve_path(model_path)

        clip_path = self.resolve_path("models/clip/clip_l.safetensors")
        t5_path = self.resolve_path("models/clip/t5xxl_fp16.safetensors")
        ae_path = self.resolve_path("models/vae/ae.sft")
        sh = f"""accelerate launch {line_break}
        --mixed_precision bf16 {line_break}
        --num_cpu_threads_per_process 1 {line_break}
        sd-scripts/flux_train_network.py {line_break}
        --pretrained_model_name_or_path {pretrained_model_path} {line_break}
        --clip_l {clip_path} {line_break}
        --t5xxl {t5_path} {line_break}
        --ae {ae_path} {line_break}
        --cache_latents_to_disk {line_break}
        --save_model_as safetensors {line_break}
        --sdpa --persistent_data_loader_workers {line_break}
        --max_data_loader_n_workers {parameters.workers} {line_break}
        --seed {parameters.seed} {line_break}
        --gradient_checkpointing {line_break}
        --mixed_precision bf16 {line_break}
        --save_precision bf16 {line_break}
        --network_module networks.lora_flux {line_break}
        --network_dim {parameters.network_dim} {line_break}
        {optimizer}{sample}
        --learning_rate {parameters.learning_rate} {line_break}
        --cache_text_encoder_outputs {line_break}
        --cache_text_encoder_outputs_to_disk {line_break}
        --fp8_base {line_break}
        --highvram {line_break}
        --max_train_epochs {parameters.max_train_epochs} {line_break}
        --save_every_n_epochs {parameters.save_every_n_epochs} {line_break}
        --dataset_config {self.resolve_path(f"outputs/{parameters.output_name}/dataset.toml")} {line_break}
        --output_dir {output_dir} {line_break}
        --output_name {parameters.output_name} {line_break}
        --timestep_sampling {parameters.timestep_sampling} {line_break}
        --discrete_flow_shift 3.1582 {line_break}
        --model_prediction_type raw {line_break}
        --guidance_scale {parameters.guidance_scale} {line_break}
        --loss_type l2 {line_break}"""

        return sh
    
    def gen_toml(
        self,
        dataset_folder,
        resolution,
        class_tokens,
        num_repeats
    ):
        toml = f"""[general]
        shuffle_caption = false
        caption_extension = '.txt'
        keep_tokens = 1

        [[datasets]]
        resolution = {resolution}
        batch_size = 1
        keep_tokens = 1

        [[datasets.subsets]]
        image_dir = '{self.resolve_path_without_quotes(dataset_folder)}'
        class_tokens = '{class_tokens}'
        num_repeats = {num_repeats}"""
        return toml
    
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