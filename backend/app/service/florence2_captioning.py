import torch
import os
from typing import List, Callable
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
from app.api.model.captioning_model import CaptioningModelInfo
from app.api.common.utils import write_caption_file

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)


def florence2_captioning(image_paths: List[str], output_dir: str, model_info :CaptioningModelInfo, update_status :Callable) -> List[dict]:
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
                success, cap_file_path = write_caption_file(image_path, output_dir, caption_text)
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