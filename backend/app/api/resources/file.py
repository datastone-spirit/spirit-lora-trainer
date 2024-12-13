import os
from flask_restful import Resource, reqparse
from ..schema.common_valid import file_args_valid
from ..common.utils import res, get_directory_structure, use_swagger_config
from ..swagger.swagger_config import file_config


class File(Resource):
    @use_swagger_config(file_config)
    def get(self):
        """
        获取存储中目录结构，支持懒加载
        """
        parse = reqparse.RequestParser()
        file_args_valid(parse)
        data = parse.parse_args()

        full_path = os.path.join(data["parent_id"], data["path"])
        structure = get_directory_structure(full_path)

        return res(success=True, data=structure)
