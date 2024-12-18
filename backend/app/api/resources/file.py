import os
from flask import request
from flask_restful import Resource
from ..common.utils import res, get_directory_structure, use_swagger_config
from ..swagger.swagger_config import file_config, file_check_config
from utils.util import pathFormat


class File(Resource):
    @use_swagger_config(file_config)
    def get(self):
        """
        获取存储中目录结构，支持懒加载
        """
        # 直接从 URL 查询参数获取数据
        parent_path = request.args.get('parent_path', '')
        is_dir = request.args.get('is_dir', 'true')  # 默认值 'true'，表示只返回目录

        full_path = pathFormat(parent_path)
        # 检查路径是否存在
        if not os.path.exists(full_path):
            return res(success=False, message=f"路径不存在: {full_path}")

        # 获取目录结构
        structure = get_directory_structure(full_path, is_dir)
        success = True
        if "error" in structure:
            success = False
        # 返回完整的目录和文件结构
        return res(success=success, data=structure)

class PathCheck(Resource):
    @use_swagger_config(file_check_config)
    def get(self):
        """
        检测目录是否存在以及是否有数据
        """
        # 获取请求参数
        path = request.args.get("path", "")
        check_data = request.args.get("has_data", "false").lower() == "true"

        # 格式化路径
        full_path = pathFormat(path)

        # 检查目录是否存在
        exists = os.path.exists(full_path)
        if not exists:
            return res(
                success=False, 
                message=f"路径不存在: {full_path}",
                data={"exists": False, "has_data": False}
            )

        # 检查目录是否有数据
        has_data = False
        if check_data and os.path.isdir(full_path):
            has_data = len(os.listdir(full_path)) > 0

        # 返回结果
        message = "目录存在"
        if check_data:
            message += f"且{'有' if has_data else '无'}数据"
        return res(
            success=True,
            message=message,
            data={"exists": exists, "has_data": has_data}
        )