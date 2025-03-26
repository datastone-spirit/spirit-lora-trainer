from flask import request
from flask_restful import Resource
from app.service.wan_train import WanTrainingService
from app.api.common.utils import use_swagger_config, res
from app.api.swagger.swagger_config import wan_training_api_config
from app.api.model.wan_paramter import WanTrainingParameter


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class WanTraining(Resource):
    @use_swagger_config(wan_training_api_config)
    def post(self):
        """
        启动Wan（万象）的训练任务
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()
        parameter = None
        try:
            parameter = WanTrainingParameter.from_dict(data)
            
            parameter = WanTrainingParameter.validate(parameter)

            task = WanTrainingService().start_train(parameter)
            return res(
                data={"task_id": task.id}, 
                message=f"training task {task.id} started successfully."
            ) 

        except ValueError as e:
            logger.warning(f"start training with parameter:{parameter} failed, error:", exc_info=e) 
            return res(success=False, 
                       message=f"Your training parameters were incorrect, please fix them. detail info:{str(e)}", code=400), 400
        except Exception as e:
            logger.warning(f"start training with parameter:{parameter} failed, error:", exc_info=e) 
            return res(success=False, message="Server Interal Error, please contact the administrator", code=500), 500