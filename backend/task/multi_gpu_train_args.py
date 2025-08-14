from typing import List
from app.api.model.base_model import MultiGPUConfig
from utils.multi_gpu import accelerate_manager

    
def generate_multi_gpu_args(config: MultiGPUConfig) -> List[str]:
    """Generate accelerate launch arguments for multi-GPU training"""
    
    # Create accelerate configuration
    accelerate_config = accelerate_manager.create_config(
        gpu_ids=config.gpu_ids,
        mixed_precision=getattr(config, 'mixed_precision', 'bf16'),
        gradient_accumulation_steps=getattr(config, 'gradient_accumulation_steps', 1),
        memory_requirement_mb=config.memory_requirement_mb
    )

    return accelerate_manager.generate_launch_args(accelerate_config)