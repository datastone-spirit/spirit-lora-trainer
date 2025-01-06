from dataclasses import dataclass, field
from typing import List, Optional, Union
import dacite

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
    resolutions: Optional[List[List[int]]] = None
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

@dataclass
class ModelConfig:
    type: str
    transformer_path: Optional[str] = None
    vae_path: Optional[str] = None
    llm_path: Optional[str] = None
    clip_path: Optional[str] = None
    dtype: str = "bfloat16"
    transformer_dtype: Optional[str] = None
    timestep_sample_method: Optional[str] = None

@dataclass
class AdapterConfig:
    type: str
    rank: int
    dtype: str
    init_from_existing: Optional[str] = None

@dataclass
class OptimizerConfig:
    type: str
    lr: float
    betas: List[float]
    weight_decay: float
    eps: float

@dataclass
class TrainingConfig:
    output_dir: str
    dataset: str
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