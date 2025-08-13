
"""
GPU Detection and Validation Utilities
Enhanced GPU management utilities for multi-GPU training support.
Extends the existing GPU detection functionality with validation and optimization features.
"""

import subprocess
import time
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
import json

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)


@dataclass
class GPUInfo:
    """Detailed GPU information container"""
    index: int
    name: str
    memory_total_mb: int
    memory_used_mb: int
    memory_free_mb: int
    power_draw_watts: float
    power_limit_watts: float
    temperature_celsius: Optional[int]
    utilization_percent: Optional[int]
    uuid: Optional[str] = None
    driver_version: Optional[str] = None

    @property
    def memory_utilization_percent(self) -> float:
        """Calculate memory utilization percentage"""
        return (self.memory_used_mb / self.memory_total_mb) * 100 if self.memory_total_mb > 0 else 0

    @property
    def power_utilization_percent(self) -> float:
        """Calculate power utilization percentage"""
        return (self.power_draw_watts / self.power_limit_watts) * 100 if self.power_limit_watts > 0 else 0

    def is_suitable_for_training(self, memory_requirement_mb: int = 8000, max_temperature: int = 85) -> Tuple[bool, str]:
        """
        Check if GPU is suitable for training
        
        Args:
            memory_requirement_mb: Minimum memory requirement
            max_temperature: Maximum acceptable temperature
            
        Returns:
            Tuple of (is_suitable, reason)
        """
        if self.memory_free_mb < memory_requirement_mb:
            return False, f"Insufficient memory: {self.memory_free_mb}MB free, {memory_requirement_mb}MB required"

        if self.temperature_celsius and self.temperature_celsius > max_temperature:
            return False, f"Temperature too high: {self.temperature_celsius}°C (max {max_temperature}°C)"

        if self.utilization_percent and self.utilization_percent > 90:
            return False, f"GPU utilization too high: {self.utilization_percent}%"

        return True, "GPU suitable for training"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "index": self.index,
            "name": self.name,
            "memory_total_mb": self.memory_total_mb,
            "memory_used_mb": self.memory_used_mb,
            "memory_free_mb": self.memory_free_mb,
            "power_draw_watts": self.power_draw_watts,
            "power_limit_watts": self.power_limit_watts,
            "temperature_celsius": self.temperature_celsius,
            "utilization_percent": self.utilization_percent,
            "memory_utilization_percent": round(self.memory_utilization_percent, 1),
            "power_utilization_percent": round(self.power_utilization_percent, 1),
            "uuid": self.uuid,
            "driver_version": self.driver_version
        }


