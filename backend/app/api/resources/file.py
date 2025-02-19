import os
import io
import mimetypes
from flask import request, send_file
from flask_restful import Resource
from ..common.utils import res, get_directory_structure, use_swagger_config, validate_training_data
from ..swagger.swagger_config import file_config, file_check_config, tag_dir_config,delete_file_config, preview_file_config
from utils.util import pathFormat, setup_logging, get_image_mime_type
from PIL import Image as PILImage
import tempfile

setup_logging()
import logging
logger = logging.getLogger(__name__)

class File(Resource):
    @use_swagger_config(file_config)
    def get(self):
        """
        获取存储中目录结构，支持懒加载
        """
        try:
           # 获取当前请求的域名
           url = request.host_url

           # 直接从 URL 查询参数获取数据
           path = request.args.get('path', '')

           # 处理路径前缀
           if path.startswith("local:///"):
               path = path.replace("local:///", "/")
           elif path.startswith("local://"):
               path = path.replace("local://", "/")


           full_path = pathFormat(path)
           # 检查路径是否存在
           # if not os.path.exists(full_path):
           #     return res(success=False, message=f"路径不存在: {full_path}")

           # 如果路径包含文件名（通过检查是否有扩展名）
           if os.path.isfile(full_path):
               full_path = os.path.dirname(full_path)  # 获取文件所在目录

           # 获取目录结构
           structure = get_directory_structure(full_path, url)
           return structure
        except Exception as e:
            logger.warning(f"获取目录结构失败:", exc_info=e)
            return res(success=False, message=f"获取目录结构失败: {str(e)}", code=400)
    
    def post(self):
        """
        提交一些数据到存储中
        """
        # full_path = pathFormat(path)
        # 获取请求体中的数据
        data = request.get_json()
        folder_name = data.get('name', '')  # 获取文件夹名

        path = request.args.get('path', '')
        full_path = os.path.join(pathFormat(path), folder_name)

        if os.path.exists(full_path):
            return res(success=False, message=f"文件夹 {folder_name} 已经存在: {full_path}", code=400)
        # 处理数据，执行相应的逻辑
        # 创建文件夹
        try:
            os.makedirs(full_path)
            return res(success=True, message=f"文件夹 {folder_name} 创建成功: {full_path}")
        except Exception as e:
            logger.warning("create folder failed:", exc_info=e)
            return res(success=False, message=f"创建文件夹失败: {str(e)}", code=500), 500

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

        if not check_data:
            return res(
                success=True,
                message="目录存在",
                data={"exists": True, "has_data": False}
            )
        
        valid, reason = validate_training_data(full_path)
        if not valid:
            return res(
                success=False,
                message=f"目录存在，但数据不合法: {reason}",
                data={"exists": True, "has_data": valid}
            )

        return res(
            success=True,
            message=f"目录存在，且:{reason}",
            data={"exists": exists, "has_data": valid}
        )

class HunyuanLoRAPathCheck(Resource):
    @use_swagger_config(file_check_config)
    def get(self):
        path = request.args.get("path", "")
        check_data = request.args.get("has_data", "false").lower() == "true"
        full_path = pathFormat(path)

        # 检查目录是否存在
        exists = os.path.exists(full_path)        
        if not exists:
            return res(
                success=False,
                message=f"路径不存在: {full_path}",
                data={"exists": False, "has_data": False}
            )
        
        if not os.path.isdir(full_path):
            return res(
                success=False,
                message=f"路径不是目录: {full_path}",
                data={"exists": True, "has_data": False}
            )
        # Check if directory is empty
        if len(os.listdir(full_path)) > 0:
            return res(
                success=False,
                message=f"目录不为空: {full_path}",
                data={"exists": True, "has_data": True}
            )

        return res(
            success=True,
            message="目录存在且为空",
            data={"exists": True, "has_data": False}
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
        获取指定目录中的图片文件和txt文件的相关信息，按名称关联  a.jpg 和 a.txt 是一组
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
                    if item.lower().endswith(('.png', '.jpg', '.jpeg', ".bmp", ".tiff", ".webp")):
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
                txt_path = txt_files.get(f"{base_name}")
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

            return sorted(image_txt_pairs, key=lambda x: x["image_name"])

        except Exception as e:
            return {"error": str(e)}
        
class DeleteFile(Resource):
    @use_swagger_config(delete_file_config)
    def delete(self):
        """
        删除文件
        """
        file_path = request.args.get("file_path", "")
        full_path = pathFormat(file_path)
        if not file_path:
            return res(success=False, message="文件路径未提供")

        # 检查文件是否存在
        if not os.path.isfile(full_path):
            return res(success=False, message=f"文件不存在: {file_path}")
        try:
            # 删除主文件
            os.remove(full_path)
            return res(success=True, message=f"文件已删除: {file_path}")
        except Exception as e:
            return res(success=False, message=f"删除文件失败: {str(e)}")
        

class Image(Resource):
    @use_swagger_config(preview_file_config)
    def get(self, image_path):
        """
        获取图片内容
        """
        full_path = '/' + image_path
        if not os.path.isfile('/' + full_path):
            return {"success": False, "message": f"文件不存在: {full_path}"}, 400
        
        mime_type = get_image_mime_type(full_path)
        if not mime_type or not mime_type.startswith("image/"):
            return {"success": False, "message": f"文件不是图片类型: {full_path}"}, 400

         # 检查是否需要压缩
        compress = request.args.get("compress", "true").lower() == "true"
        if not compress:
            try:
                return send_file(full_path, mimetype=mime_type)  # 根据实际类型修改 mimetype
            except Exception as e:
                return {"success": False, "message": f"无法返回图片: {str(e)}"}, 500


        thumbnail_size = (64, 64)  # 缩略图尺寸，可自定义
        # 生成缩略图
        try:
            with PILImage.open(full_path) as img:
                img_format = img.format  # 保留原始格式
                img.thumbnail(thumbnail_size)  # 创建缩略图
                    # 缓存缩略图到临时文件
                buf = io.BytesIO()
                img.save(buf, format=img_format)
                buf.seek(0)
                return send_file(buf, mimetype=mime_type)
        except Exception as e:
                return {"success": False, "message": f"图片压缩失败: {str(e)}"}, 500


