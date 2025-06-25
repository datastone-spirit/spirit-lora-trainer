"""
GPU Information and Multi-GPU Configuration API Resources

Provides endpoints for GPU detection, validation, and multi-GPU configuration management.
"""

from flask import request
from flask_restful import Resource
from ..common.utils import use_swagger_config, res
from app.service.train import TrainingService
from utils.gpu_utils import gpu_manager
from typing import List

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)


class GPUInfo(Resource):
    def get(self):
        """
        Get detailed information about all GPUs (without filtering)
        Returns all detected GPUs regardless of memory requirements or training suitability
        """
        try:
            training_service = TrainingService()
            gpus = training_service.get_all_gpus()
            
            # Get system information
            system_info = gpu_manager.get_system_info()
            
            return res(
                data={
                    "gpus": gpus,
                    "system_info": system_info,
                    "total_gpus": len(gpus)
                },
                message="GPU information retrieved successfully"
            )
        except Exception as e:
            logger.error(f"Failed to get GPU info: {e}")
            return res(
                success=False,
                message=f"Failed to retrieve GPU information: {str(e)}",
                code=500
            ), 500


class GPUValidation(Resource):
    def post(self):
        """
        Validate GPU configuration for training
        
        Expected JSON payload:
        {
            "gpu_ids": [0, 1, 2],
            "memory_requirement_mb": 8000,
            "batch_size_per_gpu": 1,
            "force_override": false
        }
        """
        try:
            data = request.get_json()
            
            if not data:
                return res(
                    success=False,
                    message="No JSON data provided",
                    code=400
                ), 400
            
            gpu_ids = data.get('gpu_ids', [])
            memory_requirement_mb = data.get('memory_requirement_mb', 8000)
            batch_size_per_gpu = data.get('batch_size_per_gpu', 1)
            force_override = data.get('force_override', False)
            
            if not gpu_ids:
                return res(
                    success=False,
                    message="gpu_ids is required",
                    code=400
                ), 400
            
            # Validate GPU configuration
            is_valid, error_msg, validation_details = gpu_manager.validate_gpu_configuration(
                gpu_ids=gpu_ids,
                batch_size_per_gpu=batch_size_per_gpu,
                memory_requirement_mb=memory_requirement_mb,
                force_override=force_override
            )
            
            return res(
                data={
                    "is_valid": is_valid,
                    "error_message": error_msg if not is_valid else None,
                    "validation_details": validation_details,
                    "force_override": force_override
                },
                message="GPU configuration validated"
            )
            
        except Exception as e:
            logger.error(f"GPU validation failed: {e}")
            return res(
                success=False,
                message=f"GPU validation error: {str(e)}",
                code=500
            ), 500


class GPUOptimalSelection(Resource):
    def post(self):
        """
        Get optimal GPU selection for training
        
        Expected JSON payload:
        {
            "num_gpus": 2,
            "memory_requirement_mb": 8000,
            "prefer_low_utilization": true
        }
        """
        try:
            data = request.get_json()
            
            if not data:
                return res(
                    success=False,
                    message="No JSON data provided",
                    code=400
                ), 400
            
            num_gpus = data.get('num_gpus', 1)
            memory_requirement_mb = data.get('memory_requirement_mb', 8000)
            prefer_low_utilization = data.get('prefer_low_utilization', True)
            
            if num_gpus < 1:
                return res(
                    success=False,
                    message="num_gpus must be at least 1",
                    code=400
                ), 400
            
            # Get optimal GPU selection
            try:
                optimal_gpu_ids = gpu_manager.get_optimal_gpu_selection(
                    num_gpus=num_gpus,
                    memory_requirement_mb=memory_requirement_mb,
                    prefer_low_utilization=prefer_low_utilization
                )
                
                # Get details for selected GPUs
                all_gpus = gpu_manager.get_gpu_info()
                selected_gpu_details = [
                    gpu.to_dict() for gpu in all_gpus if gpu.index in optimal_gpu_ids
                ]
                
                return res(
                    data={
                        "optimal_gpu_ids": optimal_gpu_ids,
                        "selected_gpus": selected_gpu_details,
                        "total_memory_mb": sum(gpu["memory_total_mb"] for gpu in selected_gpu_details),
                        "total_free_memory_mb": sum(gpu["memory_free_mb"] for gpu in selected_gpu_details)
                    },
                    message=f"Optimal GPU selection found: {optimal_gpu_ids}"
                )
                
            except ValueError as ve:
                return res(
                    success=False,
                    message=str(ve),
                    code=400
                ), 400
            
        except Exception as e:
            logger.error(f"Optimal GPU selection failed: {e}")
            return res(
                success=False,
                message=f"Failed to get optimal GPU selection: {str(e)}",
                code=500
            ), 500