class GPUManager:
    """Enhanced GPU management with validation and monitoring capabilities"""

    def __init__(self):
        self.last_query_time = 0
        self.cache_duration = 2.0  # Cache GPU info for 2 seconds
        self._cached_gpus: List[GPUInfo] = []
    
    def get_all_gpus(self) -> List[Dict[str, Any]]:
        """Get all GPUs without filtering - returns complete GPU information"""
        return [gpu.to_dict() for gpu in self.get_gpu_info()]

    def get_gpu_info(self, force_refresh: bool = False) -> List[GPUInfo]:
        """
        Get detailed GPU information with caching
        
        Args:
            force_refresh: Force refresh of GPU information
            
        Returns:
            List of GPUInfo objects
        """
        current_time = time.time()

        # Use cached data if recent and not forcing refresh
        if not force_refresh and self._cached_gpus and (current_time - self.last_query_time) < self.cache_duration:
            return self._cached_gpus

        try:
            # Query basic GPU information
            basic_result = subprocess.run([
                "nvidia-smi",
                "--query-gpu=index,name,memory.total,memory.used,memory.free,power.draw,power.limit,temperature.gpu,utilization.gpu,uuid,driver_version",
                "--format=csv,noheader,nounits"
            ], capture_output=True, text=True)

            if basic_result.returncode != 0:
                logger.error(f"nvidia-smi failed: {basic_result.stderr}")
                return []

            gpus = []
            for line in basic_result.stdout.strip().split('\n'):
                if not line.strip():
                    continue

                parts = [p.strip() for p in line.split(',')]
                if len(parts) >= 11:
                    try:
                        gpu = GPUInfo(
                            index=int(parts[0]),
                            name=parts[1],
                            memory_total_mb=int(parts[2]),
                            memory_used_mb=int(parts[3]),
                            memory_free_mb=int(parts[4]),
                            power_draw_watts=float(parts[5]) if parts[5] not in ['[Not Supported]', '[N/A]'] else 0.0,
                            power_limit_watts=float(parts[6]) if parts[6] not in ['[Not Supported]', '[N/A]'] else 0.0,
                            temperature_celsius=int(parts[7]) if parts[7] not in ['[Not Supported]', '[N/A]'] else None,
                            utilization_percent=int(parts[8]) if parts[8] not in ['[Not Supported]', '[N/A]'] else None,
                            uuid=parts[9] if parts[9] != '[Not Supported]' else None,
                            driver_version=parts[10] if parts[10] != '[Not Supported]' else None
                        )
                        gpus.append(gpu)
                    except (ValueError, IndexError) as e:
                        logger.warning(f"Failed to parse GPU info line: {line}, error: {e}")
                        continue

            self._cached_gpus = gpus
            self.last_query_time = current_time
            logger.debug(f"Detected {len(gpus)} GPUs")
            return gpus

        except FileNotFoundError:
            logger.warning("nvidia-smi not found - no GPU detection available")
            return []
        except Exception as e:
            logger.error(f"GPU detection failed: {e}")
            return []

    def get_available_gpus(self, memory_requirement_mb: int = 8000) -> List[GPUInfo]:
        """
        Get GPUs that are available for training
        
        Args:
            memory_requirement_mb: Minimum memory requirement
            
        Returns:
            List of available GPUInfo objects
        """
        all_gpus = self.get_gpu_info()
        available_gpus = []

        for gpu in all_gpus:
            is_suitable, reason = gpu.is_suitable_for_training(memory_requirement_mb)
            if is_suitable:
                available_gpus.append(gpu)
            else:
                logger.debug(f"GPU {gpu.index} not available: {reason}")

        return available_gpus

    def validate_gpu_configuration(self, 
                                 gpu_ids: List[int], 
                                 batch_size_per_gpu: int = 1,
                                 memory_requirement_mb: int = 8000,
                                 force_override: bool = False) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Validate GPU configuration for training
        
        Args:
            gpu_ids: List of GPU indices to use
            batch_size_per_gpu: Batch size per GPU
            memory_requirement_mb: Base memory requirement per GPU
            force_override: If True, skip memory validation and allow user override
            
        Returns:
            Tuple of (is_valid, error_message, validation_details)
        """
        all_gpus = self.get_gpu_info()

        if not all_gpus:
            return False, "No GPUs detected", {}

        validation_details = {
            "total_gpus_detected": len(all_gpus),
            "requested_gpus": len(gpu_ids),
            "gpu_validations": [],
            "force_override": force_override
        }

        available_indices = [gpu.index for gpu in all_gpus]

        # Check if requested GPUs exist
        missing_gpus = [gpu_id for gpu_id in gpu_ids if gpu_id not in available_indices]
        if missing_gpus:
            return False, f"GPUs not found: {missing_gpus}. Available: {available_indices}", validation_details

        # Validate each requested GPU
        total_memory_available = 0
        insufficient_gpus = []

        for gpu_id in gpu_ids:
            gpu = next(g for g in all_gpus if g.index == gpu_id)

            # Calculate memory requirement including batch size scaling
            adjusted_memory_requirement = memory_requirement_mb + (batch_size_per_gpu * 2000)  # 2GB per batch estimate

            # Check suitability - skip memory check if force override is enabled
            if force_override:
                # Only check temperature and utilization, skip memory check
                is_suitable = True
                reason = "GPU available (memory check overridden)"

                if gpu.temperature_celsius and gpu.temperature_celsius > 85:
                    is_suitable = False
                    reason = f"Temperature too high: {gpu.temperature_celsius}°C (max 85°C)"
                elif gpu.utilization_percent and gpu.utilization_percent > 95:
                    is_suitable = False
                    reason = f"GPU utilization too high: {gpu.utilization_percent}%"
                elif gpu.memory_free_mb < 2000:  # Minimum 2GB free memory
                    is_suitable = False
                    reason = f"Critical memory shortage: {gpu.memory_free_mb}MB free (need at least 2GB)"
            else:
                is_suitable, reason = gpu.is_suitable_for_training(adjusted_memory_requirement)

            gpu_validation = {
                "gpu_id": gpu_id,
                "gpu_name": gpu.name,
                "memory_total_mb": gpu.memory_total_mb,
                "memory_free_mb": gpu.memory_free_mb,
                "memory_required_mb": adjusted_memory_requirement,
                "is_suitable": is_suitable,
                "reason": reason,
                "temperature_celsius": gpu.temperature_celsius,
                "utilization_percent": gpu.utilization_percent,
                "memory_check_overridden": force_override
            }

            validation_details["gpu_validations"].append(gpu_validation)

            if not is_suitable:
                insufficient_gpus.append(gpu_validation)
            else:
                total_memory_available += gpu.memory_free_mb

        if insufficient_gpus:
            error_details = []
            for gpu_info in insufficient_gpus:
                error_details.append(f"GPU {gpu_info['gpu_id']}: {gpu_info['reason']}")
            error_msg = f"GPU validation failed:\n" + "\n".join(error_details)
            if not force_override:
                error_msg += "\n\nNote: You can override memory checks for Flux LoRA training by enabling 'force_override'."
            return False, error_msg, validation_details

        # Check for GPU topology (optional warning)
        topology_warning = self._check_gpu_topology(gpu_ids)
        if topology_warning:
            validation_details["topology_warning"] = topology_warning

        validation_details["total_memory_available_mb"] = total_memory_available
        validation_details["estimated_memory_usage_mb"] = len(gpu_ids) * adjusted_memory_requirement

        return True, "GPU configuration valid", validation_details

    def _check_gpu_topology(self, gpu_ids: List[int]) -> Optional[str]:
        """
        Check GPU topology for optimal performance
        
        Args:
            gpu_ids: List of GPU indices
            
        Returns:
            Warning message if topology is not optimal, None otherwise
        """
        if len(gpu_ids) <= 1:
            return None

        try:
            # Query GPU topology
            result = subprocess.run([
                "nvidia-smi", "topo", "-m"
            ], capture_output=True, text=True)

            if result.returncode != 0:
                return None

            # Parse topology matrix (simplified check)
            lines = result.stdout.strip().split('\n')
            matrix_lines = [line for line in lines if line.strip() and any(c.isdigit() for c in line)]

            if len(matrix_lines) > len(gpu_ids):
                # Look for NVLINK connections (marked as 'NV' in topology)
                nvlink_count = 0
                for line in matrix_lines:
                    nvlink_count += line.count('NV')

                if nvlink_count == 0 and len(gpu_ids) > 2:
                    return "No NVLINK connections detected between GPUs. Performance may be limited by PCIe bandwidth."

        except Exception as e:
            logger.debug(f"GPU topology check failed: {e}")

        return None

    def get_optimal_gpu_selection(self, 
                                num_gpus: int, 
                                memory_requirement_mb: int = 8000,
                                prefer_low_utilization: bool = True) -> List[int]:
        """
        Get optimal GPU selection for training
        
        Args:
            num_gpus: Number of GPUs needed
            memory_requirement_mb: Memory requirement per GPU
            prefer_low_utilization: Prefer GPUs with lower current utilization
            
        Returns:
            List of optimal GPU indices
        """
        available_gpus = self.get_available_gpus(memory_requirement_mb)

        if len(available_gpus) < num_gpus:
            raise ValueError(f"Only {len(available_gpus)} suitable GPUs available, {num_gpus} requested")

        # Sort GPUs by preference criteria
        if prefer_low_utilization:
            # Sort by utilization (lower first), then by available memory (higher first)
            available_gpus.sort(key=lambda gpu: (
                gpu.utilization_percent or 0,
                -gpu.memory_free_mb
            ))
        else:
            # Sort by available memory only (higher first)
            available_gpus.sort(key=lambda gpu: -gpu.memory_free_mb)

        return [gpu.index for gpu in available_gpus[:num_gpus]]

    def monitor_gpu_usage(self, gpu_ids: List[int], duration_seconds: int = 10) -> Dict[str, List[Dict[str, Any]]]:
        """
        Monitor GPU usage over time
        
        Args:
            gpu_ids: List of GPU indices to monitor
            duration_seconds: Monitoring duration
            
        Returns:
            Dictionary with monitoring data
        """
        monitoring_data = {f"gpu_{gpu_id}": [] for gpu_id in gpu_ids}

        start_time = time.time()
        while time.time() - start_time < duration_seconds:
            gpus = self.get_gpu_info(force_refresh=True)
            timestamp = time.time()

            for gpu in gpus:
                if gpu.index in gpu_ids:
                    monitoring_data[f"gpu_{gpu.index}"].append({
                        "timestamp": timestamp,
                        "memory_used_mb": gpu.memory_used_mb,
                        "memory_free_mb": gpu.memory_free_mb,
                        "power_draw_watts": gpu.power_draw_watts,
                        "temperature_celsius": gpu.temperature_celsius,
                        "utilization_percent": gpu.utilization_percent
                    })

            time.sleep(1)  # Monitor every second

        return monitoring_data

    def get_system_info(self) -> Dict[str, Any]:
        """
        Get system information relevant to GPU training
        
        Returns:
            Dictionary with system information
        """
        try:
            # Get driver version
            driver_result = subprocess.run([
                "nvidia-smi", "--query-gpu=driver_version", "--format=csv,noheader"
            ], capture_output=True, text=True)

            driver_version = driver_result.stdout.strip().split('\n')[0] if driver_result.returncode == 0 else "Unknown"

            # Get CUDA version
            cuda_result = subprocess.run([
                "nvcc", "--version"
            ], capture_output=True, text=True)

            cuda_version = "Unknown"
            if cuda_result.returncode == 0:
                for line in cuda_result.stdout.split('\n'):
                    if 'release' in line.lower():
                        # Extract version from line like "Cuda compilation tools, release 11.8, V11.8.89"
                        parts = line.split('release')
                        if len(parts) > 1:
                            cuda_version = parts[1].split(',')[0].strip()
                        break

            return {
                "driver_version": driver_version,
                "cuda_version": cuda_version,
                "gpu_count": len(self.get_gpu_info()),
                "total_gpu_memory_mb": sum(gpu.memory_total_mb for gpu in self.get_gpu_info())
            }

        except Exception as e:
            logger.error(f"Failed to get system info: {e}")
            return {
                "driver_version": "Unknown",
                "cuda_version": "Unknown",
                "gpu_count": 0,
                "total_gpu_memory_mb": 0
            }


# Global GPU manager instance
gpu_manager = GPUManager()
