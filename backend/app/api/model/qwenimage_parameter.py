import dacite
from app.api.model.base_model import MultiGPUConfig

from dataclasses import dataclass, field
from typing import Optional, Tuple, List
from os import path, makedirs

from utils.util import setup_logging, is_blank, getprojectpath
from app.api.common.utils import generate_sample_prompt_file
setup_logging()
import logging
logger = logging.getLogger(__name__)

@dataclass
class GeneralConfig:
    resolution: Tuple[int, int] = (960, 544)  # [W, H]
    caption_extension: Optional[str] = ".txt"
    batch_size: int = 1
    num_repeats: int = 1
    enable_bucket: bool = True  # default provided value (can be overridden)
    bucket_no_upscale: bool = False

    @staticmethod
    def validate(config: 'GeneralConfig') -> 'GeneralConfig':
        """
        Validate the GeneralConfig instance.
        """

        if config.resolution[0] <= 0 or config.resolution[1] <= 0:
            raise ValueError("Resolution must be positive integers.")
        
        if config.batch_size <= 0:
            raise ValueError("Batch size must be a positive integer.")
        
        if config.num_repeats <= 0:
            raise ValueError("Number of repeats must be a positive integer.")
        
        return config

@dataclass
class DatasetConfig:
    resolution: Optional[Tuple[int, int]] = None
    caption_extension: Optional[str] = None
    batch_size: Optional[int] = None
    num_repeats: Optional[int] = None
    enable_bucket: Optional[bool] = None
    bucket_no_upscale: Optional[bool] = None
    cache_directory: Optional[str] = None

    # Fields for image datasets
    image_directory: Optional[str] = None
    image_jsonl_file: Optional[str] = None

    @staticmethod
    def validate(config: 'DatasetConfig', strict_mod : bool = False) -> 'DatasetConfig':
        """
        Validate the DatasetConfig instance.
        """
        if not config.image_directory and not config.image_jsonl_file:
            raise ValueError("Either image_directory or image_jsonl_file must be provided.")
        
        if config.batch_size is not None and config.batch_size <= 0:
            raise ValueError("Batch size must be a positive integer.")
        
        if config.num_repeats is not None and config.num_repeats <= 0:
            raise ValueError("Number of repeats must be a positive integer.")
        
        return config



@dataclass
class QWenImageDataSetConfig:
    general: GeneralConfig = field(default_factory=GeneralConfig)
    datasets: List[DatasetConfig] = field(default_factory=list)

    @staticmethod
    def validate(config: 'QWenImageDataSetConfig', strict_mod: bool = False ) -> 'QWenImageDataSetConfig':
        """
        Validate the WanDataSetConfig instance.
        """

        if not config.general:
            logger.warning("General configuration is required.")
            raise ValueError("General configuration is required.")
        
        config.general = GeneralConfig.validate(config.general)
        
        if not config.datasets or len(config.datasets) == 0:
            logger.warning("At least one dataset configuration is required.")
            raise ValueError("At least one dataset configuration is required.")
        
        for i in range(len(config.datasets)):
            config.datasets[i] = DatasetConfig.validate(config.datasets[i], strict_mod = strict_mod)
        return config

