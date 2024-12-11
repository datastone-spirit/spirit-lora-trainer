from app.api.model.training_paramter import TrainingParameter


    
def test_parameter_model():
    request = {
        'output_name': 'output_name1',
        'class_tokens': 'class_tokens1',
    }
    parameter = TrainingParameter.from_dict(request)
    assert parameter.output_name == 'output_name1'
    assert parameter.class_tokens == 'class_tokens1'