class MemoryEstimation(Resource):
    def post(self):
        """
        Estimate memory requirements for training configuration
        
        Expected JSON payload:
        {
            "batch_size": 1,
            "num_gpus": 2,
            "sequence_length": 512,
            "model_size": "flux-dev",
            "precision": "bf16",
            "training_type": "lora",
            "use_flux_optimizations": true
        }
        """
        try:
            data = request.get_json()
            
            if not data:
                return res(
                    success=False,
                    message="No JSON data provided",
                    code=400
                ), 400
            
            batch_size = data.get('batch_size', 1)
            num_gpus = data.get('num_gpus', 1)
            sequence_length = data.get('sequence_length', 512)
            model_size = data.get('model_size', 'flux-dev')
            precision = data.get('precision', 'bf16')
            training_type = data.get('training_type', 'lora')
            use_flux_optimizations = data.get('use_flux_optimizations', True)
            
            # Get memory estimation from accelerate manager
            from utils.accelerate_config import accelerate_manager
            memory_estimate = accelerate_manager.estimate_memory_usage(
                batch_size=batch_size,
                sequence_length=sequence_length,
                model_size=model_size,
                precision=precision,
                training_type=training_type,
                use_flux_optimizations=use_flux_optimizations
            )
            
            # Calculate total requirements for all GPUs
            total_memory_mb = memory_estimate["total_memory_mb"] * num_gpus
            recommended_memory_mb = memory_estimate["recommended_memory_mb"] * num_gpus
            
            # For Flux LoRA training, use minimum requirement instead of scaled total
            if use_flux_optimizations and training_type.lower() == "lora":
                total_memory_mb = memory_estimate["minimum_requirement_mb"]
                recommended_memory_mb = memory_estimate["minimum_requirement_mb"] + 2000
            
            return res(
                data={
                    "per_gpu_estimate": memory_estimate,
                    "total_memory_mb": total_memory_mb,
                    "recommended_memory_mb": recommended_memory_mb,
                    "configuration": {
                        "batch_size": batch_size,
                        "num_gpus": num_gpus,
                        "sequence_length": sequence_length,
                        "model_size": model_size,
                        "precision": precision,
                        "training_type": training_type,
                        "use_flux_optimizations": use_flux_optimizations
                    }
                },
                message="Memory estimation completed"
            )
            
        except Exception as e:
            logger.error(f"Memory estimation failed: {e}")
            return res(
                success=False,
                message=f"Memory estimation error: {str(e)}",
                code=500
            ), 500


class GPUMonitoring(Resource):
    def post(self):
        """
        Monitor GPU usage over time
        
        Expected JSON payload:
        {
            "gpu_ids": [0, 1],
            "duration_seconds": 10
        }
        """
        try:
            data = request.get_json()
            
            if not data:
                return res(
                    success=False,
                    message="No JSON data provided",
                    code=400
                ), 400
            
            gpu_ids = data.get('gpu_ids', [])
            duration_seconds = data.get('duration_seconds', 10)
            
            if not gpu_ids:
                return res(
                    success=False,
                    message="gpu_ids is required",
                    code=400
                ), 400
            
            if duration_seconds < 1 or duration_seconds > 300:  # Max 5 minutes
                return res(
                    success=False,
                    message="duration_seconds must be between 1 and 300",
                    code=400
                ), 400
            
            # Monitor GPU usage
            monitoring_data = gpu_manager.monitor_gpu_usage(
                gpu_ids=gpu_ids,
                duration_seconds=duration_seconds
            )
            
            return res(
                data={
                    "monitoring_data": monitoring_data,
                    "duration_seconds": duration_seconds,
                    "monitored_gpus": gpu_ids
                },
                message=f"GPU monitoring completed for {duration_seconds} seconds"
            )
            
        except Exception as e:
            logger.error(f"GPU monitoring failed: {e}")
            return res(
                success=False,
                message=f"GPU monitoring error: {str(e)}",
                code=500
            ), 500