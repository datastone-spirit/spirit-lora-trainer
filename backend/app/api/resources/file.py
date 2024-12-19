import os
from flask import request
from flask_restful import Resource
from ..common.utils import res, get_directory_structure, use_swagger_config
from ..swagger.swagger_config import file_config, file_check_config, tag_dir_config
from utils.util import pathFormat


class File(Resource):
    @use_swagger_config(file_config)
    def get(self):
        """
        获取存储中目录结构，支持懒加载
        """
        # 直接从 URL 查询参数获取数据
        parent_path = request.args.get('parent_path', '')
        is_dir = request.args.get('is_dir', 'true')  # 默认值 'true'，表示只返回目录

        full_path = pathFormat(parent_path)
        # 检查路径是否存在
        if not os.path.exists(full_path):
            return res(success=False, message=f"路径不存在: {full_path}")

        # 获取目录结构
        structure = get_directory_structure(full_path, is_dir)
        success = True
        if "error" in structure:
            success = False
        # 返回完整的目录和文件结构
        return res(success=success, data=structure)

class PathCheck(Resource):
    @use_swagger_config(file_check_config)
    def get(self):
        """
        检测目录是否存在以及是否有数据
        """
        # 获取请求参数
        path = request.args.get("path", "")
        check_data = request.args.get("has_data", "false").lower() == "true"

        # 格式化路径
        full_path = pathFormat(path)

        # 检查目录是否存在
        exists = os.path.exists(full_path)
        if not exists:
            return res(
                success=False, 
                message=f"路径不存在: {full_path}",
                data={"exists": False, "has_data": False}
            )

        # 检查目录是否有数据
        has_data = False
        if check_data and os.path.isdir(full_path):
            has_data = len(os.listdir(full_path)) > 0

        # 返回结果
        message = "目录存在"
        if check_data:
            message += f"且{'有' if has_data else '无'}数据"
        return res(
            success=True,
            message=message,
            data={"exists": exists, "has_data": has_data}
        )
    
class TagDirFile(Resource):
    @use_swagger_config(tag_dir_config)
    def get(self):
        """
        获取指定目录中的图片文件和txt文件的相关信息，按名称关联
        """
        # 直接从 URL 查询参数获取数据
        path = request.args.get('path', '')  # 获取路径参数

        if not path:
            return res(success=False, message="路径不能为空")

        full_path = pathFormat(path)
        
        # 获取图片文件和txt文件的信息
        file_info = self.get_image_and_txt_info(full_path)
        
        return res(success=True, data=file_info)
    
    def get_image_and_txt_info(self, directory):
        """
        获取指定目录中的图片文件和txt文件的相关信息，按名称关联  a.jpg 和 a_caption.txt 是一组
        :param directory: 要查询的目录路径
        :return: 包含图片路径、图片名称、txt路径、txt内容和txt文件名称的字典
        """
        try:
            # 获取目录中的所有文件
            items = os.listdir(directory)
            image_txt_pairs = []  # 用于存储图片和txt的配对信息

            # 需要分别存储图片和txt文件
            images = {}
            txt_files = {}

            for item in items:
                item_path = os.path.join(directory, item)
                
                if os.path.isfile(item_path):
                    # 查找图片文件，支持多种格式
                    if item.lower().endswith(('.png', '.jpg', '.jpeg')):
                        # 去掉文件扩展名后保存
                        base_name = os.path.splitext(item)[0]
                        images[base_name] = item_path

                    # 查找txt文件
                    elif item.lower().endswith('.txt'):
                        base_name = os.path.splitext(item)[0]
                        txt_files[base_name] = item_path
            # 对每个图片，检查是否有对应的txt文件
            for base_name, image_path in images.items():
                # 查找对应的txt文件
                txt_path = txt_files.get(f"{base_name}_caption")
                if txt_path:
                    try:
                        with open(txt_path, 'r', encoding='utf-8') as file:
                            txt_content = file.read()
                        image_txt_pairs.append({
                            "image_path": image_path,
                            "txt_path": txt_path,
                            "image_name": os.path.basename(image_path),
                            "txt_name": os.path.basename(txt_path),
                            "txt_content": txt_content
                        })
                    except Exception as e:
                        # 如果txt文件读取失败，记录错误信息
                        image_txt_pairs.append({
                            "image_path": image_path,
                            "txt_path": txt_path,
                            "image_name": os.path.basename(image_path),
                            "txt_name": os.path.basename(txt_path),
                            "txt_content": f"Error reading txt file: {str(e)}"
                        })
                else:
                    # 如果没有对应的txt文件，仍然返回图片信息，txt相关字段为空
                    image_txt_pairs.append({
                        "image_path": image_path,
                        "txt_path": "",
                        "image_name": os.path.basename(image_path),
                        "txt_name": "",
                        "txt_content": ""
                    })

            return image_txt_pairs

        except Exception as e:
            return {"error": str(e)}