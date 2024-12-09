from flask import request


def validate_upload_args():
    """校验上传接口的参数"""
    # 校验文件字段
    files = request.files.getlist("files")
    upload_path = request.args.get("upload_path")
    upload_id = request.args.get("upload_id")
    valid_files = [
        file for file in files if file.filename.strip()
    ]  # 过滤掉空文件名的文件

    if not valid_files:
        return {"code": 400, "msg": "请上传文件"}, False

    if not upload_path:
        return {"code": 400, "msg": "缺少必需参数 upload_path"}, False
    if not upload_id:
        return {"code": 400, "msg": "缺少必需参数 upload_id"}, False

    return {
        "upload_path": upload_path,
        "upload_id": upload_id,
        "files": request.files.getlist("files"),  # 获取多个文件
    }, True
