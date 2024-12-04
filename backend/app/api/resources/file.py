from flask_restful import Resource, reqparse
from ..schema.file_valid import file_args_valid
from ..common.utils import res


class File(Resource):
    def get(self):
        """
        获取存储中目录

        ---
        parameters:
          - name: parent_id
            in: query
            type: string
            required: true
            default: /
            description: 存储中目录
          - name: token
            in: query
            type: string
            required: true
            default: token
            description: 存储id

        responses:
          200:
            description: 返回目录信息
            schema:
              type: object
              properties:
                code:
                  type: integer
                  description: 返回状态码
                  example: 0
                msg:
                  type: string
                  description: 返回消息
                  example: "ok"
                data:
                  type: object
                  properties:
                    id:
                      type: string
                      description: 目录 ID
                      example: "/.config"
                    is_dir:
                      type: boolean
                      description: 是否为目录
                      example: true
                    name:
                      type: string
                      description: 目录名称
                      example: ".config"
                    path:
                      type: string
                      description: 目录路径
                      example: "/.config"
        """
        parse = reqparse.RequestParser()
        file_args_valid(parse)
        data = parse.parse_args()

        return res(success=True, data=data)
