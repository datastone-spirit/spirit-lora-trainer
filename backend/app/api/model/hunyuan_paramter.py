from dataclasses import dataclass, field
from typing import List, Optional, Union, Tuple
from utils.util import getmodelpath
from app.api.common.utils import validate_training_data
import dacite
import os

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

@dataclass
class DirectoryConfig:
    # Path to directory of images/videos, and corresponding caption files.
    path: str
    # The dataset will act like it is duplicated this many times.
    num_repeats: int
    # Optional resolutions for this directory, given as (width, height) pairs.
    resolutions: Optional[List[int]] = None
    # Optional aspect ratio buckets for this directory, specified as width/height ratios or (width, height) pairs.
    ar_buckets: Optional[List[Union[float, List[int]]]] = None
    # Frame buckets for videos in this directory.
    frame_buckets: Optional[List[int]] = None

@dataclass
class DataSetConfig:
    # Resolutions to train on, given as the side length of a square image.
    resolutions: List[Union[int, List[int]]] = field(default_factory=lambda: [512])
    # Enable aspect ratio bucketing.
    enable_ar_bucket: bool = True
    # Min and max aspect ratios, given as width/height ratio.
    min_ar: float = 0.5
    max_ar: float = 2.0
    # Total number of aspect ratio buckets.
    num_ar_buckets: int = 7
    # Optional manual specification of aspect ratio buckets.
    ar_buckets: Optional[List[Union[float, List[int]]]] = None
    # Frame buckets for video training.
    frame_buckets: List[int] = field(default_factory=lambda: [1, 33, 65])
    # Directory-specific configurations.
    directories: List[DirectoryConfig] = field(default_factory=list)

    @staticmethod
    def validate(config: 'DataSetConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.resolutions:
            logger.warning("config.resolutions is None, set to default")
            config.resolutions = [512]
        
        if not config.enable_ar_bucket:
            logger.warning("config.enable_ar_bucket is None, set to True")
            config.enable_ar_bucket = True
        
        if not config.min_ar:
            logger.warning("config.min_ar is None, set to 0.5")
            config.min_ar = 0.5
        
        if not config.max_ar:
            logger.warning("config.max_ar is None, set to 2.0")
            config.max_ar = 2.0
        
        if not config.num_ar_buckets:
            logger.warning("config.num_ar_buckets is None, set to 7")
            config.num_ar_buckets = 7
        
        if not config.frame_buckets:
            logger.warning("config.frame_buckets is None, set to default")
            config.frame_buckets = [1, 33, 65]
        
        if not config.directories:
            logger.warning("config.directories is None, set to default")
            return False, "directories in data can't be None"
        
        for directory in config.directories:
            if not directory.path or not os.path.exists(directory.path):
                logger.warning(f"directory.path is None, or path: {directory.path} doesn't exist")
                return False, f"path in data can't be None, or path: {directory.path} doesn't exist"

            valid, reason = validate_training_data(directory.path) 
            if not valid:
                return valid, reason
            
            if not directory.num_repeats or directory.num_repeats < 1:
                logger.warning("directory.num_repeats is None or less then 1, set to 10")
                directory.num_repeats = 10
        
        return True, ""

@dataclass
class ModelConfig:
    # flux, ltx-video, or hunyuan-video
    type: str
    # Can load Hunyuan Video entirely from the ckpt path set up for the official inference script
    # Or you can load it by pointing to all the ComfyUI files
    transformer_path: Optional[str] = None
    vae_path: Optional[str] = None
    llm_path: Optional[str] = None
    clip_path: Optional[str] = None
    #  Base dtype used for all models.
    dtype: str = "bfloat16"
    # Hunyuan Video supports fp8 for the transformer when training LoRA.
    transformer_dtype: Optional[str] = "fp8"
    # How to sample timesteps to train on. Can be logit_normal or uniform.
    timestep_sample_method: Optional[str] = "logit_normal"

    @staticmethod
    def validate(config: 'ModelConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.type or config.type != 'hunyuan-video':
            logger.warning("config.type is None or invalid, set to 'hunyuan-video'")
            config.type = 'hunyuan-video'
        
        if not config.dtype:
            logger.warning("config.dtype is None, set to 'bfloat16'")
            config.dtype = 'bfloat16'
        
        if not config.transformer_dtype:
            logger.warning("config.transformer_dtype is None, set to 'fp8'")
            config.transformer_dtype = 'fp8'
        
        if not config.timestep_sample_method or config.timestep_sample_method not in ['logit_normal', 'uniform']:
            logger.warning("config.timestep_sample_method is None or invalid, set to 'logit_normal'")
            config.timestep_sample_method = 'logit_normal'

        if not config.transformer_path:
            logger.warning("config.transformer_path is None, set to default")
            config.transformer_path = os.path.join(getmodelpath(), 
                                                   "hunyuan", 
                                                   "transformer",
                                                   "hunyuan_video_720_cfgdistill_fp8_e4m3fn.safetensors")
        
        if not os.path.exists(config.transformer_path):
            logger.warning(f"transformer_path: {config.transformer_path} is not exist ")
            return False, f"transformer_path {config.transformer_path} is not exist"
        
        if not config.vae_path:
            logger.warning("config.vae_path is None, set to default")
            config.vae_path = os.path.join(getmodelpath(), 
                                           "hunyuan", 
                                           "vae",
                                           "hunyuan_video_vae_bf16.safetensors")
        
        if not os.path.exists(config.vae_path):
            logger.warning(f"vae_path: {config.vae_path} is not exist ")
            return False, f"vae_path {config.vae_path} is not exist"
        
        if not config.llm_path:
            logger.warning("config.llm_path is None, set to default")
            config.llm_path = os.path.join(getmodelpath(), 
                                           "hunyuan", 
                                           "llm",
                                           "llava-llama-3-8b-text-encoder-tokenizer")
        
        if not os.path.exists(config.llm_path):
            logger.warning(f"llm_path: {config.llm_path} is not exist ")
            return False, f"llm_path {config.llm_path} is not exist"

        if not config.clip_path:
            logger.warning("config.clip_path is None, set to default")
            config.clip_path = os.path.join(getmodelpath(), 
                                            "hunyuan", 
                                            "clip",
                                            "clip-vit-large-patch14")
        
        if not os.path.exists(config.clip_path):
            logger.warning(f"clip_path: {config.clip_path} is not exist ")
            return False, f"clip_path {config.clip_path} is not exist"
        
        return True, ""

@dataclass
class AdapterConfig:
    """ example:
    type = 'lora'
rank = 32
# Dtype for the LoRA weights you are training.
dtype = 'bfloat16'
# You can initialize the lora weights from a previously trained lora.
#init_from_existing = '/data/diffusion_pipe_training_runs/something/epoch50'

    Returns:
        _type_: _description_
    """
    type: str
    rank: int
    dtype: str
    init_from_existing: Optional[str] = None

    @staticmethod
    def validate(config: 'AdapterConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.type or config.type != 'lora':
            logger.warning("config.type is None or invalid, set to 'lora'")
            config.type = 'lora'
        
        if config.rank < 1 or config.rank > 256:
            logger.warning(f"config.rank is not valid: {config.rank}, set to default (32)")
            config.rank = 32
        
        if not config.dtype:
            logger.warning("config.dtype is None, set to 'bfloat16'")
            config.dtype = 'bfloat16'
        
        if config.init_from_existing is not None and \
            config.init_from_existing != "" and \
            not os.path.exists(config.init_from_existing):
            logger.warning(f"init_from_existing: {config.init_from_existing} is not exist ")
            return False, f"init_from_existing {config.init_from_existing} is not exist"

        
        return True, ""

@dataclass
class OptimizerConfig:
    """
AdamW from the optimi library is a good default since it automatically uses Kahan 
summation when training bfloat16 weights.  Look at train.py for other options. 
You could also easily edit the file and add your own.
type = 'adamw_optimi'
lr = 2e-5
betas = [0.9, 0.99]
weight_decay = 0.01
eps = 1e-8
    """
    type: str
    lr: float
    betas: List[float]
    weight_decay: float
    eps: float

    @staticmethod
    def validate(config: 'OptimizerConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.type:
            logger.warning("config.type is None, set to 'lora'")
            config.type = 'lora'
        
        if not config.lr:
            logger.warning("config.lr is None, set to 2e-5")
            config.lr = 2e-5
        
        if not config.betas:
            logger.warning("config.betas is None, set to [0.9, 0.99]")
            config.betas = [0.9, 0.99]
        
        if not config.weight_decay:
            logger.warning("config.weight_decay is None, set to 0.01")
            config.weight_decay = 0.01
        
        if not config.eps:
            logger.warning("config.eps is None, set to 1e-8")
            config.eps = 1e-8
        
        return True, ""

@dataclass
class TrainingConfig:
    output_dir: str
    dataset: str
    log_dir: str
    epochs: int = 1000
    micro_batch_size_per_gpu: int = 1
    pipeline_stages: int = 1
    gradient_accumulation_steps: int = 4
    gradient_clipping: float = 1.0
    warmup_steps: int = 100
    eval_every_n_epochs: int = 1
    eval_before_first_step: bool = True
    eval_micro_batch_size_per_gpu: int = 1
    eval_gradient_accumulation_steps: int = 1
    save_every_n_epochs: int = 2
    checkpoint_every_n_minutes: int = 120
    activation_checkpointing: bool = True
    partition_method: str = "parameters"
    save_dtype: str = "bfloat16"
    caching_batch_size: int = 1
    steps_per_print: int = 1
    video_clip_mode: str = "single_middle"
    model: ModelConfig = field(default_factory=ModelConfig)
    adapter: AdapterConfig = field(default_factory=AdapterConfig)
    optimizer: OptimizerConfig = field(default_factory=OptimizerConfig)


@dataclass
class HunyuanTrainingParameter:
    config : Optional[TrainingConfig]
    dataset : Optional[DataSetConfig]

    @classmethod
    def from_dict(cls, dikt) -> 'HunyuanTrainingParameter':
        try: 
            return dacite.from_dict(data_class=HunyuanTrainingParameter, data=dikt) 
        except Exception as e:
            logger.warning(f"TrainingParameter.from_dict failed, error: ", exc_info=e)
            raise ValueError(f"TrainingParameter.from_dict failed, error: {str(e)}")
    
    @staticmethod
    def validate(config: 'HunyuanTrainingParameter') -> 'Tuple[bool, str]':
        if not config.config or not config.dataset:
            return False, "config or dataset is None"
        
        if not config.config.output_dir:
            return False, "output_dir is None"
        
        if os.path.exists(config.config.output_dir) and not os.path.isdir(config.config.output_dir):
            return False, f"output_dir {config.config.output_dir} is not a directory"
        
        if not os.path.exists(config.config.output_dir):
            os.makedirs(config.config.output_dir, exist_ok=True)
        
        valid, reason = ModelConfig.validate(config.config.model)
        if not valid:
            return False, reason
        
        valid, reason = AdapterConfig.validate(config.config.adapter)
        if not valid:
            return False, reason

        valid, reason = OptimizerConfig.validate(config.config.optimizer)
        if not valid:
            return False, reason

        valid, reason = DataSetConfig.validate(config.dataset)
        return valid, reason
        
