from dataclasses import dataclass, field
from typing import List, Optional

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
