from flask import jsonify
import os
from flasgger import swag_from


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


def get_directory_structure(directory):
    """返回当前目录层级的文件和目录结构"""
    try:
        items = os.listdir(directory)  # 获取指定目录下的所有项（文件和目录）
        dirs = []
        files = []

        for item in items:
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path):
                dirs.append(
                    {
                        "value": item_path,  # 子目录的 id 可以使用目录的路径作为标识
                        "label": item,  # 显示在树形结构中的名称
                        "isLeaf": False,  # 目录肯定不是叶子节点
                    }
                )
            elif os.path.isfile(item_path):
                files.append(
                    {
                        "value": item_path,
                        "label": item,
                        "isLeaf": True,
                    }
                )

        return {"directories": dirs, "files": files}

    except Exception as e:
        return {"error": str(e)}


# 装饰器函数，用于将 Swagger 配置应用到资源方法
def use_swagger_config(swagger_config=None):
    def decorator(func):
        # 如果没有传递参数，则使用默认配置
        return swag_from(swagger_config)(func)

    return decorator
