import os
import torch
import torch.amp
import torchvision.transforms.functional as TVF
from PIL import Image
from typing import List, Callable
from transformers import AutoProcessor, LlavaForConditionalGeneration
from app.api.common.utils import write_caption_file
from app.api.model.captioning_model import CaptioningModelInfo

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)


PROMPT = "Write a long descriptive caption for this image in a formal tone."

def joycaption2_captioning(image_paths: List[str], output_dir: str, model_info :CaptioningModelInfo, update_status :Callable) -> List[dict]:
    # Load JoyCaption
    # bfloat16 is the native dtype of the LLM used in JoyCaption (Llama 3.1)
    # device_map=0 loads the model# into the first GPU
    torch_dtype = torch.float16
    logger.info(f"Starting run_captioning...with {model_info}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Using device: {device}")

    processor = AutoProcessor.from_pretrained(model_info.cache_dir)
    llava_model = LlavaForConditionalGeneration.from_pretrained(model_info.cache_dir, torch_dtype="bfloat16", device_map=0, force_download=False)
    llava_model.eval()

    os.makedirs(output_dir, exist_ok=True)  # 确保输出目录存在
    with torch.no_grad():
        for i, image_path in enumerate(image_paths):
            caption_text = ""
            cap_file_path = ""
            success = False
            try:
                caption_text = captioning_text(image_path, llava_model, processor, device, llava_model.vision_tower.vision_model.embeddings.patch_embedding.weight.dtype) 
                success, cap_file_path = write_caption_file(image_path, output_dir, caption_text)
            except Exception as e:
                logger.warning(f"Error processing image: {image_path}", exc_info=e)
                break
            finally:
                update_status(i, len(image_paths), cap_file_path, caption_text, success)
    



def captioning_text(image_path: str, llava_model, processor, device: str, vision_dtype=torch.bfloat16):
    # Load and preprocess image
    # Normally you would use the Processor here, but the image module's processor
    # has some buggy behavior and a simple resize in Pillow yields higher quality results
    image = Image.open(image_path)
    # if image.size != (384, 384):
    #     image = image.resize((384, 384), Image.LANCZOS)
    # image = image.convert("RGB")
    # pixel_values = TVF.pil_to_tensor(image)    
   
    # # Normalize the image
    # pixel_values = pixel_values / 255.0
    # pixel_values = TVF.normalize(pixel_values, [0.5], [0.5])
    # pixel_values = pixel_values.to(vision_dtype).unsqueeze(0)
   
    # Build the conversation
    convo = [
        {
            "role": "system",
            "content": "You are a helpful image captioner.",
        },
        {
            "role": "user",
            "content": PROMPT,
        },
    ]
   
    # Format the conversation
    convo_string = processor.apply_chat_template(convo, tokenize=False, add_generation_prompt=True)
    inputs = processor(text=[convo_string], images=[image], return_tensors="pt").to('cuda')
    inputs['pixel_values'] = inputs['pixel_values'].to(torch.bfloat16)
       
    # Generate the caption
    generate_ids = llava_model.generate(**inputs,
                                        max_new_tokens=300, 
                                        do_sample=True, 
                                        suppress_tokens=None, 
                                        use_cache=True,
                                        temperature=0.6,
                                        top_k=None,
                                        top_p=0.9,
                                    )[0]
   
    # Trim off the prompt
    generate_ids = generate_ids[inputs['input_ids'].shape[1]:]

    # Decode the caption
    caption = processor.tokenizer.decode(generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)
    caption = caption.strip()
    logger.info(caption)
    return caption