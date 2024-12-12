from dataclasses import dataclass, asdict
import toml
import tempfile
from typing import List, Optional
from .base_model import Model
import dacite

@dataclass
class Subset:
    class_tokens: str
    image_dir: str
    num_repeats: int

    @classmethod
    def from_dict(cls, dikt) -> 'Subset':
        return dacite.from_dict(data_class=Subset, data=dikt)

@dataclass
class Dataset:
    batch_size: int
    keep_tokens: int
    resolution: int
    subsets: Optional[List[Subset]] 

    @classmethod
    def from_dict(cls, dikt) -> 'Dataset':
        return dacite.from_dict(data_class=Dataset, data=dikt)
@dataclass
class General:
    caption_extension: str
    keep_tokens: int
    shuffle_caption: bool

    @classmethod
    def from_dict(cls, dikt) -> 'General':
        return dacite.from_dict(data_class=General, data=dikt)

@dataclass
class TrainingDataset:
    """
    {
    "datasets": [{
        "batch_size": 1,
        "keep_tokens": 1,
        "resolution": 512,
        "subsets": [{
        "class_tokens": "aaa",
        "image_dir": "/spirit/fluxgym/datasets/aaa",
        "num_repeats": 10
        }]
    }],
    "general": {
        "caption_extension": ".txt",
        "keep_tokens": 1,
        "shuffle_caption": false
    }
    }
    """
    datasets: Optional[List[Dataset]] 
    general: General = None

    @classmethod
    def from_dict(cls, dikt) -> 'TrainingDataset':
        return dacite.from_dict(data_class=TrainingDataset, data=dikt)

 
    def to_file(self) -> str:
        # accroding to the value of feild to generate a toml format file 
        # in the temporary directory and return the path
        # Convert the TrainingDataset instance to a dictionary
        data = asdict(self)

        # Create a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".toml")
        temp_file_path = temp_file.name

        # Write the dictionary to the temporary file in TOML format
        with open(temp_file_path, 'w+', encoding='utf-8') as f:
            f.truncate(0)
            toml.dump(data, f)
        return temp_file_path


