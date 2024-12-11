from dataclasses import dataclass
from dataclasses import dataclass, field
from typing import List
from .base_model import Model

@dataclass
class TrainingParameter(Model):
    output_name: str = ""
    class_tokens: str = ""
    pretrained_model_name_or_path: str = ""
    ae: str = ""
    clip_l: str = ""
    t5xxl: str = ""
    resume: str = ""
    output_dir: str = ""
    save_model_as: str = ""
    save_precision: str = ""
    save_state: bool = False
    train_data_dir: str = ""
    num_repeats: int = 10
    max_train_epochs: int = 10
    train_batch_size: int = 1
    resolution_width: int = 768
    resolution_height: int = 768
    enable_bucket: bool = True
    min_bucket_reso: int = 256
    max_bucket_reso: int = 2048
    bucket_reso_steps: int = 32
    bucket_no_upscale: bool = True
    seed: int = 1337
    max_data_loader_n_workers: int = 2
    learning_rate: str = "1e-4"
    save_every_n_epochs: int = 2
    guidance_scale: int = 1
    timestep_sampling: str = "sigmoid"
    network_dim: int = 2
    sigmoid_scale: int = 1
    model_prediction_type: str = "raw"
    discrete_flow_shift: int = 3
    loss_type: str = "l2"
    gradient_checkpointing: bool = True
    gradient_accumulation_steps: int = 1
    network_train_unet_only: bool = True
    network_train_text_encoder_only: bool = False
    unet_lr: str = "5e-4"
    text_encoder_lr: str = "1e-5"
    lr_scheduler: str = "cosine_with_restarts"
    lr_warmup_steps: int = 1
    lr_scheduler_num_cycles: int = 1
    optimizer_type: str = "PagedAdamW8bit"
    optimizer_args_custom: List = field(default_factory=list)
    network_module: str = "networks.lora_flux"
    network_weights: str = ""
    network_alpha: int = 16
    network_dropout: int = 0
    network_args_custom: List = field(default_factory=list)
    enable_base_weight: bool = False
    base_weights: List = field(default_factory=list)
    base_weights_multiplier: str = ""
    enable_preview: bool = False
    log_with: str = "tensorboard"
    log_prefix: str = ""
    log_tracker_name: str = ""
    logging_dir: str = "./logs"
    caption_extension: str = ".txt"
    shuffle_caption: bool = False
    weighted_captions: bool = False
    keep_tokens: int = 0
    keep_tokens_separator: str = ""
    color_aug: bool = False
    flip_aug: bool = False
    random_crop: bool = False
    clip_skip: int = 2
    ui_custom_params: str = ""
    mixed_precision: str = "bf16"
    full_fp16: bool = False
    full_bf16: bool = False
    fp8_base: bool = True
    fp8_base_unet: bool = False
    no_half_vae: bool = False
    sdpa: bool = True
    lowram: bool = False
    cache_latents: bool = True
    cache_latents_to_disk: bool = True
    cache_text_encoder_outputs: bool = True
    cache_text_encoder_outputs_to_disk: bool = True
    persistent_data_loader_workers: bool = True
    ddp_gradient_as_bucket_view: bool = False


    @classmethod
    def from_dict(cls, dikt) -> 'TrainingParameter':
        parameter =  TrainingParameter()
        parameter._from_dict(dikt)
        return parameter