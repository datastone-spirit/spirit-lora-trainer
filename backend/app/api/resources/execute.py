import subprocess
from flask import jsonify, request
from flask_restful import Resource, reqparse
import time


class ExecuteCommand(Resource):
    def post(self):
        """
        执行 Shell 命令并返回日志信息

        ---
        parameters:
          - name: command
            in: body
            required: true
            description: 要执行的 Shell 命令
            type: string

        responses:
          200:
            description: 返回命令的执行日志
            schema:
              type: object
              properties:
                logs:
                  type: array
                  items:
                    type: object
                    properties:
                      timestamp:
                        type: string
                        description: 日志时间戳
                        example: "2024-12-04T16:45:00"
                      log:
                        type: string
                        description: 日志内容
                        example: "drwxr-xr-x  2 user user 4096 Dec 4 16:45 mydir"
        """
        # 解析请求中的 JSON 数据
        data = request.get_json()

        if not data or "command" not in data:
            return jsonify({"message": "Command is required"}), 400

        command = data["command"]

        try:
            # 执行命令并捕获输出
            process = subprocess.Popen(
                command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            stdout, stderr = process.communicate()

            # 解码输出
            stdout = stdout.decode("utf-8").strip()
            stderr = stderr.decode("utf-8").strip()

            # 函数来生成带时间戳的日志条目
            def generate_log_entries(log_text):
                log_entries = []
                for line in log_text.split("\n"):
                    if line.strip():  # 如果行不为空
                        timestamp = time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime())
                        log_entries.append(
                            {"timestamp": timestamp, "log": line.strip()}
                        )
                return log_entries

            # 返回标准输出和错误输出的日志信息
            logs = []
            if stdout:
                logs.extend(generate_log_entries(stdout))
            if stderr:
                logs.extend(generate_log_entries(stderr))

            return jsonify({"logs": logs})

        except Exception as e:
            return jsonify({"message": str(e)}), 500
