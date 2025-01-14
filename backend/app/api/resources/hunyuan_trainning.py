from flask import request
from flask_restful import Resource
from app.service.hunyuan_train import HunyuanTrainingService
from task.task import Task
from ..common.utils import use_swagger_config, res
from ..swagger.swagger_config import huanyuan_training
from ..model.hunyuan_paramter import HunyuanTrainingParameter


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class HunyuanTraining(Resource):
    @use_swagger_config(huanyuan_training)
    def post(self):
        """
        启动混元训练任务
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()
        parameter = None
        try:
            parameter = HunyuanTrainingParameter.from_dict(data)
            
            valid, reson = HunyuanTrainingParameter.validate(parameter)
            if not valid:
                return res(success=False, message=reson, code=400), 400

            task = HunyuanTrainingService().start_train(parameter)
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