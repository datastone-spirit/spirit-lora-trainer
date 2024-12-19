from flask import Flask
from flask_cors import CORS
from flask_restful import Api
import argparse
import logging
import sys
from .resources.file import File,PathCheck, TagDirFile
from .resources.upload import Upload
from .resources.tagging import Tagging,ManualTagging
from .resources.training import Training
from .resources.gpu_log import GpuLog
from .resources.current_task import CurrentTask
from flasgger import Swagger


logging.basicConfig(level=logging.INFO, handlers=[logging.StreamHandler(sys.stdout)])

app = Flask(__name__)
Swagger(app)
CORS(app, resources=r"/*")
api = Api(app, prefix="/api")

api.add_resource(File, "/file")  # 获取目录结构
api.add_resource(PathCheck, "/path_check")  # 检测目录是否存在
api.add_resource(TagDirFile, "/tag_dir_file")  # 获取目录中图片和txt文件
api.add_resource(Upload, "/upload")  # 上传文件的接口
api.add_resource(Tagging, "/training/tag")  # 打标数据集
api.add_resource(ManualTagging, "/training/tag_manual")  # 手动打标接口
api.add_resource(Training, "/training/start")  # 启动训练
api.add_resource(GpuLog, "/training/gpu_log") # gpu功耗、显存信息
api.add_resource(CurrentTask, "/tasks/current") # gpu功耗、显存信息

# add port argument
parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=5002)
parser.add_argument("--host", type=str, default="0.0.0.0")
args = parser.parse_args()

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

logging.info(f"args.port is {args.port}, args.host is {args.host}")

if __name__ == "__main__":
    app.run(host=args.host, port=args.port)
