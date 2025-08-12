from typing import List, Optional, TypeVar
from dataclasses import dataclass

T = TypeVar('T')

@dataclass
class MultiGPUConfig:
    multi_gpu_enabled: bool = False
    num_gpus: int = 1
    gpu_ids: Optional[List[int]] = None
    distributed_backend: str = "nccl"  # nccl, gloo, mpi
    auto_gpu_selection: bool = True
    memory_requirement_mb: int = 8000
    gradient_sync_every_n_steps: int = 1    
    gradient_accumulation_steps: int = 1


@dataclass
class Model:

    def _from_dict(self, d=None):
        if d is not None:
            for key, value in d.items():
                setattr(self, key, value)
        return self

