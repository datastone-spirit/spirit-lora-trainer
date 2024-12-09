import os
import time
from flask import request, jsonify, session, Response, stream_with_context
from werkzeug.utils import secure_filename
from flask_restful import Resource, reqparse
from datetime import datetime
from ..schema.upload_valid import validate_upload_args
from ..common.utils import res, allowed_file, use_swagger_config
from ..swagger.swagger_config import upload_config, upload_progress_config

# 定义允许的文件扩展名
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# 存储上传进度
UPLOAD_PROGRESS = {}


# 存储上传文件的临时信息
def get_upload_progress(upload_id):
    """获取上传任务的总进度"""
    if upload_id not in UPLOAD_PROGRESS:
        return {"progress": 0, "total_size": 0}

    files = UPLOAD_PROGRESS[upload_id]
    total_progress = 0
    total_size = 0

    for file in files:
        total_progress += file["progress"] * file["total_size"]
        total_size += file["total_size"]

    # 计算加权平均进度
    if total_size > 0:
        progress = (total_progress / total_size) if total_size else 0
    else:
        progress = 0

    return {"progress": int(progress), "total_size": total_size}


def update_upload_progress(upload_id, file_name, progress, total_size):
    """更新单个文件的上传进度"""
    if upload_id not in UPLOAD_PROGRESS:
        UPLOAD_PROGRESS[upload_id] = []

    # 查找文件是否已经在进度列表中
    file_info = next(
        (item for item in UPLOAD_PROGRESS[upload_id] if item["file_name"] == file_name),
        None,
    )

    if file_info:
        # 更新文件的进度
        file_info["progress"] = progress
        file_info["total_size"] = total_size
    else:
        # 新增文件进度
        UPLOAD_PROGRESS[upload_id].append(
            {"file_name": file_name, "progress": progress, "total_size": total_size}
        )


# 检查文件是否是允许的图片类型
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# 生成唯一的文件名，避免文件名重复
def generate_unique_filename(filename, upload_path):
    """
    生成唯一的文件名，检查文件是否已存在，如果已存在，则加上数字后缀
    """
    filename_without_ext, ext = os.path.splitext(filename)
    counter = 1
    unique_filename = filename

    # 检查文件是否已存在，若已存在则加后缀
    while os.path.exists(os.path.join(upload_path, unique_filename)):
        unique_filename = f"{filename_without_ext}_{counter}{ext}"
        counter += 1

    return unique_filename


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

        if not os.path.exists(upload_path):
            os.makedirs(upload_path)

        uploaded_files = []  # 存储上传文件的信息
        invalid_files = []  # 存储不符合条件的文件

        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = generate_unique_filename(
                    filename, upload_path
                )  # 获取唯一文件名
                upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                file_path = os.path.join(upload_path, unique_filename)

                # 获取文件的总大小
                total_size = len(file.read())
                update_upload_progress(
                    upload_id, unique_filename, 0, total_size
                )  # 初始化进度

                # 保存文件到指定目录
                if not os.path.exists(upload_path):
                    os.makedirs(upload_path)

                # 将文件信息添加到列表
                uploaded_files.append(
                    {
                        "filename": unique_filename,
                        "path": file_path,
                        "upload_time": upload_time,
                        "upload_id": upload_id,  # 使用传入的 upload_id
                    }
                )

                # 重置文件流位置
                file.seek(0)

                # 进行文件上传并实时更新进度
                with open(file_path, "wb") as f:
                    chunk_size = 1024 * 1024  # 每次写入1MB
                    bytes_written = 0
                    for chunk in iter(lambda: file.read(chunk_size), b""):
                        f.write(chunk)
                        bytes_written += len(chunk)
                        progress = int((bytes_written / total_size) * 100)
                        print(f"{get_upload_progress(upload_id)}")
                        update_upload_progress(
                            upload_id, unique_filename, progress, total_size
                        )

                        # 在每次写入时加上延迟，模拟上传过程
                        time.sleep(1)  # 延迟0.5秒，模拟上传延迟
            else:
                # 如果文件不是有效的图片格式，添加到 invalid_files
                invalid_files.append(file.filename)

            if invalid_files:
                # 如果有无效文件，返回错误信息并终止上传
                return res(
                    success=False,
                    message=f"以下文件类型不支持：{', '.join(invalid_files)}",
                )
        return res(success=True, data=uploaded_files)


class UploadProgress(Resource):
    """查询文件上传进度（返回EventStream）"""

    @use_swagger_config(upload_progress_config)
    def get(self):
        """获取文件上传进度"""
        upload_id = request.args.get("upload_id")
        if not upload_id:
            return res(success=False, msg="缺少 upload_id 参数")

        def generate_progress(upload_id):
            """通过 EventStream 实时推送上传进度"""
            while True:
                progress_info = get_upload_progress(upload_id)
                if progress_info["progress"] >= 100:
                    # 上传完成，推送最终进度并结束流
                    yield f"data: {str(progress_info)}\n\n"
                    break
                else:
                    # 上传中，推送当前进度
                    yield f"data: {str(progress_info)}\n\n"

        # 使用 Response 返回 EventStream 流式响应
        return Response(
            stream_with_context(generate_progress(upload_id)),
            mimetype="text/event-stream",
        )
