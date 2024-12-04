from flask import jsonify, request
from flask_restful import Resource, reqparse

default_params = {
    "mode_name": "flux",
    "steps": "100",
    "output_dir": "/root/spirit/output",
}


class GenerateSH(Resource):
    def post(self):
        """
        生成执行的 Shell 命令

        ---
        parameters:
          - name: params
            in: body
            required: true
            type: object

        responses:
          200:
            description: 返回生成的 shell 命令
            schema:
              type: object
              properties:
                command:
                  type: string
                  description: 生成的 shell 命令
                  example: "sh /usr/local/bin/process_data.sh --mode default --verbose false"
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()

        # 合并默认参数和请求参数
        final_params = {**default_params, **data}

        # 构建 shell 命令
        command = f"sh {final_params['path']}/{final_params['script_name']}"

        return jsonify({"command": command})
