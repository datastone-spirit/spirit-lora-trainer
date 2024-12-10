import os
import json
import time
import subprocess
from flask import jsonify, request
from flask_restful import Resource, reqparse
import time
from ..common.utils import use_swagger_config,res
from ..swagger.swagger_config import start_training_config
from ..schema.common_valid import start_args_valid

config_dir = "configs"

# 假设你有一个训练模型的类，用于执行训练任务
class TrainingModel:
    def start_training(self, config_data):
        # 模拟启动训练任务（这里根据配置内容可以调整训练参数）
        print(f"Starting training with config: {config_data}")
        time.sleep(5)  # 假设训练过程需要 5 秒
        return True  # 假设训练成功


class StartTraining(Resource):
    @use_swagger_config(start_training_config)
    def post(self):
        """
        启动训练任务
        """
        # 解析请求参数
        parser = reqparse.RequestParser()
        start_args_valid(parser)
        args = parser.parse_args()

        config_name = args["config_name"]
        config_file_path = os.path.join(config_dir, f"{config_name}.json")

        # 检查配置文件是否存在
        if not os.path.exists(config_file_path):
            return res(success=False, message="配置文件不存在")

        try:
            # 读取配置文件
            with open(config_file_path, "r", encoding="utf-8") as config_file:
                config_data = json.load(config_file)
        except Exception as e:
            return res(success=False, message=f"读取配置文件失败: {str(e)}")

        # 启动训练
        training_model = TrainingModel()
        training_success = training_model.start_training(config_data)

        if training_success:
            return res(success=True, message="训练任务已启动")
        else:
            return res(success=False, message="训练启动失败")