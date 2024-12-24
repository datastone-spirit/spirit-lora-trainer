from flask import Flask, send_from_directory,Response, request, redirect
import requests
from flask_cors import CORS
from flask_restful import Api
import argparse
import logging
import sys
import os
from .resources.file import File,PathCheck, TagDirFile, DeleteFile, Image
from .resources.upload import Upload
from .resources.tagging import Tagging,ManualTagging
from .resources.training import Training
from .resources.gpu_log import GpuLog
from .resources.current_task import CurrentTask
from .resources.task_history import TaskHistory
from flasgger import Swagger
from utils.util import getprojectpath


logging.basicConfig(level=logging.INFO, handlers=[logging.StreamHandler(sys.stdout)])

app = Flask(__name__, static_folder=os.path.join(getprojectpath(), 'dist'), static_url_path='/admin')
Swagger(app)
CORS(app, resources=r"/*")
api = Api(app, prefix="/api")

# add port argument
parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=5002)
parser.add_argument("--host", type=str, default="0.0.0.0")
parser.add_argument("--tb_port", type=int, default=6006) # tensorboard-port
args = parser.parse_args()

api.add_resource(File, "/file")  # 获取目录结构
api.add_resource(PathCheck, "/path_check")  # 检测目录是否存在
api.add_resource(TagDirFile, "/tag_dir_file")  # 获取目录中图片和txt文件
api.add_resource(DeleteFile, "/delete_file")  # 删除文件
api.add_resource(Image, "/image/<path:image_path>")  # 获取图片
api.add_resource(Upload, "/upload")  # 上传文件的接口
api.add_resource(Tagging, "/training/tag")  # 打标数据集
api.add_resource(ManualTagging, "/training/tag_manual")  # 手动打标接口
api.add_resource(Training, "/training/start")  # 启动训练
api.add_resource(GpuLog, "/training/gpu_log") # gpu功耗、显存信息
api.add_resource(CurrentTask, "/tasks/current") #
api.add_resource(TaskHistory, "/tasks/history") # task历史

# 处理静态文件（如 .js, .css 等）
@app.route('/admin/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(getprojectpath(), 'dist', 'assets'), filename)

# 匹配 /admin 和所有 /admin 开头的路径，返回 index.html
@app.route('/admin', defaults={'path': ''})
@app.route('/admin/<path:path>')
def serve_admin(path):
    return send_from_directory(app.static_folder, 'index.html')  # 返回 SPA 的入口文件

@app.route('/tensorboard')
def tensorboard():
    # 返回 TensorBoard 首页
    return redirect(f"http://127.0.0.1:{args.tb_port}")

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

logging.info(f"args.port is {args.port}, args.host is {args.host}")

if __name__ == "__main__":
    app.run(host=args.host, port=args.port)
    