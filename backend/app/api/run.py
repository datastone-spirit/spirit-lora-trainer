from flask import Flask, send_from_directory,Response, request
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
api.add_resource(CurrentTask, "/tasks/current") # gpu功耗、显存信息
api.add_resource(TaskHistory, "/tasks/history") # gpu功耗、显存信息



# 处理静态文件（如 .js, .css 等）
@app.route('/admin/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(getprojectpath(), 'dist', 'assets'), filename)

# 匹配 /admin 和所有 /admin 开头的路径，返回 index.html
@app.route('/admin', defaults={'path': ''})
@app.route('/admin/<path:path>')
def serve_admin(path):
    return send_from_directory(app.static_folder, 'index.html')  # 返回 SPA 的入口文件

# tensorboard 反向代理
@app.route('/tensorboard/<path:subpath>', methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
def proxy_tensorboard(subpath):
    """
    反向代理 TensorBoard 服务
    """
    base_url = request.host.split(':')[0]  # 获取域名部分
    # 构造目标 URL
    target_url = f'{base_url}:{args.tb_port}'
    target_url = f"http://127.0.0.1:6006/{subpath}"  # 添加 http://

    # 根据原始请求构造代理请求
    method = request.method
    headers = {key: value for key, value in request.headers if key.lower() != 'host'}
    data = request.get_data()
    params = request.args

    # 发起代理请求
    resp = requests.request(method, target_url, headers=headers, data=data, params=params, stream=True)

    # 处理 HTML 内容，替换相对路径为目标服务路径
    if 'text/html' in resp.headers.get('Content-Type', ''):
        content = resp.content.decode("utf-8")
        # 替换所有以 "/" 开头的相对路径为目标服务路径
        content = content.replace('="/', f'="http://127.0.0.1:6006/')
        content = content.replace("='/", f"='http://127.0.0.1:6006/")
        return Response(content, resp.status_code, resp.headers)

    # 转发响应
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = {key: value for key, value in resp.headers.items() if key.lower() not in excluded_headers}

    return Response(resp.content, resp.status_code, headers)

@app.route('/tensorboard', methods=["GET"])
def tensorboard_root():
    """
    返回 TensorBoard 根路径的重定向
    """
    return proxy_tensorboard("")


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

logging.info(f"args.port is {args.port}, args.host is {args.host}")

if __name__ == "__main__":
    app.run(host=args.host, port=args.port)
    