from flask import jsonify


# 公共 response 方法
def res(data=None, message="Ok", success=True, code=200):
    return jsonify(
        {
            "success": success,
            "message": message,
            "data": data,
        },
        code,
    )


def allowed_file(filename, app):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