@dataclass
class QWenImageTrainingConfig:
    async_upload: bool = False # upload to huggingface asynchronously
    base_weights: str  = None # network weights to merge into the model before training
    base_weights_multiplier: float = None # multiplier for network weights to merge into the model before training
    blocks_to_swap: int = None # number of blocks to swap in the model, max XXX
    config_file: str  = None # using .toml instead of args to pass hyperparameter
    dataset_config = None # config file for dataset
    ddp_gradient_as_bucket_view: bool = False # enable gradient_as_bucket_view for DDP
    ddp_static_graph: bool = False # enable static_graph for DDP
    ddp_timeout: int = None # DDP timeout (min, None for default of accelerate)
    dim_from_weights: bool = False # automatically determine dim (rank) from network_weights
    discrete_flow_shift: float = 1.0 # Discrete flow shift for the Euler Discrete Scheduler, default is 1.0.
    dit: str  = None # DiT checkpoint path
    dynamo_backend: str  = None # dynamo backend type (default is None)
    dynamo_dynamic: bool = False # use dynamic mode for dynamo
    dynamo_fullgraph: bool = False # use fullgraph mode for dynamo
    dynamo_mode: str  = None # dynamo mode (default is default)
    flash3: bool = False # use FlashAttention 3 for CrossAttention, requires FlashAttention 3, HunyuanVideo does not support this yet
    flash_attn: bool = False # use FlashAttention for CrossAttention, requires FlashAttention
    fp8_base: bool = False # use fp8 for base model
    fp8_scaled: bool = False # use scaled fp8 for DiT
    fp8_vl: bool = False # use fp8 for Text Encoder model
    gradient_accumulation_steps: int = 1 # Number of updates steps to accumulate before performing a backward
    gradient_checkpointing: bool = False # enable gradient checkpointing
    guidance_scale: float = 1.0 # Embeded classifier free guidance scale (HunyuanVideo only).
    huggingface_path_in_repo: str  = None # huggingface model path to upload files
    huggingface_repo_id: str  = None # huggingface repo name to upload
    huggingface_repo_type: str  = None # huggingface repo type to upload
    huggingface_repo_visibility: str  = None # huggingface repository visibility ('public' for public, 'private' or None for private)
    huggingface_token: str  = None # huggingface token
    img_in_txt_in_offloading: bool = False # offload img_in and txt_in to cpu
    learning_rate: float = 2e-06 # learning rate
    log_config: bool = False # log training configuration
    log_prefix: str  = None # add prefix for each log directory
    log_tracker_config: str  = None # path to tracker config file to use for logging
    log_tracker_name: str  = None # name of tracker to use for logging, default is script-specific default name
    log_with: str  = None # what logging tool(s) to use (if 'all', TensorBoard and WandB are both used)
    logging_dir: str  = None # enable logging and output TensorBoard log to this directory
    logit_mean: float = 0.0 # mean to use when using the `'logit_normal'` weighting scheme
    logit_std: float = 1.0 # std to use when using the `'logit_normal'` weighting scheme
    lr_decay_steps: int = 0 # Int number of steps for the decay in the lr scheduler (default is 0) or float (<1) with ratio of train steps
    lr_scheduler: str  = "constant" # scheduler to use for learning rate
    lr_scheduler_args: str  = None # additional arguments for scheduler (like "T_max=100")
    lr_scheduler_min_lr_ratio: float = None # The minimum learning rate as a ratio of the initial learning rate for cosine with min lr scheduler and warmup decay scheduler
    lr_scheduler_num_cycles: int = 1 # Number of restarts for cosine scheduler with restarts
    lr_scheduler_power: float = 1 # Polynomial power for polynomial scheduler
    lr_scheduler_timescale: int = None # Inverse sqrt timescale for inverse sqrt scheduler,defaults to `num_warmup_steps`
    lr_scheduler_type: str  = None # custom scheduler module
    lr_warmup_steps: int = 0 # Int number of steps for the warmup in the lr scheduler (default is 0) or float with ratio of train steps
    max_data_loader_n_workers: int = 8 # max num workers for DataLoader (lower is less main RAM usage, faster epoch start and slower data loading)
    max_grad_norm: float = 1.0 # Max gradient norm, 0 for no clipping
    max_timestep: int = None # set maximum time step for training (1~1000, default is 1000)
    max_train_epochs: int = None # training epochs (overrides max_train_steps)
    max_train_steps: int = 1600 # training steps
    metadata_author: str  = None # author name for model metadata
    metadata_description: str  = None # description for model metadata
    metadata_license: str  = None # license for model metadata
    metadata_tags: str  = None # tags for model metadata, separated by comma
    metadata_title: str  = None # title for model metadata (default is output_name)
    min_timestep: int = None # set minimum time step for training (0~999, default is 0)
    mixed_precision: str  = "no" # use mixed precision
    mode_scale: float = 1.29 # Scale of mode weighting scheme. Only effective when using the `'mode'` as the `weighting_scheme`
    network_alpha: float = 1 # alpha for LoRA weight scaling, default 1 (same as network_dim for same behavior as old version)
    network_args: str  = None # additional arguments for network (key=value)
    network_dim: int = None # network dimensions (depends on each network)
    network_dropout: float = None # Drops neurons out of training every step (0 or None is default behavior (no dropout), 1 would drop all neurons)
    network_module: str  = None # network module to train
    network_weights: str  = None # pretrained weights for network
    no_metadata: bool = False # do not save metadata in output model
    optimizer_args: str  = None # additional arguments for optimizer (like "weight_decay=0.01 betas=0.9,0.999 ...")
    optimizer_type: str  = "" # Optimizer to use
    output_dir: str  = None # directory to output trained model
    output_name: str  = None # base name of trained model file
    persistent_data_loader_workers: bool = False # persistent DataLoader workers (useful for reduce time gap between epoch, but may use more memory)
    preserve_distribution_shape: bool = False # If specified, constrains timestep sampling to [min_timestep, max_timestep] using rejection sampling, preserving the original distribution shape. By default, the [0, 1] range is scaled, which distorts the distribution. Only effective when `timestep_sampling` is not 'sigma'.
    resume: str  = None # saved state to resume training
    resume_from_huggingface: bool = False # resume from huggingface (ex: --resume {repo_id}
    sage_attn: bool = False # use SageAttention. requires SageAttention
    sample_at_first: bool = False # generate sample images before training
    sample_every_n_epochs: int = None # generate sample images every N epochs (overwrites n_steps)
    sample_every_n_steps: int = None # generate sample images every N steps
    sample_prompts: str  = None # file for prompts to generate sample images
    save_every_n_epochs: int = None # save checkpoint every N epochs
    save_every_n_steps: int = None # save checkpoint every N steps
    save_last_n_epochs: int = None # save last N checkpoints when saving every N epochs (remove older checkpoints)
    save_last_n_epochs_state: int = None # save last N checkpoints of state (overrides the value of --save_last_n_epochs)
    save_last_n_steps: int = None # save checkpoints until N steps elapsed (remove older checkpoints if N steps elapsed)
    save_last_n_steps_state: int = None # save states until N steps elapsed (remove older states if N steps elapsed, overrides --save_last_n_steps)
    save_state: bool = False # save training state additionally (including optimizer states etc.) when saving model
    save_state_on_train_end: bool = False # save training state (including optimizer states etc.) on train end even if --save_state is not specified
    save_state_to_huggingface: bool = False # save state to huggingface
    scale_weight_norms: float = None # Scale the weight of each key pair to help prevent overtraing via exploding gradients. (1 is a good starting point)
    sdpa: bool = False # use sdpa for CrossAttention (requires PyTorch 2.0)
    seed: int = None # random seed for training
    show_timesteps: str  = None # show timesteps in image or console, and return to console
    sigmoid_scale: float = 1.0 # Scale factor for sigmoid timestep sampling (only used when timestep-sampling is "sigmoid" or "shift").
    split_attn: bool = False # use split attention for attention calculation (split batch size=1, affects memory usage and speed)
    text_encoder: str  = None # text encoder (Qwen2.5-VL) checkpoint path
    timestep_sampling: str = "sigma" # Method to sample timesteps: sigma-based, uniform random, sigmoid of random normal, shift of sigmoid and flux shift.
    training_comment: str  = None # arbitrary comment string stored in metadata
    vae: str  = None # VAE checkpoint path
    vae_dtype: str  = None # data type for VAE, default is float16
    wandb_api_key: str  = None # specify WandB API key to log in before starting training (optional).
    wandb_run_name: str  = None # The name of the specific wandb session
    weighting_scheme: str  = "none" # weighting scheme for timestep distribution. Default is none
    xformers: bool = False # use xformers for CrossAttention, requires xformers

    @staticmethod
    def validate(config: 'QWenImageTrainingConfig', strict_mod: bool = False) -> 'QWenImageTrainingConfig':
        """
        Validate the QWenImageTrainingConfig instance.
        """
        if is_blank(config.dit):
            config.dit = path.join(getprojectpath(), "models", "qwen-image", "transformer", "qwen_image_bf16.safetensors")
        
        if not path.exists(config.dit):
            logger.warning(f"dit path does not exist: {config.dit}")
            raise ValueError(f"dit path does not exist: {config.dit}")

        if is_blank(config.vae):
            config.vae = path.join(getprojectpath(), "models", "qwen-image", "vae", "diffusion_pytorch_model.safetensors")

        if not path.exists(config.vae):
            logger.warning(f"vae path does not exist: {config.vae}")
            raise ValueError(f"vae path does not exist: {config.vae}")

        if is_blank(config.text_encoder):
            config.text_encoder = path.join(getprojectpath(), "models", "qwen-image", "text_encoders", "qwen_2.5_vl_7b.safetensors")

        if not path.exists(config.text_encoder):
            logger.warning(f"text_encoder path does not exist: {config.text_encoder}")
            raise ValueError(f"text_encoder path does not exist: {config.text_encoder}")
            
        if is_blank(config.output_dir):
            raise ValueError("Output directory is required.")
        
        if not path.exists(config.output_dir):
            logger.warning(f"Output directory: {config.output_dir} doesn't exist, created it")
            makedirs(config.output_dir, exist_ok=True)
            
        if config.max_train_steps is None or config.max_train_steps <= 0:
            raise ValueError("max_train_steps must be a positive number")
            
        if config.learning_rate is None or config.learning_rate <= 0:
            raise ValueError("Learning rate must be a positive number.")
            
        if config.network_dim is None or config.network_dim <= 0:
            logger.info("network_dim is invalid value, set to 32")
            config.network_dim = 32
        
        if is_blank(config.network_weights):
            # Force empty str to None
            config.network_weights = None

        config.log_with = "tensorboard" 
        if config.lr_scheduler == "constant" and config.lr_warmup_steps > 0:
            logger.warning("lr_warmup_steps is ignored when using constant scheduler")
            config.lr_warmup_steps = 0            

        if config.resume and not path.exists(config.resume):
            logger.warning(f"Resuming training must set correct resume path: {config.resume}")
            raise ValueError(f"Resuming training must set correct resume path: {config.resume}")

        if config.save_every_n_epochs and config.save_every_n_epochs <= 0:
            logger.warning("save_every_n_epochs must be greater than 0.")
            config.save_every_n_epochs = None
        
        if (config.sample_every_n_steps and config.sample_every_n_steps > 0 or  \
            config.sample_every_n_epochs and config.sample_every_n_epochs > 0): 
            if is_blank(config.sample_prompts):
                logger.warning("Do sampling requires sample_prompts.")
                raise ValueError("Do sampling requires sample_prompts.")
            else:
                config.sample_prompts = generate_sample_prompt_file(config.sample_prompts)
        else:
            logger.warning(f"if you want sampling , sample_every_n_steps {config.sample_every_n_steps} or sample_every_n_epochs {config.sample_every_n_epochs} need to be set")
            config.sample_prompts = None
        
        config.mixed_precision = "bf16"

        if not config.fp8_base:
            logger.info("fp8_base is false, OOM error could be raised during training, recommand set it to True ")
        
        if not config.fp8_vl:
            logger.info("fp8_vl is false, OOM error could be raised during training, recommand set it to True ")
        
        if is_blank(config.network_module):
            logger.info("Training Qwen-Image must set network_module to networks/lora_qwen_image")
            config.network_module = "networks.lora_qwen_image"
        
        if strict_mod is True:
            if config.blocks_to_swap < 16:
                logger.info(f"blocks_to_swap {config.blocks_to_swap} is less than 16, could be run on video card whose vram less than 24GB, set to 16")
                config.blocks_to_swap = 16
            if not is_blank(config.show_timesteps):
                config.show_timesteps = None

        return config


