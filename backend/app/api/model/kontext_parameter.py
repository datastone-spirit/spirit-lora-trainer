from dataclasses import dataclass, field
from typing import List, Optional, Tuple
from utils.util import getmodelpath
from app.api.common.utils import validate_training_data
import dacite
import os

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

@dataclass
class DatasetConfig:
    cache_latents_to_disk: bool = False
    caption_dropout_rate: float = 0.05
    caption_ext: str = "txt"
    control_path: str = None
    folder_path: str = None
    resolution: List[int] = field(default_factory=lambda: [512, 768])
    shuffle_tokens: bool = False
    is_reg: bool = False
    network_weight: float = 1.0

    @staticmethod
    def validate(config: 'DatasetConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.folder_path or not os.path.exists(config.folder_path):
            logger.warning(f"folder_path is None or doesn't exist: {config.folder_path}")
            return False, f"folder_path is required and must exist: {config.folder_path}"
        
        if not config.control_path or not os.path.exists(config.control_path):
            logger.warning(f"control_path is None or doesn't exist: {config.control_path}")
            return False, f"control_path is required and must exist: {config.control_path}"
        
        valid, reason = validate_training_data(config.folder_path)
        if not valid:
            return valid, reason
        
        if not config.resolution or len(config.resolution) != 2:
            logger.warning("resolution must be a list of 2 integers, setting to default [512, 768]")
            config.resolution = [512, 768]
        
        if config.caption_dropout_rate is not None and (config.caption_dropout_rate < 0 or config.caption_dropout_rate > 1):
            logger.warning("caption_dropout_rate must be between 0 and 1, set to 0.05")
            config.caption_dropout_rate = 0.05
        
        if config.network_weight is not None and config.network_weight <= 0:
            logger.warning("network_weight must be positive, set to 1.0")
            config.network_weight = 1.0
        
        return True, ""

@dataclass
class ModelConfig:
    arch: str = "flux_kontext"
    name_or_path: str = None
    quantize: bool = True
    quantize_te: bool = None  # Will default to quantize value

    @staticmethod
    def validate(config: 'ModelConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.arch or config.arch != 'flux_kontext':
            logger.warning("config.arch is None or invalid, set to 'flux_kontext'")
            config.arch = 'flux_kontext'
        
        if not config.name_or_path:
            logger.warning("config.name_or_path is None, set to default")
            config.name_or_path = os.path.join(getmodelpath(), "kontext-dev")
        
        if not os.path.exists(config.name_or_path):
            logger.warning(f"model path: {config.name_or_path} doesn't exist")
            return False, f"model path {config.name_or_path} doesn't exist"
        
        # Set quantize_te to quantize if not specified
        if config.quantize_te is None:
            config.quantize_te = config.quantize
        
        return True, ""

@dataclass
class NetworkConfig:
    linear: int = 32
    linear_alpha: int = 32
    type: str = "lora"

    @staticmethod
    def validate(config: 'NetworkConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.type or config.type != 'lora':
            logger.warning("config.type is None or invalid, set to 'lora'")
            config.type = 'lora'
        
        if config.linear < 1 or config.linear > 256:
            logger.warning(f"config.linear is not valid: {config.linear}, set to default (32)")
            config.linear = 32
        
        if config.linear_alpha < 1 or config.linear_alpha > 256:
            logger.warning(f"config.linear_alpha is not valid: {config.linear_alpha}, set to default (32)")
            config.linear_alpha = 32
        
        return True, ""

@dataclass
class SampleConfig:
    guidance_scale: float = 4.0
    height: int = 1024
    neg: str = ""
    prompts: List[str] = field(default_factory=list)
    sample_every: int = 250
    sample_steps: int = 25
    sampler: str = "flowmatch"
    seed: int = 42
    walk_seed: bool = True
    width: int = 1024

    @staticmethod
    def validate(config: 'SampleConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.sampler or config.sampler != 'flowmatch':
            logger.warning("config.sampler is None or invalid, set to 'flowmatch'")
            config.sampler = 'flowmatch'
        
        if config.guidance_scale <= 0:
            logger.warning("config.guidance_scale must be positive, set to 4.0")
            config.guidance_scale = 4.0
        
        if config.height <= 0 or config.width <= 0:
            logger.warning("config.height and width must be positive, set to 1024")
            config.height = 1024
            config.width = 1024
        
        if config.sample_every <= 0:
            logger.warning("config.sample_every must be positive, set to 250")
            config.sample_every = 250
        
        if config.sample_steps <= 0:
            logger.warning("config.sample_steps must be positive, set to 25")
            config.sample_steps = 25
        
        if not config.prompts:
            logger.warning("config.prompts is empty")
            config.prompts = []
        
        return True, ""
    
    def is_sampling(self) -> bool:
        
        if not self.prompts or len(self.prompts) == 0:
            return False

        if self.sample_every <= 0 or self.sample_steps <= 0:
            return False
        return True

@dataclass
class SaveConfig:
    dtype: str = "fp16"
    max_step_saves_to_keep: int = 4
    push_to_hub: bool = False
    save_every: int = 250

    @staticmethod
    def validate(config: 'SaveConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.dtype or config.dtype not in ['fp16', 'fp32', 'bf16']:
            logger.warning("config.dtype is None or invalid, set to 'fp16'")
            config.dtype = 'fp16'
        
        if config.max_step_saves_to_keep <= 0:
            logger.warning("config.max_step_saves_to_keep must be positive, set to 4")
            config.max_step_saves_to_keep = 4
        
        if config.save_every <= 0:
            logger.warning("config.save_every must be positive, set to 250")
            config.save_every = 250
        
        return True, ""

@dataclass
class OptimizerParams:
    weight_decay: float = 0.0001

@dataclass
class EMAConfig:
    use_ema: bool = False
    ema_decay: float = 0.99

@dataclass
class TrainConfig:
    batch_size: int = 1
    dtype: str = "bf16"
    gradient_accumulation_steps: int = 1
    gradient_checkpointing: bool = True
    lr: float = 0.0001
    noise_scheduler: str = "flowmatch"
    optimizer: str = "adamw8bit"
    steps: int = 3000
    timestep_type: str = "weighted"
    train_text_encoder: bool = False
    train_unet: bool = True
    content_or_style: str = "balanced"
    optimizer_params: OptimizerParams = field(default_factory=OptimizerParams)
    unload_text_encoder: bool = False
    ema_config: EMAConfig = field(default_factory=EMAConfig)
    skip_first_sample: bool = False
    disable_sampling: bool = False
    diff_output_preservation: bool = False
    diff_output_preservation_multiplier: float = 1.0
    diff_output_preservation_class: str = "person"

    @staticmethod
    def validate(config: 'TrainConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.dtype or config.dtype not in ['bf16', 'fp16', 'fp32']:
            logger.warning("config.dtype is None or invalid, set to 'bf16'")
            config.dtype = 'bf16'
        
        if not config.noise_scheduler or config.noise_scheduler != 'flowmatch':
            logger.warning("config.noise_scheduler is None or invalid, set to 'flowmatch'")
            config.noise_scheduler = 'flowmatch'
        
        if not config.optimizer:
            logger.warning("config.optimizer is None, set to 'adamw8bit'")
            config.optimizer = 'adamw8bit'
        
        if not config.timestep_type or config.timestep_type != 'weighted':
            logger.warning("config.timestep_type is None or invalid, set to 'weighted'")
            config.timestep_type = 'weighted'
        
        if not config.content_or_style or config.content_or_style != 'balanced':
            logger.warning("config.content_or_style is None or invalid, set to 'balanced'")
            config.content_or_style = 'balanced'
        
        if not config.diff_output_preservation_class:
            logger.warning("config.diff_output_preservation_class is None, set to 'person'")
            config.diff_output_preservation_class = 'person'
        
        if config.batch_size <= 0:
            logger.warning("config.batch_size must be positive, set to 1")
            config.batch_size = 1
        
        if config.gradient_accumulation_steps <= 0:
            logger.warning("config.gradient_accumulation_steps must be positive, set to 1")
            config.gradient_accumulation_steps = 1
        
        if config.lr <= 0:
            logger.warning("config.lr must be positive, set to 0.0001")
            config.lr = 0.0001
        
        if config.steps <= 0:
            logger.warning("config.steps must be positive, set to 3000")
            config.steps = 3000
        
        if config.diff_output_preservation_multiplier <= 0:
            logger.warning("config.diff_output_preservation_multiplier must be positive, set to 1.0")
            config.diff_output_preservation_multiplier = 1.0
        
        # Validate optimizer_params
        if not config.optimizer_params:
            config.optimizer_params = OptimizerParams()
        elif config.optimizer_params.weight_decay < 0:
            logger.warning("optimizer_params.weight_decay must be non-negative, set to 0.0001")
            config.optimizer_params.weight_decay = 0.0001
        
        # Validate ema_config
        if not config.ema_config:
            config.ema_config = EMAConfig()
        elif config.ema_config.ema_decay <= 0 or config.ema_config.ema_decay >= 1:
            logger.warning("ema_config.ema_decay must be between 0 and 1, set to 0.99")
            config.ema_config.ema_decay = 0.99
        
        return True, ""

@dataclass
class ProcessConfig:
    type: str = "sd_trainer"
    training_folder: str = None
    datasets: List[DatasetConfig] = field(default_factory=list)
    device: str = "cuda:0"
    model: ModelConfig = field(default_factory=ModelConfig)
    network: NetworkConfig = field(default_factory=NetworkConfig)
    sample: SampleConfig = field(default_factory=SampleConfig)
    save: SaveConfig = field(default_factory=SaveConfig)
    train: TrainConfig = field(default_factory=TrainConfig)

    @staticmethod
    def validate(config: 'ProcessConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.type or config.type != 'sd_trainer':
            logger.warning("config.type is None or invalid, set to 'sd_trainer'")
            config.type = 'sd_trainer'
        
        if not config.training_folder:
            return False, "training_folder is required"
        
        if not config.device:
            logger.warning("config.device is None, set to 'cuda:0'")
            config.device = 'cuda:0'
        
        if not config.datasets:
            return False, "datasets list cannot be empty"
        
        # Validate sub-configs
        for dataset in config.datasets:
            valid, reason = DatasetConfig.validate(dataset)
            if not valid:
                return False, reason
        
        valid, reason = ModelConfig.validate(config.model)
        if not valid:
            return False, reason
        
        valid, reason = NetworkConfig.validate(config.network)
        if not valid:
            return False, reason
        
        valid, reason = SampleConfig.validate(config.sample)
        if not valid:
            return False, reason
        
        valid, reason = SaveConfig.validate(config.save)
        if not valid:
            return False, reason
        
        valid, reason = TrainConfig.validate(config.train)
        if not valid:
            return False, reason
        
        return True, ""

@dataclass
class KontextConfig:
    name: str = "my_first_flux_kontext_lora_v1"
    process: List[ProcessConfig] = field(default_factory=list)

    @staticmethod
    def validate(config: 'KontextConfig') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.name:
            logger.warning("config.name is None, set to default")
            config.name = "my_first_flux_kontext_lora_v1"
        
        if not config.process:
            return False, "process list cannot be empty"
        
        for process in config.process:
            valid, reason = ProcessConfig.validate(process)
            if not valid:
                return False, reason
        
        return True, ""

@dataclass
class MetaConfig:
    name: str = ""
    version: str = ""

@dataclass
class KontextTrainingParameter:
    config: KontextConfig = field(default_factory=KontextConfig)
    job: str = "extension"
    meta: MetaConfig = field(default_factory=MetaConfig)
    frontend_config: Optional[str] = ""  # Dedicated to saving the configuration that frontend restore session configuration from backend

    @classmethod
    def from_dict(cls, dikt) -> 'KontextTrainingParameter':
        try:
            return dacite.from_dict(data_class=KontextTrainingParameter, data=dikt)
        except Exception as e:
            logger.warning(f"KontextTrainingParameter.from_dict failed, error: ", exc_info=e)
            raise ValueError(f"KontextTrainingParameter.from_dict failed, error: {str(e)}")

    @staticmethod
    def validate(config: 'KontextTrainingParameter') -> 'Tuple[bool, str]':
        if not config:
            return False, "config is None"
        
        if not config.job or config.job != 'extension':
            logger.warning("config.job is None or invalid, set to 'extension'")
            config.job = 'extension'
        
        if len(config.config.process) != 1:
            return False, "config.config.process one one process was allowed"
        
        valid, reason = KontextConfig.validate(config.config)
        if not valid:
            return False, reason
        
        return True, ""
    
    def is_sampling(self) -> bool:
        if not self.config or not self.config.process:
            return False
        
        return self.config.process[0].sample.is_sampling()
    
    def sampling_path(self) -> str:
        if not self.is_sampling():
            return ""
        
        return os.path.join(self.config.process[0].training_folder, self.config.name, "samples")