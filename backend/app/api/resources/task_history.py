
from flask import request
from flask_restful import Resource
from app.service.task import TaskService
from ..common.utils import use_swagger_config
from ..swagger.swagger_config import task_history, task_run_log

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class TaskHistory(Resource):
    
    @use_swagger_config(task_history)
    def get(self):
        try :
            task_id =  request.args.get('task_id')
            show_config =  True if request.args.get('show_config', "false").upper() == "TRUE" else False
            return TaskService().get(task_id, show_config), 200
        except FileNotFoundError as e:
            return {
                'success': False,
                'msg': str(e)
            }, 404
        except Exception as e:
            logger.error(f"get current task failed: {e}", exc_info=True)
            return {
                'success': False,
                'msg': f"Internal server error: {e}"
            }, 500

class TaskRunLog(Resource):
    @use_swagger_config(task_run_log)
    def get(self):
        try:
            task_id = request.args.get('task_id')
            return TaskService().get_log(task_id=task_id)
        except FileNotFoundError as e:
            return {
                'success': False,
                'msg': str(e)
            }, 404
        except Exception as e:
            logger.error(f"get current task failed: {e}", exc_info=True)
            return {
                'success': False,
                'msg': f"Internal server error: {e}"
            }, 500