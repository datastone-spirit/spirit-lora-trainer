import os
from datetime import datetime
from flask_restful import Resource, reqparse, request
from ..common.utils import res, get_directory_structure, use_swagger_config
from ..swagger.swagger_config import gpu_log_config
from app.service.train import TrainingService

class GpuLog(Resource):

    @use_swagger_config(gpu_log_config)
    def get(self):
        """
        获取 GPU 数据信息。
        """
        try:
            # 获取 GPU 数据
            gpu_info = TrainingService().get_gpu_info()

            if "error" in gpu_info:
                return res(success=False,message=gpu_info["error"])

            return res(data=gpu_info)

        except Exception as e:
            return res(success=False,message=str(e))
