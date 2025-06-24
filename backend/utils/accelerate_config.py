"""
Accelerate Configuration Management for Multi-GPU Training

This module provides utilities for generating and managing HuggingFace Accelerate
configurations for distributed training with multiple GPUs.
"""

import os
import yaml
import json
import subprocess
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from pathlib import Path

from utils.util import setup_logging, getprojectpath
setup_logging()
import logging
logger = logging.getLogger(__name__)


@dataclass
class AccelerateConfig:
    """Configuration for HuggingFace Accelerate distributed training"""
    
    # Compute environment
    compute_environment: str = "LOCAL_MACHINE"
    
    # Distributed type
    distributed_type: str = "MULTI_GPU"  # NO, MULTI_GPU, MULTI_CPU, TPU, MPS
    
    # GPU configuration
    num_processes: int = 1
    gpu_ids: Optional[List[int]] = None
    
    # Mixed precision
    mixed_precision: str = "bf16"  # no, fp16, bf16, fp8
    
    # Training optimizations
    gradient_accumulation_steps: int = 1
    gradient_clipping: bool = True
    
    # Memory optimizations
    fsdp: bool = False
    fsdp_config: Optional[Dict[str, Any]] = None
    
    # Communication backend
    backend: str = "nccl"  # nccl, gloo, mpi
    
    # Other settings
    machine_rank: int = 0
    num_machines: int = 1
    rdzv_backend: str = "static"
    same_network: bool = True
    
    # Advanced options
    use_cpu: bool = False
    dynamo_backend: str = "NO"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert config to dictionary format"""
        config_dict = asdict(self)
        
        # Remove None values and empty lists
        config_dict = {k: v for k, v in config_dict.items() if v is not None}
        
        # Convert gpu_ids to string format if present
        if self.gpu_ids:
            config_dict["gpu_ids"] = ",".join(map(str, self.gpu_ids))
        elif "gpu_ids" in config_dict:
            del config_dict["gpu_ids"]
            
        return config_dict
    
    def to_yaml(self) -> str:
        """Convert config to YAML format"""
        return yaml.dump(self.to_dict(), default_flow_style=False, sort_keys=False)
    
    def save_to_file(self, filepath: str) -> None:
        """Save configuration to YAML file"""
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, 'w') as f:
            f.write(self.to_yaml())
        logger.info(f"Accelerate config saved to: {filepath}")


class AccelerateConfigManager:
    """Manager for creating and handling Accelerate configurations"""
    
    def __init__(self):
        self.config_dir = os.path.join(getprojectpath(), "configs", "accelerate")
        os.makedirs(self.config_dir, exist_ok=True)
    
    def detect_available_gpus(self) -> List[Dict[str, Any]]:
        """
        Detect available GPUs using nvidia-smi
        
        Returns:
            List of GPU information dictionaries
        """
        try:
            result = subprocess.run([
                "nvidia-smi", 
                "--query-gpu=index,name,memory.total,memory.free,power.limit,temperature.gpu",
                "--format=csv,noheader,nounits"
            ], capture_output=True, text=True)
            
            if result.returncode != 0:
                logger.warning(f"nvidia-smi failed: {result.stderr}")
                return []
            
            gpus = []
            for line in result.stdout.strip().split('\n'):
                if line.strip():
                    parts = [p.strip() for p in line.split(',')]
                    if len(parts) >= 6:
                        gpus.append({
                            'index': int(parts[0]),
                            'name': parts[1],
                            'memory_total_mb': int(parts[2]),
                            'memory_free_mb': int(parts[3]),
                            'power_limit_watts': float(parts[4]),
                            'temperature_celsius': int(parts[5]) if parts[5] != '[Not Supported]' else None
                        })
            
            logger.info(f"Detected {len(gpus)} GPUs")
            return gpus
            
        except FileNotFoundError:
            logger.warning("nvidia-smi not found - no GPU detection available")
            return []
        except Exception as e:
            logger.error(f"GPU detection failed: {e}")
            return []
    
    def validate_gpu_setup(self, gpu_ids: List[int], memory_requirement_mb: int = 8000, force_override: bool = False) -> Tuple[bool, str]:
        """
        Validate GPU setup for training
        
        Args:
            gpu_ids: List of GPU indices to use
            memory_requirement_mb: Minimum memory requirement per GPU in MB
            force_override: If True, skip memory validation and allow user override
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        available_gpus = self.detect_available_gpus()
        
        if not available_gpus:
            return False, "No GPUs detected"
        
        available_indices = [gpu['index'] for gpu in available_gpus]
        
        # Check if requested GPUs exist
        for gpu_id in gpu_ids:
            if gpu_id not in available_indices:
                return False, f"GPU {gpu_id} not found. Available GPUs: {available_indices}"
        
        # Check memory requirements (unless overridden)
        if not force_override:
            insufficient_memory = []
            for gpu_id in gpu_ids:
                gpu_info = next(gpu for gpu in available_gpus if gpu['index'] == gpu_id)
                if gpu_info['memory_free_mb'] < memory_requirement_mb:
                    insufficient_memory.append({
                        'gpu_id': gpu_id,
                        'available_mb': gpu_info['memory_free_mb'],
                        'required_mb': memory_requirement_mb
                    })
            
            if insufficient_memory:
                error_msg = "Insufficient GPU memory:\n"
                for gpu in insufficient_memory:
                    error_msg += f"  GPU {gpu['gpu_id']}: {gpu['available_mb']}MB available, {gpu['required_mb']}MB required\n"
                error_msg += "\nNote: You can override this check for Flux LoRA training which uses optimized memory usage."
                return False, error_msg.strip()
        
        return True, ""
    
    def create_config(self, 
                     num_gpus: int = 1,
                     gpu_ids: Optional[List[int]] = None,
                     mixed_precision: str = "bf16",
                     gradient_accumulation_steps: int = 1,
                     memory_requirement_mb: int = 8000,
                     force_override: bool = False) -> AccelerateConfig:
        """
        Create accelerate configuration for distributed training
        
        Args:
            num_gpus: Number of GPUs to use
            gpu_ids: Specific GPU indices to use (if None, uses first num_gpus GPUs)
            mixed_precision: Mixed precision mode (no, fp16, bf16, fp8)
            gradient_accumulation_steps: Gradient accumulation steps
            memory_requirement_mb: Memory requirement for validation
            force_override: If True, skip memory validation and allow user override
            
        Returns:
            AccelerateConfig object
        """
        # Auto-detect GPUs if not specified
        if gpu_ids is None:
            available_gpus = self.detect_available_gpus()
            if not available_gpus:
                raise ValueError("No GPUs detected for training")
            
            if num_gpus > len(available_gpus):
                raise ValueError(f"Requested {num_gpus} GPUs but only {len(available_gpus)} available")
            
            gpu_ids = [gpu['index'] for gpu in available_gpus[:num_gpus]]
        
        # Validate GPU setup
        is_valid, error_msg = self.validate_gpu_setup(gpu_ids, memory_requirement_mb, force_override)
        if not is_valid:
            raise ValueError(f"GPU validation failed: {error_msg}")
        
        # Determine distributed type
        distributed_type = "NO" if len(gpu_ids) == 1 else "MULTI_GPU"
        
        # Create configuration
        config = AccelerateConfig(
            distributed_type=distributed_type,
            num_processes=len(gpu_ids),
            gpu_ids=gpu_ids if len(gpu_ids) > 1 else None,
            mixed_precision=mixed_precision,
            gradient_accumulation_steps=gradient_accumulation_steps,
            backend="nccl" if len(gpu_ids) > 1 else "gloo"
        )
        
        logger.info(f"Created accelerate config for {len(gpu_ids)} GPUs: {gpu_ids}")
        return config
    
    def save_config(self, config: AccelerateConfig, name: str = "default") -> str:
        """
        Save accelerate configuration to file
        
        Args:
            config: AccelerateConfig object
            name: Configuration name
            
        Returns:
            Path to saved configuration file
        """
        filepath = os.path.join(self.config_dir, f"{name}_config.yaml")
        config.save_to_file(filepath)
        return filepath
    
    def generate_launch_args(self, config: AccelerateConfig, script_path: str, script_args: List[str]) -> List[str]:
        """
        Generate accelerate launch command arguments
        
        Args:
            config: AccelerateConfig object
            script_path: Path to training script
            script_args: Arguments for training script
            
        Returns:
            Complete command arguments list
        """
        import sys
        
        args = [sys.executable, "-m", "accelerate.commands.launch"]
        
        # Add configuration parameters
        if config.num_processes > 1:
            args.extend(["--num_processes", str(config.num_processes)])
        
        if config.gpu_ids:
            args.extend(["--gpu_ids", ",".join(map(str, config.gpu_ids))])
        
        if config.mixed_precision != "no":
            args.extend(["--mixed_precision", config.mixed_precision])
        
        # Add script and its arguments
        args.append(script_path)
        args.extend(script_args)
        
        logger.info(f"Generated launch args: {' '.join(args)}")
        return args
    
    def estimate_memory_usage(self, 
                            batch_size: int,
                            sequence_length: int = 512,
                            model_size: str = "flux-dev",
                            precision: str = "bf16",
                            training_type: str = "lora",
                            use_flux_optimizations: bool = True) -> Dict[str, int]:
        """
        Estimate memory usage for training configuration
        
        Args:
            batch_size: Training batch size per GPU
            sequence_length: Token sequence length
            model_size: Model size identifier
            precision: Training precision
            training_type: Type of training (lora, full, dreambooth)
            use_flux_optimizations: Whether to apply Flux LoRA optimizations
            
        Returns:
            Dictionary with memory estimates in MB
        """
        # Base memory estimates for different models (in MB)
        model_memory = {
            "flux-dev": 12000,  # ~12GB for FLUX.1-dev
            "flux-schnell": 12000,  # Similar to dev
        }
        
        # Precision multipliers
        precision_multiplier = {
            "fp32": 1.0,
            "fp16": 0.5,
            "bf16": 0.5,
            "fp8": 0.25
        }
        
        base_memory = model_memory.get(model_size, 12000)
        precision_mult = precision_multiplier.get(precision, 0.5)
        
        # Apply Flux LoRA optimizations if enabled
        if use_flux_optimizations and training_type.lower() == "lora":
            # Flux LoRA training uses aggressive memory optimizations:
            # - fp8 quantization reduces memory by ~75%
            # - LoRA only trains adapters, not full model
            # - Gradient checkpointing
            # - Memory efficient attention
            # - Only compute gradients for LoRA layers
            
            # LoRA memory is much smaller - only adapter weights
            lora_memory = base_memory * 0.05  # LoRA adapters are ~5% of model size
            
            # With fp8 quantization and optimizations
            if precision == "fp8":
                optimized_base_memory = lora_memory * 0.25  # fp8 quantization
            else:
                optimized_base_memory = lora_memory * 0.5  # bf16/fp16 optimizations
            
            # Reduced activation memory due to gradient checkpointing
            activation_memory = batch_size * sequence_length * 2 * precision_mult * 0.3  # 70% reduction
            
            # Optimizer only needs to store LoRA parameters
            optimizer_memory = optimized_base_memory * 2 * precision_mult
            
            # Total memory estimate with minimal overhead
            total_memory = int((optimized_base_memory + activation_memory + optimizer_memory) * 1.1)
            
            # Flux LoRA minimum requirement is ~12GB
            flux_lora_minimum = 10000  # 10GB actual minimum
            total_memory = max(total_memory, flux_lora_minimum)
            
        else:
            # Standard full training estimates
            # Estimate activation memory (scales with batch size)
            activation_memory = batch_size * sequence_length * 4 * precision_mult
            
            # Optimizer states (Adam requires 2x model parameters)
            optimizer_memory = base_memory * 2 * precision_mult
            
            # Total memory estimate with 20% overhead
            total_memory = int((base_memory + activation_memory + optimizer_memory) * 1.2)
        
        return {
            "model_memory_mb": int(base_memory * precision_mult) if not use_flux_optimizations else int(optimized_base_memory if 'optimized_base_memory' in locals() else base_memory * precision_mult),
            "activation_memory_mb": int(activation_memory),
            "optimizer_memory_mb": int(optimizer_memory),
            "total_memory_mb": total_memory,
            "recommended_memory_mb": total_memory + 2000,  # Add 2GB buffer
            "flux_lora_optimized": use_flux_optimizations and training_type.lower() == "lora",
            "minimum_requirement_mb": flux_lora_minimum if use_flux_optimizations and training_type.lower() == "lora" else total_memory
        }


# Global manager instance
accelerate_manager = AccelerateConfigManager()