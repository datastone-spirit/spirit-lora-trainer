import os
from typing import List, Tuple

from app.api.model.captioning_model_mgr import cap_model_mgr
from task.manager import task_decorator
from task.task import Task
from app.api.common.utils import res

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class CaptioningService:
    def manual_captioning(self, image_path: str, caption_text: str) -> dict:
        try:
            # 提取路径中的文件名和基础名称
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            directory_path = os.path.dirname(image_path)  # 获取文件所在的目录

            # 确保输出目录存在
            os.makedirs(directory_path, exist_ok=True)

            # 保存反推词到文件，文件名与图片名一致
            txt_file_path = os.path.join(directory_path, f"{base_name}.txt")

            with open(txt_file_path, "w", encoding="utf-8") as txt_file:
                txt_file.write(caption_text)

            # 返回结果
            return res(data = {
                    "image_path": image_path,
                    "caption": caption_text,
                    "txt_path": txt_file_path
                })
        except Exception as e:
            # 异常处理可以记录日志等
            return res(success = False,message = str(e))

        
    
    def load_images_from_directory(self,directory: str, extensions=None):
        """
        从目录中加载所有图片文件路径。

        参数:
        - directory (str): 图片所在的目录。
        - extensions (set): 支持的文件扩展名，默认支持常见图片格式。

        返回:
        - List[str]: 图片文件路径列表。
        """
        if extensions is None:
            extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}

        image_paths = []
        for file in os.listdir(directory):  # 仅遍历当前目录
            file_path = os.path.join(directory, file)
            if os.path.isfile(file_path) and os.path.splitext(file)[1].lower() in extensions:
                image_paths.append(file_path)  # 仅保存路径

        if len(image_paths) == 0:
            logger.warning(f"No images found in directory: {directory}")
            raise ValueError(f"No images found in directory: {directory}, valid image extensions is : {extensions}")

        return image_paths
    
    def run_captioning(self, image_paths: List[str], output_dir: str, model_name: str="florence2", 
                       class_token=None, 
                       prompt_type: str = None,
                       global_prompt: str = None,
                       is_append: bool = False) -> List[dict]:
        cap_model = cap_model_mgr.get_model(model_name)
        if cap_model is None:
            raise ValueError(f"only support model name: {cap_model_mgr.keys()}, but request model name is {model_name}")

        if not os.path.exists(cap_model.cache_dir) or \
            not os.path.exists(cap_model.path) :
            raise Exception(f"model path {cap_model.cache_dir} not exists")

        return self._captioning(image_paths, output_dir, class_token, cap_model, prompt_type, 
                                global_prompt=global_prompt,
                                is_append=is_append)

    @task_decorator
    def _captioning(self, image_paths: List[str], output_dir: str, class_token: str, model, 
                    prompt_type: str = None,
                    global_prompt: str = None,
                    is_append: bool = False) -> List[dict]:
        return Task.wrap_captioning_task(image_paths, output_dir, class_token, model, prompt_type, global_prompt, is_append)


