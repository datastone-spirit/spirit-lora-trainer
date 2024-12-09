from flask import jsonify
import torch
import os
from typing import List, Union
from flask_restful import Resource, reqparse
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
from ..common.utils import use_swagger_config
from ..swagger.swagger_config import tag_config
from ..schema.common_valid import tagging_valid


class Tagging(Resource):
    @use_swagger_config(tag_config)
    def post(self):
        """
        打标数据集
        """
        # 解析请求参数
        parser = reqparse.RequestParser()
        tagging_valid(parser)
        args = parser.parse_args()

        model_name = args["model_name"]
        image_path = args["image_path"]
        images = ["upload/image/220px-Thomas_Edison2.jpg", "upload/image/123123.jpg"]

        resule = self.run_captioning(images)

        return resule

    def run_captioning(self, images: List[Union[str, Image.Image]]) -> List[dict]:

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
        print(f"1111111111111111111111")
        results = []
        output_dir = "captions_output"
        os.makedirs(output_dir, exist_ok=True)  # 确保输出目录存在
        for i, img in enumerate(images):
            # 加载图片
            print(f"Using img: {img}")

            if isinstance(img, str):  # 如果是路径
                image = Image.open(img).convert("RGB")
            elif isinstance(img, Image.Image):  # 如果是 PIL 图片对象
                image = img
            else:
                raise ValueError(f"Unsupported image type: {type(img)}")
            print(f"222222")
            # 生成描述
            prompt = "<DETAILED_CAPTION>"
            inputs = processor(text=prompt, images=image, return_tensors="pt").to(
                device, torch_dtype
            )
            print(f"333333")
            generated_ids = model.generate(
                input_ids=inputs["input_ids"],
                pixel_values=inputs["pixel_values"],
                max_new_tokens=1024,
                num_beams=3,
            )
            print(f"444444")
            generated_text = processor.batch_decode(
                generated_ids, skip_special_tokens=False
            )[0]
            print(f"555555")
            parsed_answer = processor.post_process_generation(
                generated_text, task=prompt, image_size=(image.width, image.height)
            )
            caption_text = (
                parsed_answer["<DETAILED_CAPTION>"]
                .replace("The image shows ", "")
                .strip()
            )

            # 保存反推词到文件
            txt_file_path = os.path.join(output_dir, f"image_{i + 1}_caption.txt")
            print(f"txt_file_path------------: {txt_file_path}")
            with open(txt_file_path, "w", encoding="utf-8") as txt_file:
                txt_file.write(caption_text)

            # 收集结果
            results.append(
                {"image": image, "caption": caption_text, "txt_path": txt_file_path}
            )

            print(f"Processed image {i + 1}: Caption saved to {txt_file_path}")

        # 清理模型和缓存
        model.to("cpu")
        del model
        del processor
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        print("run_captioning completed.")
        return results
