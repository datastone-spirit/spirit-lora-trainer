from flask import request
from flask_restful import Resource
from app.service.qwenimage_train import QwenImageTrainingService
from app.api.common.utils import use_swagger_config, res
from app.api.swagger.swagger_config import qwenimage_training_api_config
from app.api.model.qwenimage_parameter import QWenImageParameter
from utils.util import setup_logging

setup_logging()
import logging
logger = logging.getLogger(__name__)


class QwenImageTraining(Resource):
    @use_swagger_config(qwenimage_training_api_config)
    def post(self):
        """
        启动QwenImage训练任务
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()
        parameter = None
        try:
            parameter = QWenImageParameter.from_dict(data)
            parameter = QWenImageParameter.validate(parameter)
            task = QwenImageTrainingService().start_train(parameter)
            return res(
                data={"task_id": task.id},
                message=f"QwenImage training task {task.id} started successfully."
            )
        except ValueError as e:
            logger.warning(f"start QwenImage training with parameter:{parameter} failed, error:", exc_info=e)
            return res(success=False,
                      message=f"Training parameters validation failed: {str(e)}",
                      code=400), 400
        except Exception as e:
            logger.error(f"start QwenImage training failed with error:", exc_info=e)
            return res(success=False, 
                      message=f"Failed to start training: {str(e)}",
                      code=500), 500
