#!/usr/bin/env python3
"""
Test script for multi-GPU training functionality

This script tests the multi-GPU training infrastructure without running actual training.
It validates GPU detection, configuration, and accelerate setup.
"""

import sys
import os
import logging
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from utils.gpu_utils import gpu_manager
from utils.accelerate_config import accelerate_manager
from app.api.model.training_paramter import TrainingConfig
from app.service.train import TrainingService

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_gpu_detection():
    """Test GPU detection and information gathering"""
    print("="*50)
    print("Testing GPU Detection")
    print("="*50)
    
    try:
        # Test basic GPU detection
        gpus = gpu_manager.get_gpu_info()
        print(f"✓ Detected {len(gpus)} GPU(s)")
        
        for gpu in gpus:
            print(f"  GPU {gpu.index}: {gpu.name}")
            print(f"    Memory: {gpu.memory_free_mb}/{gpu.memory_total_mb} MB")
            print(f"    Temperature: {gpu.temperature_celsius}°C")
            print(f"    Power: {gpu.power_draw_watts}/{gpu.power_limit_watts}W")
            
        # Test system info
        system_info = gpu_manager.get_system_info()
        print(f"✓ Driver Version: {system_info['driver_version']}")
        print(f"✓ CUDA Version: {system_info['cuda_version']}")
        
        return True
        
    except Exception as e:
        print(f"✗ GPU detection failed: {e}")
        return False


def test_gpu_validation():
    """Test GPU configuration validation"""
    print("\n" + "="*50)
    print("Testing GPU Validation")
    print("="*50)
    
    try:
        available_gpus = gpu_manager.get_available_gpus()
        
        if not available_gpus:
            print("✗ No available GPUs for testing")
            return False
            
        # Test with first GPU
        gpu_ids = [available_gpus[0].index]
        print(f"Testing with GPU {gpu_ids[0]}")
        
        is_valid, error_msg, details = gpu_manager.validate_gpu_configuration(
            gpu_ids=gpu_ids,
            memory_requirement_mb=8000
        )
        
        if is_valid:
            print("✓ GPU configuration validation passed")
            print(f"  Validation details: {details}")
        else:
            print(f"✗ GPU validation failed: {error_msg}")
            
        return is_valid
        
    except Exception as e:
        print(f"✗ GPU validation test failed: {e}")
        return False


def test_accelerate_config():
    """Test accelerate configuration generation"""
    print("\n" + "="*50)
    print("Testing Accelerate Configuration")
    print("="*50)
    
    try:
        available_gpus = gpu_manager.get_available_gpus()
        
        if not available_gpus:
            print("✗ No available GPUs for accelerate config test")
            return False
            
        # Test single GPU config
        print("Testing single GPU configuration...")
        config_single = accelerate_manager.create_config(
            num_gpus=1,
            gpu_ids=[available_gpus[0].index]
        )
        print(f"✓ Single GPU config: {config_single.distributed_type}")
        print(f"  Processes: {config_single.num_processes}")
        
        # Test multi-GPU config if multiple GPUs available
        if len(available_gpus) > 1:
            print("Testing multi-GPU configuration...")
            config_multi = accelerate_manager.create_config(
                num_gpus=min(2, len(available_gpus)),
                gpu_ids=[gpu.index for gpu in available_gpus[:2]]
            )
            print(f"✓ Multi-GPU config: {config_multi.distributed_type}")
            print(f"  Processes: {config_multi.num_processes}")
            print(f"  GPU IDs: {config_multi.gpu_ids}")
        else:
            print("! Only one GPU available, skipping multi-GPU config test")
            
        # Test memory estimation
        print("Testing memory estimation...")
        memory_est = accelerate_manager.estimate_memory_usage(
            batch_size=1,
            model_size="flux-dev",
            precision="bf16"
        )
        print(f"✓ Memory estimation: {memory_est['total_memory_mb']} MB total")
        
        return True
        
    except Exception as e:
        print(f"✗ Accelerate configuration test failed: {e}")
        return False


def test_training_service_integration():
    """Test training service multi-GPU integration"""
    print("\n" + "="*50)
    print("Testing Training Service Integration")
    print("="*50)
    
    try:
        training_service = TrainingService()
        
        # Test available GPUs endpoint
        available_gpus = training_service.get_available_gpus()
        print(f"✓ Training service detected {len(available_gpus)} available GPU(s)")
        
        if available_gpus:
            # Test GPU validation
            gpu_ids = [available_gpus[0]['index']]
            validation_result = training_service.validate_gpu_selection(gpu_ids)
            
            if validation_result['is_valid']:
                print("✓ Training service GPU validation passed")
            else:
                print(f"✗ Training service GPU validation failed: {validation_result['error_message']}")
                
            # Test memory estimation
            memory_est = training_service.estimate_training_memory(batch_size=1, num_gpus=1)
            print(f"✓ Training service memory estimation: {memory_est}")
        
        return True
        
    except Exception as e:
        print(f"✗ Training service integration test failed: {e}")
        return False


def test_training_config_model():
    """Test training configuration model with multi-GPU parameters"""
    print("\n" + "="*50)
    print("Testing Training Configuration Model")
    print("="*50)
    
    try:
        # Create a training config with multi-GPU settings
        config = TrainingConfig(
            multi_gpu_enabled=True,
            num_gpus=2,
            gpu_ids=[0, 1],
            distributed_backend="nccl",
            auto_gpu_selection=False,
            memory_requirement_mb=10000,
            gradient_sync_every_n_steps=1,
            train_batch_size=1,
            mixed_precision="bf16"
        )
        
        print("✓ Training configuration model created successfully")
        print(f"  Multi-GPU enabled: {config.multi_gpu_enabled}")
        print(f"  Number of GPUs: {config.num_gpus}")
        print(f"  GPU IDs: {config.gpu_ids}")
        print(f"  Backend: {config.distributed_backend}")
        
        return True
        
    except Exception as e:
        print(f"✗ Training configuration model test failed: {e}")
        return False


def main():
    """Run all tests"""
    print("Multi-GPU Training Functionality Test")
    print("="*60)
    
    tests = [
        ("GPU Detection", test_gpu_detection),
        ("GPU Validation", test_gpu_validation), 
        ("Accelerate Configuration", test_accelerate_config),
        ("Training Service Integration", test_training_service_integration),
        ("Training Configuration Model", test_training_config_model)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"✗ Test '{test_name}' crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status:8} {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Multi-GPU functionality is ready.")
        return 0
    else:
        print("⚠️ Some tests failed. Please check the configuration.")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)