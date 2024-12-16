import os
from flask import request
from flask_restful import Resource
from ..common.utils import res, get_directory_structure, use_swagger_config
from ..swagger.swagger_config import file_config


class File(Resource):
    @use_swagger_config(file_config)
    def get(self):
        """
        获取存储中目录结构，支持懒加载
        """
        # 直接从 URL 查询参数获取数据
        parent_id = request.args.get('parent_id', '')
        path = request.args.get('path', '/')

        # 参数验证
        if not parent_id:
            return res(success=False, message="parent_id is required")

        if not isinstance(path, str) or not path:
            return res(success=False, message="path must be a non-empty string")

        full_path = os.path.join(parent_id, path)
        structure = get_directory_structure(full_path)

        return res(success=True, data=structure)
