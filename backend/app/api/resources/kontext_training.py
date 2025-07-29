from flask import request
from flask_restful import Resource
from app.service.kontext_train import KontextTrainingService
from app.api.common.utils import use_swagger_config, res
from app.api.swagger.swagger_config import kontext_training_api_config
from app.api.model.kontext_parameter import KontextTrainingParameter


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class KontextTraining(Resource):
    @use_swagger_config(kontext_training_api_config)
    def post(self):
        """
        启动Kontext（Flux Kontext LoRA）的训练任务
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()
        parameter = None
        try:
            parameter = KontextTrainingParameter.from_dict(data)
            validated_parameter, validation_message = KontextTrainingParameter.validate(parameter)
            if not validated_parameter:
                return res(success=False, 
                          message=f"Training parameters validation failed: {validation_message}", 
                          code=400), 400

            task = KontextTrainingService().start_train(parameter)
            return res(
                data={"task_id": task.id}, 
                message=f"Kontext training task {task.id} started successfully."
            ) 

        except ValueError as e:
            logger.warning(f"start kontext training with parameter:{parameter} failed, error:", exc_info=e) 
            return res(success=False, 
                       message=f"Your training parameters were incorrect, please fix them. detail info:{str(e)}", code=400), 400
        except Exception as e:
            logger.warning(f"start kontext training with parameter:{parameter} failed, error:", exc_info=e) 
            return res(success=False, message="Server Internal Error, please contact the administrator", code=500), 500
