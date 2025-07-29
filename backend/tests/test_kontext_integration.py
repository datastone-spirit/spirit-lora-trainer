import unittest
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, '/home/ubuntu/zhaokun/spirit-lora-trainer/backend')

from app.api.model.kontext_parameter import (
    KontextTrainingParameter, KontextConfig, ProcessConfig,
    DatasetConfig, ModelConfig, NetworkConfig, SampleConfig,
    SaveConfig, TrainConfig, MetaConfig
)


class TestKontextTrainingIntegration(unittest.TestCase):
    
    def setUp(self):
        """Set up test data"""
        # Create a valid KontextTrainingParameter for testing
        dataset = DatasetConfig(
            folder_path="/test/dataset",
            control_path="/test/control",
            caption_ext="txt",
            resolution=[512, 768]
        )
        
        model = ModelConfig(
            arch="flux_kontext",
            name_or_path="/test/model"
        )
        
        network = NetworkConfig(
            type="lora",
            linear=16,
            linear_alpha=16
        )
        
        sample = SampleConfig(
            prompts=["test prompt"]
        )
        
        save = SaveConfig()
        train = TrainConfig()
        
        process = ProcessConfig(
            type="sd_trainer",
            training_folder="/test/output",
            datasets=[dataset],
            model=model,
            network=network,
            sample=sample,
            save=save,
            train=train
        )
        
        config = KontextConfig(
            name="test_kontext_model",
            process=[process]
        )
        
        meta = MetaConfig(
            name="test_meta",
            version="1.0"
        )
        
        self.parameter = KontextTrainingParameter(
            config=config,
            job="extension",
            meta=meta
        )

    def test_parameter_serialization(self):
        """Test that KontextTrainingParameter can be serialized to JSON and back"""
        from dataclasses import asdict
        
        # Convert to dictionary
        param_dict = asdict(self.parameter)
        
        # Verify structure
        self.assertEqual(param_dict['job'], 'extension')
        self.assertEqual(param_dict['config']['name'], 'test_kontext_model')
        self.assertEqual(len(param_dict['config']['process']), 1)
        
        # Test from_dict method
        reconstructed = KontextTrainingParameter.from_dict(param_dict)
        self.assertEqual(reconstructed.job, self.parameter.job)
        self.assertEqual(reconstructed.config.name, self.parameter.config.name)

    def test_parameter_validation(self):
        """Test parameter validation"""
        # This will fail validation because paths don't exist
        is_valid, message = KontextTrainingParameter.validate(self.parameter)
        self.assertFalse(is_valid)
        self.assertIn("folder_path", message)

    def test_parameter_validation_with_temp_dirs(self):
        """Test parameter validation using temporary directories"""
        import tempfile
        import os
        
        # Create temporary directories for testing
        with tempfile.TemporaryDirectory() as temp_dir:
            dataset_dir = os.path.join(temp_dir, "dataset")
            control_dir = os.path.join(temp_dir, "control") 
            output_dir = os.path.join(temp_dir, "output")
            model_dir = os.path.join(temp_dir, "model")
            
            # Create the directories
            os.makedirs(dataset_dir)
            os.makedirs(control_dir)
            os.makedirs(output_dir)
            os.makedirs(model_dir)
            
            # Create some dummy files to make validate_training_data pass
            with open(os.path.join(dataset_dir, "image1.jpg"), 'w') as f:
                f.write("dummy image")
            with open(os.path.join(dataset_dir, "image1.txt"), 'w') as f:
                f.write("dummy caption")
            
            # Create parameter with real existing paths
            dataset = DatasetConfig(
                folder_path=dataset_dir,
                control_path=control_dir,
                caption_ext="txt",
                resolution=[512, 768],
                cache_latents_to_disk=True,
                caption_dropout_rate=0.05,
                shuffle_tokens=False
            )
            
            model = ModelConfig(
                arch="flux_kontext",
                name_or_path=model_dir,
                quantize=True,
                low_vram=True
            )
            
            network = NetworkConfig(
                type="lora",
                linear=16,
                linear_alpha=16
            )
            
            sample = SampleConfig(
                guidance_scale=4.0,
                height=1024,
                neg="",
                prompts=["test prompt"],
                sample_every=250,
                sample_steps=20,
                sampler="flowmatch",
                seed=42,
                walk_seed=True,
                width=1024
            )
            
            save = SaveConfig(
                dtype="float16",
                max_step_saves_to_keep=4,
                push_to_hub=False,
                save_every=250
            )
            
            train = TrainConfig(
                batch_size=1,
                dtype="bf16",
                gradient_accumulation_steps=1,
                gradient_checkpointing=True,
                lr=0.0001,
                noise_scheduler="flowmatch",
                optimizer="adamw8bit",
                steps=3000,
                timestep_type="weighted",
                train_text_encoder=False,
                train_unet=True
            )
            
            process = ProcessConfig(
                type="sd_trainer",
                training_folder=output_dir,
                datasets=[dataset],
                device="cuda:0",
                model=model,
                network=network,
                sample=sample,
                save=save,
                train=train
            )
            
            config = KontextConfig(
                name="test_kontext_model_real_paths",
                process=[process]
            )
            
            meta = MetaConfig(
                name="test_meta",
                version="1.0"
            )
            
            complete_parameter = KontextTrainingParameter(
                config=config,
                job="extension",
                meta=meta,
                frontend_config=""
            )
            
            is_valid, message = KontextTrainingParameter.validate(complete_parameter)
            self.assertTrue(is_valid, f"Validation failed with message: {message}")
            self.assertEqual(message, "")

    def test_kontext_training_service_import(self):
        """Test that the KontextTrainingService can be imported"""
        try:
            from app.service.kontext_train import KontextTrainingService
            service = KontextTrainingService.__new__(KontextTrainingService)  # Don't call __init__ to avoid file checks
            self.assertIsNotNone(service)
        except ImportError as e:
            self.fail(f"Failed to import KontextTrainingService: {e}")

    def test_swagger_config_structure(self):
        """Test that the swagger configuration is properly structured"""
        from app.api.swagger.swagger_config import kontext_training_api_config
        
        # Verify basic structure
        self.assertIn('tags', kontext_training_api_config)
        self.assertIn('description', kontext_training_api_config)
        self.assertIn('parameters', kontext_training_api_config)
        self.assertIn('responses', kontext_training_api_config)
        
        # Verify responses
        responses = kontext_training_api_config['responses']
        self.assertIn('200', responses)
        self.assertIn('400', responses)
        self.assertIn('500', responses)
        
        # Verify parameters
        parameters = kontext_training_api_config['parameters']
        self.assertEqual(len(parameters), 1)
        self.assertEqual(parameters[0]['name'], 'kontext_config')
        self.assertEqual(parameters[0]['in'], 'body')
        self.assertTrue(parameters[0]['required'])

    def test_yaml_generation_from_parameter(self):
        """Test that we can generate YAML from the parameter"""
        from utils.dataclass_yaml import dataclass_to_yaml_string
        
        yaml_output = dataclass_to_yaml_string(self.parameter)
        
        # Basic checks
        self.assertIsInstance(yaml_output, str)
        self.assertIn('job: extension', yaml_output)
        self.assertIn('name: test_kontext_model', yaml_output)
        self.assertIn('flux_kontext', yaml_output)


if __name__ == '__main__':
    unittest.main()
