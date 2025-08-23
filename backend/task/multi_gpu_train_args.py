from typing import List, Dict
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

def prepare_multi_gpu_environment(config: MultiGPUConfig, customize_env):
            # Use configured backend, fallback to nccl for multi-GPU
    backend = config.distributed_backend
    if backend == 'nccl':
        # NCCL optimizations for multi-GPU training
        customize_env["NCCL_TIMEOUT"] = "1800"  # 30 minutes timeout
        customize_env["NCCL_DEBUG"] = "WARN"    # Reduce NCCL verbosity
                
                # Only disable P2P/IB if explicitly configured or for stability
        if getattr(config, 'disable_nccl_p2p', False):
            customize_env["NCCL_P2P_DISABLE"] = "1"
        if getattr(config, 'disable_nccl_ib', False):
            customize_env["NCCL_IB_DISABLE"] = "1"
            
            # Set GPU visibility
        if config.gpu_ids:
            customize_env["CUDA_VISIBLE_DEVICES"] = ",".join(map(str, config.gpu_ids))