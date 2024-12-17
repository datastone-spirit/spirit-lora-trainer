import os
import time
from typing import List, Union
import torch
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
from ..api.common.utils import res

class UploadService:
    # 定义允许的文件扩展名
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
    
    # 存储上传进度
    UPLOAD_PROGRESS = {}

    # 生成唯一的文件名，避免文件名重复
    def generate_unique_filename(self, filename, upload_path):
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
    
    # 检查文件是否是允许的图片类型
    def allowed_file(self, filename):
        return "." in filename and filename.rsplit(".", 1)[1].lower() in self.ALLOWED_EXTENSIONS

    # 存储上传文件的临时信息
    def get_upload_progress(self, upload_id):
        """获取上传任务的总进度"""
        if upload_id not in self.UPLOAD_PROGRESS:
            return {"progress": 0}

        # 返回整个上传任务的进度
        return {
            "progress": int(self.UPLOAD_PROGRESS[upload_id]),
        }
    
    def update_upload_progress(self, upload_id, progress):
        self.UPLOAD_PROGRESS[upload_id] = progress

    def generate_progress(self, upload_id):
            """通过 EventStream 实时推送上传进度"""
            while True:
                progress_info = self.get_upload_progress(upload_id)
                if progress_info["progress"] >= 100:
                    # 上传完成，推送最终进度并结束流
                    yield f"data: {str(progress_info)}\n\n"
                    self.UPLOAD_PROGRESS[upload_id] = 0
                    break
                else:
                    # 上传中，推送当前进度
                    yield f"data: {str(progress_info)}\n\n"
                
                # 等待1秒，避免频繁获取，给后台上传任务时间更新进度
                time.sleep(1)
