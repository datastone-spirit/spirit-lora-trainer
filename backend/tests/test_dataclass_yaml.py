import unittest
import tempfile
import os
import yaml
from dataclasses import asdict
from utils.dataclass_yaml import (
    dataclass_to_yaml_file, 
    dataclass_to_yaml_string,
    save_dataclass_config
)
from app.api.model.kontext_parameter import (
    KontextTrainingParameter, 
    KontextConfig, 
    ProcessConfig,
    DatasetConfig, 
    ModelConfig, 
    NetworkConfig,
    SampleConfig, 
    SaveConfig, 
    TrainConfig,
    MetaConfig
)


class TestDataclassYaml(unittest.TestCase):

    def setUp(self):
        """Set up test environment"""
        self.temp_dir = tempfile.mkdtemp()
        
        # Create a sample KontextTrainingParameter for testing
        self.dataset = DatasetConfig(
            folder_path="/test/dataset",
            control_path="/test/control",
            caption_ext="txt",
            resolution=[512, 768],
            caption_dropout_rate=0.1,
            shuffle_tokens=True
        )
        
        self.model = ModelConfig(
            arch="flux_kontext",
            name_or_path="/test/model",
            quantize=True,
            low_vram=False
        )
        
        self.network = NetworkConfig(
            type="lora",
            linear=32,
            linear_alpha=32
        )
        
        self.sample = SampleConfig(
            prompts=["test prompt 1", "test prompt 2"],
            sample_every=100,
            guidance_scale=3.5,
            width=1024,
            height=1024
        )
        
        self.save = SaveConfig(
            dtype="float16",
            save_every=500,
            max_step_saves_to_keep=3
        )
        
        self.train = TrainConfig(
            batch_size=2,
            steps=2000,
            lr=0.0002,
            optimizer="adamw",
            gradient_accumulation_steps=2
        )
        
        self.process = ProcessConfig(
            type="sd_trainer",
            training_folder="/test/output",
            device="cuda:0",
            datasets=[self.dataset],
            model=self.model,
            network=self.network,
            sample=self.sample,
            save=self.save,
            train=self.train
        )
        
        self.config = KontextConfig(
            name="test_kontext_model",
            process=[self.process]
        )
        
        self.meta = MetaConfig(
            name="test_meta",
            version="2.0"
        )
        
        self.parameter = KontextTrainingParameter(
            config=self.config,
            job="extension",
            meta=self.meta,
            frontend_config="test_frontend_config"
        )

    def tearDown(self):
        """Clean up test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_dataclass_to_dict_using_asdict(self):
        """Test converting dataclass to dictionary using built-in asdict"""
        result = asdict(self.parameter)
        
        # Verify structure
        self.assertIsInstance(result, dict)
        self.assertEqual(result['job'], 'extension')
        self.assertEqual(result['meta']['name'], 'test_meta')
        self.assertEqual(result['config']['name'], 'test_kontext_model')
        
        # Verify nested structure
        process = result['config']['process'][0]
        self.assertEqual(process['type'], 'sd_trainer')
        self.assertEqual(process['model']['arch'], 'flux_kontext')
        self.assertEqual(process['network']['linear'], 32)
        self.assertEqual(len(process['datasets']), 1)
        self.assertEqual(process['datasets'][0]['folder_path'], '/test/dataset')

    def test_dataclass_to_yaml_string(self):
        """Test converting dataclass to YAML string"""
        yaml_str = dataclass_to_yaml_string(self.parameter)
        
        self.assertIsInstance(yaml_str, str)
        self.assertIn('job: extension', yaml_str)
        self.assertIn('name: test_kontext_model', yaml_str)
        
        # Verify it's valid YAML
        parsed = yaml.safe_load(yaml_str)
        self.assertEqual(parsed['job'], 'extension')

    def test_dataclass_to_yaml_file(self):
        """Test saving dataclass to YAML file"""
        output_path = os.path.join(self.temp_dir, "test_config.yaml")
        
        result_path = dataclass_to_yaml_file(self.parameter, output_path)
        
        # Verify file was created
        self.assertEqual(result_path, output_path)
        self.assertTrue(os.path.exists(output_path))
        
        # Verify content
        with open(output_path, 'r') as f:
            content = yaml.safe_load(f)
        
        self.assertEqual(content['job'], 'extension')
        self.assertEqual(content['config']['name'], 'test_kontext_model')

    def test_save_dataclass_config(self):
        """Test convenience function for saving config"""
        config_path = save_dataclass_config(
            obj=self.parameter,
            output_dir=self.temp_dir,
            filename="kontext_test.yaml"
        )
        
        expected_path = os.path.join(self.temp_dir, "kontext_test.yaml")
        self.assertEqual(config_path, expected_path)
        self.assertTrue(os.path.exists(config_path))
        
        # Verify content
        with open(config_path, 'r') as f:
            content = yaml.safe_load(f)
        
        self.assertEqual(content['job'], 'extension')
        self.assertEqual(content['meta']['version'], '2.0')

    def test_save_dataclass_config_auto_filename(self):
        """Test saving config with auto-generated filename"""
        config_path = save_dataclass_config(
            obj=self.parameter,
            output_dir=self.temp_dir
        )
        
        self.assertTrue(os.path.exists(config_path))
        self.assertTrue(config_path.endswith('.yaml'))
        self.assertIn('config_', os.path.basename(config_path))

    def test_error_handling_non_dataclass(self):
        """Test error handling for non-dataclass objects"""
        with self.assertRaises(ValueError):
            dataclass_to_yaml_string("not a dataclass")
        
        with self.assertRaises(ValueError):
            dataclass_to_yaml_file({"not": "dataclass"}, "/tmp/test.yaml")

    def test_nested_lists_and_none_values(self):
        """Test handling of nested lists and None values using asdict"""
        # Test with None values
        dataset_with_none = DatasetConfig(
            folder_path="/test/dataset",
            control_path=None,  # None value
            caption_ext="txt"
        )
        
        result = asdict(dataset_with_none)
        self.assertIsNone(result['control_path'])
        
        # Test with list of dataclasses
        multi_dataset_process = ProcessConfig(
            datasets=[self.dataset, dataset_with_none]
        )
        
        result = asdict(multi_dataset_process)
        self.assertEqual(len(result['datasets']), 2)
        self.assertEqual(result['datasets'][0]['folder_path'], '/test/dataset')
        self.assertIsNone(result['datasets'][1]['control_path'])


if __name__ == '__main__':
    unittest.main()
