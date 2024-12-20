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
        # print(f"data ---- {data}")

        data = set_resolution(data)

        parameter = TrainingParameter.from_dict(data)
        try:
            task = TrainingService().training(parameter)
            return {
                    'success': True,
                    'task_id': task.id,
                    'msg': f"task {task.id} started successfully."
                }, 200
        except ValueError as e:
            logger.warning(f"start training with parameter:{parameter} failed, error:", exc_info=e) 
            return {
                'success': False,
                'msg': str(e)
                }, 400
        except Exception as e:
            logger.warning(f"start training with parameter:{parameter} failed, error:", exc_info=e) 
            return {
                'success': False,
                'msg': str(e)
                }, 500

    


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


