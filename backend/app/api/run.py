from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from .resources.file import File
from .resources.upload import Upload
from .resources.marking import Marking
from .resources.generate_sh import GenerateSH
from .resources.execute import ExecuteCommand
from flasgger import Swagger

app = Flask(__name__)
Swagger(app)
CORS(app, resources=r"/*")
api = Api(app, prefix="/api")


api.add_resource(File, "/file")  # 获取目录结构
api.add_resource(Upload, "/upload")  # 上传文件的接口
api.add_resource(Marking, "/marking")  # 打标
api.add_resource(GenerateSH, "/generate_sh")  # 生成命令
api.add_resource(ExecuteCommand, "/execute")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
