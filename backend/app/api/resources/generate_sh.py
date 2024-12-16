from flask import jsonify, request
from flask_restful import Resource
from dataclasses import dataclass, field
from ..common.utils import res, get_directory_structure, use_swagger_config
from ..swagger.swagger_config import generate_sh_config
from ..model.training_paramter import TrainingParameter
from app.service.train import TrainingService

default_params = {
    "mode_name": "flux",
    "steps": "100",
    "output_dir": "/root/spirit/output",
}


class GenerateSH(Resource):
    @use_swagger_config(generate_sh_config)
    def post(self):
        """
        生成执行命令
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()

        parameter = TrainingParameter.from_dict(data)

        TrainingService().training(parameter)

        return res(data='taskid')
    




