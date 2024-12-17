import os
import json
from flask import jsonify
from flask_restful import Resource, Api, reqparse
from ..common.utils import use_swagger_config,res
from ..swagger.swagger_config import save_config_config,get_config_config
from ..schema.common_valid import save_config_args_valid,get_config_args_valid

# 配置保存目录
config_dir = "configs"
os.makedirs(config_dir, exist_ok=True)

class SaveConfig(Resource):
    @use_swagger_config(save_config_config)
    def post(self):
        """
        保存配置信息
        """
        # 解析请求参数
        parser = reqparse.RequestParser()
        save_config_args_valid(parser)
        args = parser.parse_args()

        config_name = args["config_name"]
        config_content = args["config_content"]

        try:
            # 尝试将配置内容解析为 JSON
            config_data = json.loads(config_content)
        except json.JSONDecodeError:
            return res(success=False, message="配置内容格式无效，请提供有效的 JSON 内容")
        
        # 配置文件路径
        config_file_path = os.path.join(config_dir, f"{config_name}.json")

        # 保存配置到文件
        try:
            with open(config_file_path, "w", encoding="utf-8") as config_file:
                json.dump(config_data, config_file, ensure_ascii=False, indent=4)

            return res(success=True, message="配置保存成功")
        except Exception as e:
            return res(success=False, message=f"配置保存失败: {str(e)}")
        
class GetConfig(Resource):
    @use_swagger_config(get_config_config)
    def get(self):
        """
        获取已保存的配置信息
        """
        # 解析请求参数
        parser = reqparse.RequestParser()
        get_config_args_valid(parser)
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
            
            return res(success=True, data=config_data)
        except Exception as e:

            return res(success=False, data=f"读取配置文件失败: {str(e)}")