@dataclass
class QWenImageParameter:
    config: Optional[QWenImageTrainingConfig]
    dataset: Optional[QWenImageDataSetConfig]
    multi_gpu_config: Optional[MultiGPUConfig]
    frontend_config: Optional[str] = "" # Dedicated to saving the configuratio that frontend restore session configuration from backend
    skip_cache_latent: bool = False # skip cache latent step
    skip_cache_text_encoder_output: bool = False # skip cache text encoder output step


    @classmethod
    def from_dict(cls, dikt) -> 'QWenImageParameter':
        try: 
            return dacite.from_dict(data_class=QWenImageParameter, data=dikt, config=dacite.Config(
                            type_hooks={
                                Tuple[int, int]: lambda x: tuple(x), 
                            }
                        ))
        except Exception as e:
            logger.warning(f"QWenImageParameter.from_dict failed, error: ", exc_info=e)
            raise ValueError(f"QWenImageParameter.from_dict failed, error: {str(e)}")
    
    @staticmethod
    def validate(parameter: 'QWenImageParameter', strict_mod = False) -> 'QWenImageParameter':
        """
        Validate the QWenImageParameter instance.
        """
        if not parameter.config:
            raise ValueError("Training config is required.")
        
        parameter.config = QWenImageTrainingConfig.validate(parameter.config, strict_mod=strict_mod)
        
        if not parameter.dataset:
            raise ValueError("Dataset config is required.")

        if not parameter.multi_gpu_config:
            parameter.multi_gpu_config = MultiGPUConfig(multi_gpu_enabled=False)
        
        if parameter.multi_gpu_config.multi_gpu_enabled is True: 
            parameter.multi_gpu_config.gradient_accumulation_steps = parameter.config.gradient_accumulation_steps
        
        parameter.dataset = QWenImageDataSetConfig.validate(parameter.dataset, strict_mod=strict_mod)

        # network_module is fix string for the specific task. CAN NOT BE CHANGED
        parameter.config.network_module = "networks.lora_qwen_image"
        return parameter
    
    def is_enable_multi_gpu_train(self) -> bool:
        if not self.multi_gpu_config:
            return False
        
        if not self.multi_gpu_config.multi_gpu_enabled:
            return False
        
        if self.multi_gpu_config.num_gpus <= 1:
            return False
        
        if len(self.multi_gpu_config.gpu_ids) <= 1:
            return False
        
        return True