@dataclass
class TrainingConfig:
    adaptive_noise_scale: float = None
    ae: str  = None
    alpha_mask: int = False
    apply_t5_attn_mask: int = False
    async_upload: int = False
    base_weights: str  = None
    base_weights_multiplier: float = None
    bucket_no_upscale: int = False
    bucket_reso_steps: int = 64
    cache_info: int = False
    cache_latents: int = False
    cache_latents_to_disk: int = False
    caption_dropout_every_n_epochs: int = 0
    caption_dropout_rate: float = 0.0
    caption_extension: str  = ".caption"
    caption_extention: str  = None
    caption_prefix: str  = None
    caption_separator: str  = ","
    caption_suffix: str  = None
    caption_tag_dropout_rate: float = 0.0
    clip_l: str  = None
    clip_skip: int = None
    color_aug: int = False
    conditioning_data_dir: str  = None
    config_file: str  = None
    console_log_file: str  = None
    console_log_level: str  = None
    console_log_simple: int = False
    controlnet_model_name_or_path: str  = None
    cpu_offload_checkpointing: int = False
    dataset_class: str  = None
    dataset_config = None
    dataset_repeats: int = 1
    ddp_gradient_as_bucket_view: int = False
    ddp_static_graph: int = False
    ddp_timeout: int = None
    debiased_estimation_loss: int = False
    debug_dataset: int = False
    deepspeed: int = False
    dim_from_weights: int = False
    discrete_flow_shift: float = 3.0
    dynamo_backend: str  = "inductor"
    enable_bucket: int = False
    enable_wildcard: int = False
    face_crop_aug_range: str  = None
    flip_aug: int = False
    fp16_master_weights_and_gradients: int = False
    fp8_base: int = False
    fp8_base_unet: int = False
    full_bf16: int = False
    full_fp16: int = False
    fused_backward_pass: int = False
    gradient_accumulation_steps: int = 1
    gradient_checkpointing: int = False
    guidance_scale: float = 3.5
    highvram: int = False
    huber_c: float = 0.1
    huber_scale: float = 1.0
    huber_schedule: str  = "snr"
    huggingface_path_in_repo: str  = None
    huggingface_repo_id: str  = None
    huggingface_repo_type: str  = None
    huggingface_repo_visibility: str  = None
    huggingface_token: str  = None
    in_json: str  = None
    initial_epoch: int = None
    initial_step: int = None
    ip_noise_gamma: float = None
    ip_noise_gamma_random_strength: int = False
    keep_tokens: int = 0
    keep_tokens_separator: str  = ""
    learning_rate: float = 2e-06
    log_config: int = False
    log_prefix: str  = None
    log_tracker_config: str  = None
    log_tracker_name: str  = None
    log_with: str  = None
    logging_dir: str  = None
    loss_type: str  = "l2"
    lowram: int = False
    lr_decay_steps: int = 0
    lr_scheduler: str  = "constant"
    lr_scheduler_args: str  = None
    lr_scheduler_min_lr_ratio: float = None
    lr_scheduler_num_cycles: int = 1
    lr_scheduler_power: float = 1
    lr_scheduler_timescale: int = None
    lr_scheduler_type: str  = ""
    lr_warmup_steps: int = 0
    masked_loss: int = False
    max_bucket_reso: int = 1024
    max_data_loader_n_workers: int = 8
    max_grad_norm: float = 1.0
    max_timestep: int = None
    max_token_length: int = None
    max_train_epochs: int = None
    max_train_steps: int = 1600
    mem_eff_attn: int = False
    metadata_author: str  = None
    metadata_description: str  = None
    metadata_license: str  = None
    metadata_tags: str  = None
    metadata_title: str  = None
    min_bucket_reso: int = 256
    min_snr_gamma: float = None
    min_timestep: int = None
    mixed_precision: str  = "no"
    model_prediction_type: str = "sigma_scaled"
    multires_noise_discount: float = 0.3
    multires_noise_iterations: int = None
    network_alpha: float = 1
    network_args: str  = None
    network_dim: int = None
    network_dropout: float = None
    network_module: str  = None
    network_train_text_encoder_only: int = False
    network_train_unet_only: int = False
    network_weights: str  = None
    no_half_vae: int = False
    no_metadata: int = False
    noise_offset: float = None
    noise_offset_random_strength: int = False
    offload_optimizer_device: str  = None
    offload_optimizer_nvme_path: str  = None
    offload_param_device: str  = None
    offload_param_nvme_path: str  = None
    optimizer_args: str  = None
    optimizer_type: str  = ""
    output_config: int = False
    output_dir: str  = None
    output_name: str  = None
    persistent_data_loader_workers: int = False
    pretrained_model_name_or_path: str  = None
    prior_loss_weight: float = 1.0
    random_crop: int = False
    reg_data_dir: str  = None
    resolution: str  = None
    resume: str  = None
    resume_from_huggingface: int = False
    sample_at_first: int = False
    sample_every_n_epochs: int = None
    sample_every_n_steps: int = None
    sample_prompts: str  = None
    sample_sampler: str  = "ddim"
    save_every_n_epochs: int = None
    save_every_n_steps: int = None
    save_last_n_epochs: int = None
    save_last_n_epochs_state: int = None
    save_last_n_steps: int = None
    save_last_n_steps_state: int = None
    save_model_as: str  = "safetensors"
    save_n_epoch_ratio: int = None
    save_precision: str  = None
    save_state: int = False
    save_state_on_train_end: int = False
    save_state_to_huggingface: int = False
    scale_v_pred_loss_like_noise_pred: int = False
    scale_weight_norms: float = None
    sdpa: int = False
    secondary_separator: str  = None
    seed: int = None
    shuffle_caption: int = False
    sigmoid_scale: float = 1.0
    skip_cache_check: int = False
    skip_until_initial_step: int = False
    t5xxl: str  = None
    t5xxl_max_token_length: int = None
    text_encoder_lr: float = None
    timestep_sampling: str = "sigma"
    token_warmup_min: int = 1
    token_warmup_step: float = 0
    tokenizer_cache_dir: str  = None
    torch_compile: int = False
    train_batch_size: int = 1
    train_data_dir: str  = None
    training_comment: str  = None
    unet_lr: float = None
    use_8bit_adam: int = False
    use_lion_optimizer: int = False
    v2: int = False
    v_parameterization: int = False
    v_pred_like_loss: float = None
    vae: str  = None
    vae_batch_size: int = 1
    wandb_api_key: str  = None
    wandb_run_name: str  = None
    weighted_captions: int = False
    xformers: int = False
    zero3_init_flag: int = False
    zero3_save_16bit_model: int = False
    zero_stage: int = 2
    zero_terminal_snr: int = False

    @classmethod
    def from_dict(cls, dikt) -> 'TrainingConfig':
       return dacite.from_dict(data_class=TrainingConfig, data=dikt) 
    
@dataclass
class TrainingParameter:
    config: Optional[TrainingConfig]  
    dataset: Optional[TrainingDataset]

    @classmethod
    def from_dict(cls, dikt) -> 'TrainingParameter':
       return dacite.from_dict(data_class=TrainingParameter, data=dikt) 
