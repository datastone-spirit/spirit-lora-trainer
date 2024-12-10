from ..api.model.training_paramter import TrainingParameter


training_parameters: TrainingParameter

class TrainingService:

    def training(self,parameters :TrainingParameter):
        global training_parameters
        training_parameters = parameters
        print(f'trainingparameters is {training_parameters}')
        # TODO: generate shell scripts and run 

