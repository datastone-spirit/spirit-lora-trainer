from app.api.model.training_paramter import TrainingConfig, TrainingDataset, TrainingParameter
from app.api.common.utils import traningparameter_to_args
    
def test_trainingconfig_model():
    request = {
        'output_name': 'output_name1',
        'bucket_reso_steps': 128,
    }
    parameter = TrainingConfig.from_dict(request)
    assert parameter.output_name == 'output_name1'
    assert parameter.bucket_reso_steps == 128


def test_traningconfig_to_arguments():
    request = {
        'output_name': 'output_name1',
        'bucket_reso_steps': 128,
    }
    parameter = TrainingConfig.from_dict(request)
    result = traningparameter_to_args(parameter)
    for i in ['--output_name "output_name1"', '--bucket_reso_steps 128']:
        assert i in result  

def test_trainingdataset_model():
    request = {
        'datasets': [{
            'batch_size': 1,
            'keep_tokens': 1,
            'resolution': 512,
            'subsets': [{
                'class_tokens': 'aaa',
                'image_dir': '/spirit/fluxgym/datasets/aaa',
                'num_repeats': 10
            }]
        }],
        'general': {
            'caption_extension': '.txt',
            'keep_tokens': 1,
            'shuffle_caption': False
        }
    }
    parameter = TrainingDataset.from_dict(request)
    assert parameter.datasets[0].batch_size == 1
    assert parameter.datasets[0].keep_tokens == 1
    assert parameter.datasets[0].resolution == 512
    assert parameter.datasets[0].subsets[0].class_tokens == 'aaa'
    assert parameter.datasets[0].subsets[0].image_dir == '/spirit/fluxgym/datasets/aaa'
    assert parameter.datasets[0].subsets[0].num_repeats == 10
    assert parameter.general.caption_extension == '.txt'
    assert parameter.general.keep_tokens == 1
    assert parameter.general.shuffle_caption == False
    assert parameter.general.shuffle_caption == False
    assert parameter.general.shuffle_caption == False


def test_trainingparamter_model():
    request = {
        'config': 
{
        'output_name': 'output_name1',
        'bucket_reso_steps': 128,
    } 
        ,
        'dataset': {
        'datasets': [{
            'batch_size': 1,
            'keep_tokens': 1,
            'resolution': 512,
            'subsets': [{
                'class_tokens': 'aaa',
                'image_dir': '/spirit/fluxgym/datasets/aaa',
                'num_repeats': 10
            }]
        }],
        'general': {
            'caption_extension': '.txt',
            'keep_tokens': 1,
            'shuffle_caption': False
        }
        }
    }

    training_paramter = TrainingParameter.from_dict(request)
    assert training_paramter.config.output_name == 'output_name1'
    assert training_paramter.config.bucket_reso_steps == 128
    assert len(training_paramter.dataset.datasets) == 1
    assert training_paramter.dataset.datasets[0].batch_size == 1
    assert training_paramter.dataset.datasets[0].keep_tokens == 1
    assert training_paramter.dataset.datasets[0].resolution == 512
    assert len(training_paramter.dataset.datasets[0].subsets) == 1
    assert training_paramter.dataset.datasets[0].subsets[0].class_tokens == 'aaa'
    assert training_paramter.dataset.datasets[0].subsets[0].image_dir == '/spirit/fluxgym/datasets/aaa'
    assert training_paramter.dataset.datasets[0].subsets[0].num_repeats == 10
    assert training_paramter.dataset.general.caption_extension == '.txt'
    assert training_paramter.dataset.general.keep_tokens == 1

def test_dataset_tofile():
    request = {
        'datasets': [{
            'batch_size': 1,
            'keep_tokens': 1,
            'resolution': 512,
            'subsets': [{
                'class_tokens': 'aaa',
                'image_dir': '/spirit/fluxgym/datasets/aaa',
                'num_repeats': 10
            }]
        }],
        'general': {
            'caption_extension': '.txt',
            'keep_tokens': 1,
            'shuffle_caption': False
        }
    }
    result="""[[datasets]]
batch_size = 1
keep_tokens = 1
resolution = 512
[[datasets.subsets]]
class_tokens = "aaa"
image_dir = "/spirit/fluxgym/datasets/aaa"
num_repeats = 10


[general]
caption_extension = ".txt"
keep_tokens = 1
shuffle_caption = false
"""
    parameter = TrainingDataset.from_dict(request)
    path = parameter.to_file()
    contents = open(path, 'r').read() 
    assert contents == result


    
