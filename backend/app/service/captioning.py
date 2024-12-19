import os
from typing import List, Callable
import torch
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
from app.api.model.captioning_model import cap_model_mgr, CaptioningModelInfo
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
    
    def run_captioning(self, image_paths: List[str], output_dir: str, model_name: str="florence2") -> List[dict]:
        cap_model = cap_model_mgr.get_model(model_name)
        if cap_model is None:
            raise ValueError(f"only support model name: {cap_model_mgr.keys()}, but request model name is {model_name}")

        if not os.path.exists(cap_model.cache_dir) or \
            not os.path.exists(cap_model.path) :
            raise Exception(f"model path {cap_model.path} not exists")

        return self._captioning(image_paths, output_dir, cap_model)

    @task_decorator
    def _captioning(self, image_paths: List[str], output_dir: str, model :CaptioningModelInfo):
        return Task.wrap_captioning_task(image_paths, output_dir, model, captioning)

def captioning(image_paths: List[str], output_dir: str, model_info :CaptioningModelInfo, update_status :Callable) -> List[dict]:
    """
    """
    torch_dtype = torch.float16
    logger.info(f"Starting run_captioning...with {model_info}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Using device: {device}")
    model = AutoModelForCausalLM.from_pretrained(
        model_info.name,
        torch_dtype=torch_dtype,
        trust_remote_code=True,
        cache_dir=model_info.cache_dir
    ).to(device)

    processor = AutoProcessor.from_pretrained(
        model_info.name,
        trust_remote_code=True,
        cache_dir=model_info.cache_dir
    )
    
    try:
        os.makedirs(output_dir, exist_ok=True)  # 确保输出目录存在

        for i, image_path in enumerate(image_paths):
            caption_text = ""
            cap_file_path = ""
            success = False
            try:
                logger.info(f"Processing image: {image_path}")
                # 加载图片
                image = Image.open(image_path).convert("RGB")
                # 生成描述
                prompt = "<DETAILED_CAPTION>"
                inputs = processor(text=prompt, images=image, return_tensors="pt").to(
                    device, torch_dtype
                )
                generated_ids = model.generate(
                    input_ids=inputs["input_ids"],
                    pixel_values=inputs["pixel_values"],
                    max_new_tokens=1024,
                    num_beams=3,
                )
                generated_text = processor.batch_decode(
                    generated_ids, skip_special_tokens=False
                )[0]
                parsed_answer = processor.post_process_generation(
                    generated_text, task=prompt, image_size=(image.width, image.height)
                )
                caption_text = (
                    parsed_answer["<DETAILED_CAPTION>"]
                    .replace("The image shows ", "")
                    .strip()
                )

                # 保存反推词到文件，与图片文件名一致
                base_name = os.path.splitext(os.path.basename(image_path))[0]
                cap_file_path = os.path.join(output_dir, f"{base_name}.txt")
                with open(cap_file_path, "w", encoding="utf-8") as txt_file:
                    txt_file.write(caption_text)
                success = True
            except Exception as e:
                # 收集结果
                logger.warning("Failed to process image: {image_path}", exc_info=e)
            finally:
                update_status(i, image_path, caption_text, cap_file_path, success)
                logger.info(f"Processed image: {image_path}, Caption saved to {cap_file_path}")
    # 清理模型和缓存
    except Exception as e:
        logger.error("run_captioning failed.", exc_info=e)
        raise e
    finally:
        model.to("cpu")
        del model
        del processor
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    logger.info("run_captioning completed.")
