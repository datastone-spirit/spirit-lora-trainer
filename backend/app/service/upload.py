import os
import time
from typing import List, Union
from ..api.common.utils import res

class UploadService:
    # 定义允许的文件扩展名
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp", "txt", "mp4", "mov", "avi", "mkv", "flv", "wmv"}

    # 生成唯一的文件名，避免文件名重复
    def generate_unique_filename(self, filename, upload_path):
        """
        生成唯一的文件名，检查文件是否已存在，如果已存在，则加上数字后缀
        """
        filename_without_ext, ext = os.path.splitext(filename)
        counter = 1
        unique_filename = filename

        # 如果是txt文件，直接返回
        if ext == "txt":
            return unique_filename

        # 检查文件是否已存在，若已存在则加后缀
        while os.path.exists(os.path.join(upload_path, unique_filename)):
            unique_filename = f"{filename_without_ext}_{counter}{ext}"
            counter += 1

        return unique_filename
    
    # 检查文件是否是允许的图片类型
    def allowed_file(self, filename):
        return "." in filename and filename.rsplit(".", 1)[1].lower() in self.ALLOWED_EXTENSIONS

