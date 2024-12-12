from app.api.model.training_paramter import TrainingConfig, TrainingDataset, TrainingParameter
from app.api.common.utils import traningparameter_to_args


    
def test_trainingconfig_model():
    request = {
        'output_name': 'output_name1',
        'class_tokens': 'class_tokens1',
    }
    parameter = TrainingConfig.from_dict(request)
    assert parameter.output_name == 'output_name1'
    assert parameter.class_tokens == 'class_tokens1'


def test_traningconfig_to_arguments():
    request = {
        'output_name': 'output_name1',
        'class_tokens': 'class_tokens1',
    }
    parameter = TrainingConfig.from_dict(request)
    result = traningparameter_to_args(parameter)
    for i in ['--output_name "output_name1"', '--class_tokens "class_tokens1"']:
        assert i in result  

def test_trainingdataset_model():
    request = {
        'datasets': {
            'batch_size': 1,
            'keep_tokens': 1,
            'resolution': 512,
            'subsets': {
                'class_tokens': 'aaa',
                'image_dir': '/spirit/fluxgym/datasets/aaa',
                'num_repeats': 10
            }
        },
        'general': {
            'caption_extension': '.txt',
            'keep_tokens': 1,
            'shuffle_caption': False
        }
    }
    parameter = TrainingDataset.from_dict(request)
    assert parameter.datasets.batch_size == 1
    assert parameter.datasets.keep_tokens == 1
    assert parameter.datasets.resolution == 512
    assert parameter.datasets.subsets.class_tokens == 'aaa'
    assert parameter.datasets.subsets.image_dir == '/spirit/fluxgym/datasets/aaa'
    assert parameter.datasets.subsets.num_repeats == 10
    assert parameter.general.caption_extension == '.txt'
    assert parameter.general.keep_tokens == 1
    assert parameter.general.shuffle_caption == False
    assert parameter.general.shuffle_caption == False
    assert parameter.general.shuffle_caption == False


def test_trainingparamter_model():
    paramter = {
        'config': 
{
        'output_name': 'output_name1',
        'class_tokens': 'class_tokens1',
    } 
        ,
        'dataset': {
        'datasets': {
            'batch_size': 1,
            'keep_tokens': 1,
            'resolution': 512,
            'subsets': {
                'class_tokens': 'aaa',
                'image_dir': '/spirit/fluxgym/datasets/aaa',
                'num_repeats': 10
            }
        },
        'general': {
            'caption_extension': '.txt',
            'keep_tokens': 1,
            'shuffle_caption': False
        }
        }
    }

    training_paramter = TrainingParameter.from_dict(paramter)
    assert training_paramter.config.output_name == 'output_name1'
    assert training_paramter.config.class_tokens == 'class_tokens1'
    assert training_paramter.dataset.datasets.batch_size == 1
    assert training_paramter.dataset.datasets.keep_tokens == 1
    assert training_paramter.dataset.datasets.resolution == 512
    assert training_paramter.dataset.datasets.subsets.class_tokens == 'aaa'
    assert training_paramter.dataset.datasets.subsets.image_dir == '/spirit/fluxgym/datasets/aaa'
    assert training_paramter.dataset.datasets.subsets.num_repeats == 10
    assert training_paramter.dataset.general.caption_extension == '.txt'
    assert training_paramter.dataset.general.keep_tokens == 1

def test_dataset_tofile():
    request = {
        'datasets': {
            'batch_size': 1,
            'keep_tokens': 1,
            'resolution': 512,
            'subsets': {
                'class_tokens': 'aaa',
                'image_dir': '/spirit/fluxgym/datasets/aaa',
                'num_repeats': 10
            }
        },
        'general': {
            'caption_extension': '.txt',
            'keep_tokens': 1,
            'shuffle_caption': False
        }
    }
    result="""[datasets]
batch_size = 1
keep_tokens = 1
resolution = 512

[general]
caption_extension = ".txt"
keep_tokens = 1
shuffle_caption = false

[datasets.subsets]
class_tokens = "aaa"
image_dir = "/spirit/fluxgym/datasets/aaa"
num_repeats = 10
"""
    parameter = TrainingDataset.from_dict(request)
    path = parameter.to_file()
    contents = open(path, 'r').read() 
    assert contents == result


    
