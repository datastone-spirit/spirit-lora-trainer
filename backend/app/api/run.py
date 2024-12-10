from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from .resources.file import File
from .resources.upload import Upload, UploadProgress
from .resources.tagging import Tagging,ManualTagging
from .resources.generate_sh import GenerateSH
from .resources.start import StartTraining
from .resources.configuration import SaveConfig,GetConfig
from flasgger import Swagger

app = Flask(__name__)
Swagger(app)
CORS(app, resources=r"/*")
api = Api(app, prefix="/api")


api.add_resource(File, "/file")  # 获取目录结构
api.add_resource(Upload, "/upload")  # 上传文件的接口
api.add_resource(UploadProgress, "/upload_progress")  # 上传进度
api.add_resource(GenerateSH, "/training/gen_sh")  # 生成命令
api.add_resource(Tagging, "/training/tag")  # 打标数据集
api.add_resource(ManualTagging, "/training/tag_manual")  # 手动打标接口
api.add_resource(StartTraining, "/training/start")  # 启动训练
api.add_resource(SaveConfig, "/training/save_config") # 保存配置
api.add_resource(GetConfig, "/training/get_config") # 读取配置


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
