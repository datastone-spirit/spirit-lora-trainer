from flask import request
from flask_restful import Resource
from ..common.utils import use_swagger_config, res
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
        data = set_resolution(data)
        parameter = None
        try:
            parameter = TrainingParameter.from_dict(data)
            task = TrainingService().training(parameter)
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

    


def set_resolution(data):
    try:
        datasets = data.get('dataset').get('datasets')
        for i, _ in enumerate(datasets):
            resolution_str = str(datasets[i].get('resolution', '1024,1024'))
            resolution = resolution_str.split(',')
            if len(resolution) == 1:
                logger.warning(f"resolution {resolution} is invalid, set to {(int(resolution[0]), int(resolution[0]))}")
                datasets[i]['resolution'] = (int(resolution[0]), int(resolution[0]))
            elif len(resolution) >= 2:
                datasets[i]['resolution'] = (int(resolution[0]), int(resolution[1]))
            else:
                datasets[i]['resolution'] = (1024, 1024)
    except Exception as e:
        logger.warning(f"set resolution failed, error ", exc_info=e)
    finally:
        return data


