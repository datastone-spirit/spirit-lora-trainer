import os
from typing import List, Union
import torch
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
from ..api.common.utils import res

class TaggingService:
    def manual_captioning(self, image_path: str, caption_text: str) -> dict:
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        
        # 输出目录
        output_dir = "captions_output"
        os.makedirs(output_dir, exist_ok=True)  # 确保输出目录存在

        # 保存反推词到文件，文件名与图片名一致
        txt_file_path = os.path.join(output_dir, f"{base_name}_caption.txt")
        
        with open(txt_file_path, "w", encoding="utf-8") as txt_file:
            txt_file.write(caption_text)

        # 返回结果
        return res(success=True,data={
            "image_path": image_path,
            "caption": caption_text,
            "txt_path": txt_file_path
        })
    
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

        return image_paths
    
    def run_captioning(self, image_paths: List[str]) -> List[dict]:

        print("Starting run_captioning...")

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}")

        torch_dtype = torch.float16
        model = AutoModelForCausalLM.from_pretrained(
            "multimodalart/Florence-2-large-no-flash-attn",
            torch_dtype=torch_dtype,
            trust_remote_code=True,
            cache_dir="./models/florence2",
        ).to(device)
        processor = AutoProcessor.from_pretrained(
            "multimodalart/Florence-2-large-no-flash-attn",
            trust_remote_code=True,
            cache_dir="./models/florence2",
        )

        results = []
        output_dir = "captions_output"
        os.makedirs(output_dir, exist_ok=True)  # 确保输出目录存在

        for image_path in image_paths:
            print(f"Processing image: {image_path}")
            
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
            txt_file_path = os.path.join(output_dir, f"{base_name}_caption.txt")
            with open(txt_file_path, "w", encoding="utf-8") as txt_file:
                txt_file.write(caption_text)

            # 收集结果
            results.append(
                {"image_path": image_path, "caption": caption_text, "txt_path": txt_file_path}
            )

            print(f"Processed image: {image_path}, Caption saved to {txt_file_path}")

        # 清理模型和缓存
        model.to("cpu")
        del model
        del processor
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        print("run_captioning completed.")
        return results