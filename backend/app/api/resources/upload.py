import os
import time
from flask import request, jsonify, session, Response, stream_with_context
from werkzeug.utils import secure_filename
from flask_restful import Resource, reqparse
from datetime import datetime
from ..schema.upload_valid import validate_upload_args
from ..common.utils import res, use_swagger_config
from ..swagger.swagger_config import upload_config
from app.service.upload import UploadService
from utils.util import pathFormat

class Upload(Resource):
    @use_swagger_config(upload_config)
    def post(self):
        """上传图片, 支持同时上传多个图片"""
        # 校验参数
        args, valid = validate_upload_args()
        if not valid:
            return args, 400

        files = args["files"]
        upload_path = args["upload_path"]
        upload_id = args["upload_id"]
        full_path = pathFormat(upload_path)
        if not os.path.exists(full_path):
            os.makedirs(full_path)

        uploaded_files = []  # 存储上传文件的信息
        invalid_files = []  # 存储不符合条件的文件

        # 重置文件流位置
        for f in files:
            f.seek(0)

        for file in files:
            if file and UploadService().allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = UploadService().generate_unique_filename(
                    filename, full_path
                )  # 获取唯一文件名
                upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                file_path = os.path.join(full_path, unique_filename)

                # 保存文件到指定目录
                if not os.path.exists(full_path):
                    os.makedirs(full_path)

                # 将文件信息添加到列表
                uploaded_files.append(
                    {
                        "filename": unique_filename,
                        "path": file_path,
                        "upload_time": upload_time,
                        "upload_id": upload_id,  # 使用传入的 upload_id
                    }
                )

                # 进行文件上传并实时更新进度
                with open(file_path, "wb") as f:
                    chunk_size = 1024 * 1024  # 每次写入1MB
                    for chunk in iter(lambda: file.read(chunk_size), b""):
                        f.write(chunk)

                        # 在每次写入时加上延迟，模拟上传过程
                        # time.sleep(3)  # 延迟0.5秒，模拟上传延迟
            else:
                invalid_files.append(file.filename)

            if invalid_files:
                return res(
                    success=False,
                    message=f"以下文件类型不支持：{', '.join(invalid_files)}",
                )
        return res(success=True, data=uploaded_files)

        
