from flask import request
from flask_restful import Resource
from ..common.utils import use_swagger_config
from ..swagger.swagger_config import start_training
from ..model.training_paramter import TrainingParameter
from app.service.train import TrainingService


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class Training(Resource):
    @use_swagger_config(start_training)
    def post(self):
        """
        启动训练任务
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()

        parameter = TrainingParameter.from_dict(data)
        try:
            task = TrainingService().training(parameter)
            return {
                    'success': True,
                    'task_id': task.id,
                    'msg': f"task {task.id} started successfully."
                }, 200
        except ValueError as e:
            logger.warning(f"start training with parameter:{parameter} failed, error: {e}") 
            return {
                'success': False,
                'msg': str(e)
                }, 400
        except Exception as e:
            logger.warning(f"start training with parameter:{parameter} failed, error: {e}") 
            return {
                'success': False,
                'msg': str(e)
                }, 500

    




