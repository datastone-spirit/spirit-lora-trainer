import unittest
import os
import tempfile
import shutil
from unittest.mock import patch, MagicMock
from app.service.kontext_train import KontextTrainingService
from app.api.model.kontext_parameter import (
    KontextTrainingParameter, KontextConfig, ProcessConfig, 
    DatasetConfig, ModelConfig, NetworkConfig, SampleConfig, 
    SaveConfig, TrainConfig, MetaConfig
)

class TestKontextTrainingService(unittest.TestCase):

    def setUp(self):
        """Set up test environment"""
        self.temp_dir = tempfile.mkdtemp()
        self.ai_toolkit_path = os.path.join(self.temp_dir, "ai-toolkit")
        os.makedirs(self.ai_toolkit_path, exist_ok=True)
        
        # Create mock run.py script
        self.run_script = os.path.join(self.ai_toolkit_path, "run.py")
        with open(self.run_script, 'w') as f:
            f.write("# Mock run.py script")

    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    @patch('app.service.kontext_train.getprojectpath')
    def test_service_initialization(self, mock_getprojectpath):
        """Test KontextTrainingService initialization"""
        mock_getprojectpath.return_value = self.temp_dir
        
        service = KontextTrainingService()
        
        self.assertEqual(service.module_path, self.ai_toolkit_path)
        self.assertEqual(service.script, self.run_script)

    @patch('app.service.kontext_train.getprojectpath')
    def test_service_initialization_missing_script(self, mock_getprojectpath):
        """Test service initialization when script is missing"""
        mock_getprojectpath.return_value = self.temp_dir
        
        # Remove the run.py script
        os.remove(self.run_script)
        
        with self.assertRaises(FileNotFoundError) as context:
            KontextTrainingService()
        
        self.assertIn("Training script not found", str(context.exception))

    def test_generate_config_yaml(self):
        """Test YAML configuration generation"""
        # Create a complete KontextTrainingParameter for testing
        dataset = DatasetConfig(
            folder_path="/test/dataset",
            control_path="/test/control",
            caption_ext="txt",
            resolution=[512, 768]
        )
        
        model = ModelConfig(
            arch="flux_kontext",
            name_or_path="/test/model",
            quantize=True,
            low_vram=True
        )
        
        network = NetworkConfig(
            type="lora",
            linear=16,
            linear_alpha=16
        )
        
        sample = SampleConfig(
            prompts=["test prompt"],
            sample_every=250,
            guidance_scale=4.0
        )
        
        save = SaveConfig(
            dtype="float16",
            save_every=250
        )
        
        train = TrainConfig(
            batch_size=1,
            steps=1000,
            lr=0.0001
        )
        
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
        
        parameter = KontextTrainingParameter(
            config=config,
            job="extension",
            meta=meta
        )
        
        # Create temporary service for testing
        with patch('app.service.kontext_train.getprojectpath') as mock_getprojectpath:
            mock_getprojectpath.return_value = self.temp_dir
            service = KontextTrainingService()
            
            # Test config generation
            config_path = service._generate_config_yaml(parameter, self.temp_dir)
            
            # Verify config file was created
            self.assertTrue(os.path.exists(config_path))
            self.assertTrue(config_path.endswith('.yaml'))
            
            # Verify config content
            import yaml
            with open(config_path, 'r') as f:
                config_dict = yaml.safe_load(f)
            
            self.assertEqual(config_dict['job'], 'extension')
            self.assertEqual(config_dict['config']['name'], 'test_kontext_model')
            self.assertEqual(len(config_dict['config']['process']), 1)
            
            process_config = config_dict['config']['process'][0]
            self.assertEqual(process_config['type'], 'sd_trainer')
            self.assertEqual(process_config['model']['arch'], 'flux_kontext')
            self.assertEqual(process_config['network']['type'], 'lora')
            self.assertEqual(len(process_config['datasets']), 1)

    @patch('app.service.kontext_train.subprocess.Popen')
    @patch('app.service.kontext_train.Task.wrap_kontext_training')
    @patch('app.service.kontext_train.getprojectpath')
    def test_run_train(self, mock_getprojectpath, mock_wrap_training, mock_popen):
        """Test the run_train method"""
        mock_getprojectpath.return_value = self.temp_dir
        
        # Create mock venv python executable
        venv_path = os.path.join(self.ai_toolkit_path, "venv", "bin")
        os.makedirs(venv_path, exist_ok=True)
        python_executable = os.path.join(venv_path, "python")
        with open(python_executable, 'w') as f:
            f.write("#!/usr/bin/env python")
        os.chmod(python_executable, 0o755)
        
        # Mock subprocess and task wrapper
        mock_proc = MagicMock()
        mock_popen.return_value = mock_proc
        mock_task = MagicMock()
        mock_wrap_training.return_value = mock_task
        
        service = KontextTrainingService()
        
        # Create minimal parameter
        parameter = KontextTrainingParameter()
        
        # Test run_train
        result = service.run_train(
            config_file="/test/config.yaml",
            script=self.run_script,
            training_parameters=parameter,
            task_id="test_task"
        )
        
        # Verify subprocess was called with correct arguments
        mock_popen.assert_called_once()
        args, kwargs = mock_popen.call_args
        
        # Check command arguments
        command_args = args[0]
        self.assertEqual(command_args[0], python_executable)
        self.assertEqual(command_args[1], self.run_script)
        self.assertEqual(command_args[2], "/test/config.yaml")
        
        # Check environment variables
        env = kwargs['env']
        self.assertEqual(env['NCCL_P2P_DISABLE'], '1')
        self.assertEqual(env['NCCL_IB_DISABLE'], '1')
        self.assertEqual(env['PYTHONUNBUFFERED'], '1')
        
        # Verify task wrapper was called
        mock_wrap_training.assert_called_once_with(mock_proc, parameter, "test_task")
        self.assertEqual(result, mock_task)

if __name__ == '__main__':
    unittest.main()
