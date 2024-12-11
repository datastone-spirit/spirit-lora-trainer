from app.api.model.training_paramter import TrainingParameter
from app.api.common.utils import traningparameter_to_args


    
def test_parameter_model():
    request = {
        'output_name': 'output_name1',
        'class_tokens': 'class_tokens1',
    }
    parameter = TrainingParameter.from_dict(request)
    assert parameter.output_name == 'output_name1'
    assert parameter.class_tokens == 'class_tokens1'


def test_traningparameter_to_arguments():
    request = {
        'output_name': 'output_name1',
        'class_tokens': 'class_tokens1',
    }
    parameter = TrainingParameter.from_dict(request)
    result = traningparameter_to_args(parameter)
    for i in ['--output_name "output_name1"', '--class_tokens "class_tokens1"']:
        assert i in result  
