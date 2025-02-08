import torch.nn as nn
import torch# Define Image Adapter Model

import os
import gc
import logging
from PIL import Image
from pathlib import Path
import torch
from transformers import (
    AutoModel,
    AutoProcessor,
    AutoConfig,
    AutoTokenizer,
    AutoModelForCausalLM,
)
from torch import nn
from torchvision import transforms as T
from typing import List, Callable
import torchvision.transforms.functional as TVF

from app.api.model.captioning_model import CaptioningModelInfo
from app.api.common.utils import write_caption_file

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)


def get_prompt(type: str="Descriptive", tone: str="casual", length: str="medium-length") -> str:
    CAPTION_TYPE_MAP = {
        "Descriptive": "Write a {length} descriptive caption for this image in a {tone} tone.", #描述性提示词
        "Training Prompt": "Write a {length} stable diffusion prompt for this image.", # 用于SD训练型提示词
        "MidJourney":  "Write a {length} MidJourney prompt for this image.",  # MidJourney式提示词
        "Booru tag list": "Write a {length} list of Booru tags for this image.", # Booru Tag 样式列表提示词
        "Booru-like tag list": "Write a {length} list of Booru-like tags for this image.", # Booru Like Tag 样式列表提示词
        "Art Critic": "Analyze this image like an art critic would with information about its composition, style, symbolism, the use of color, light, any artistic movement it might belong to, etc. Keep it {length}.", # 艺术评论家式提示词
        "Product Listing": "Write a {length} caption for this image as though it were a product listing.", # 产品列表式提示词
        "Social Media Post": "Write a {length} caption for this image as if it were being used for a social media post.", # 社交媒体式提示词
    }
    caption_type = CAPTION_TYPE_MAP.get(type, None)
    return caption_type.format(length=length, tone=tone) if caption_type is not None \
        else f"Write a {length} descriptive caption for this image in a {tone} tone."

class ImageAdapter(nn.Module):
    def __init__(
        self,
        input_features: int,
        output_features: int,
        ln1: bool,
        pos_emb: bool,
        num_image_tokens: int,
        deep_extract: bool,
    ):
        super().__init__()
        self.deep_extract = deep_extract

        if self.deep_extract:
            input_features = input_features * 5

        self.linear1 = nn.Linear(input_features, output_features)
        self.activation = nn.GELU()
        self.linear2 = nn.Linear(output_features, output_features)
        self.ln1 = nn.Identity() if not ln1 else nn.LayerNorm(input_features)
        self.pos_emb = (
            None
            if not pos_emb
            else nn.Parameter(torch.zeros(num_image_tokens, input_features))
        )

        # Other tokens (<|image_start|>, <|image_end|>, <|eot_id|>)
        self.other_tokens = nn.Embedding(3, output_features)
        self.other_tokens.weight.data.normal_(mean=0.0, std=0.02)

    def forward(self, vision_outputs: torch.Tensor):
        if self.deep_extract:
            x = torch.concat(
                (
                    vision_outputs[-2],
                    vision_outputs[3],
                    vision_outputs[7],
                    vision_outputs[13],
                    vision_outputs[20],
                ),
                dim=-1,
            )
        else:
            x = vision_outputs[-2]

        x = self.ln1(x)
        if self.pos_emb is not None:
            x = x + self.pos_emb
        x = self.linear1(x)
        x = self.activation(x)
        x = self.linear2(x)

        other_tokens = self.other_tokens(
            torch.tensor([0, 1], device=self.other_tokens.weight.device).expand(
                x.shape[0], -1
            )
        )
        x = torch.cat((other_tokens[:, 0:1], x, other_tokens[:, 1:2]), dim=1)

        return x

class JoyCaptioner:

    def __init__(self, model_info: CaptioningModelInfo):
        self.device ="cuda" if torch.cuda.is_available() else "cpu"

        if not os.path.exists(model_info.cache_dir):
            raise Exception("adapter model directory joy-caption-alpha-two not exists")

        # Load CLIP Model
        logger.info("Loading CLIP siglip-so400m-patch14-384")
        if not os.path.exists(model_info.clip_cache_dir):
            raise Exception("clip model directory not exists")

        self.clip_processor = AutoProcessor.from_pretrained(model_info.clip_cache_dir)
        config = AutoConfig.from_pretrained(model_info.clip_cache_dir)
        self.clip_model = AutoModel.from_config(config).vision_model


        logger.info("Loading VLM's custom vision model")
        vlm_cache_dir = os.path.join(model_info.cache_dir, "cgrkzexw-599808")
        vlm_model_file = os.path.join(vlm_cache_dir, "clip_model.pt")
        if not os.path.exists(vlm_model_file):
            raise Exception(f"clip model file {vlm_model_file} not exists")
        checkpoint = torch.load(vlm_model_file, map_location='cpu')
        checkpoint = {k.replace("_orig_mod.module.", ""): v for k, v in checkpoint.items()}
        self.clip_model.load_state_dict(checkpoint)
        self.clip_model.eval()
        self.clip_model.requires_grad_(False)
        self.clip_model.to(self.device)
        del checkpoint


        # Load Tokenizer and LLM
        logger.info("Loading tokenizer and text model")
        tokenizer_path = os.path.join(vlm_cache_dir, "text_model")
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_path, use_fast=True)

        logger.info("load llm model")
        if not os.path.exists(model_info.llm_cache_dir):
            raise Exception(f"llm model {vlm_cache_dir} directory not exists")
        self.llm_model = AutoModelForCausalLM.from_pretrained(
            model_info.llm_cache_dir,
            torch_dtype=torch.bfloat16,
        )
        self.llm_model.load_adapter(tokenizer_path)
        self.llm_model.eval()

        logger.info("Loading image adapter")
        self.image_adapter = ImageAdapter(
            self.clip_model.config.hidden_size,
            self.llm_model.config.hidden_size,
            False,
            False,
            38,
            False,
        )
        image_adapter_model = os.path.join(vlm_cache_dir, "image_adapter.pt")
        self.image_adapter.load_state_dict(torch.load(image_adapter_model))
        self.image_adapter.eval()
        self.image_adapter.to(self.device)
        self.transform = T.ToPILImage()

    @torch.no_grad()
    def generate(self, item, type="Descriptive", 
                 tone="casual", length="medium-length", 
                 system_prompt="You are a helpful image captioner, never reject the prompt."):

        input_image = item
        image = input_image.resize((384, 384), Image.LANCZOS)

        pixel_values = TVF.pil_to_tensor(image).unsqueeze(0) / 255.0
        pixel_values = TVF.normalize(pixel_values, [0.5], [0.5])
        pixel_values = pixel_values.to(self.device)

        with torch.amp.autocast_mode.autocast(self.device, enabled=True):
            vision_outputs = self.clip_model(pixel_values=pixel_values, output_hidden_states=True)
            embedded_images = self.image_adapter(vision_outputs.hidden_states).to(self.device)

        prompt_str = (get_prompt(type, tone, length))
        convo = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt_str},
        ]

        logger.info(f"captioning prompt is:{convo}")

        convo_string = self.tokenizer.apply_chat_template(convo, tokenize=False, add_generation_prompt=True)
        convo_tokens = self.tokenizer.encode(
                convo_string,
                return_tensors="pt",
                add_special_tokens=False,
                truncation=False,
        ).squeeze(0)

        prompt_tokens = self.tokenizer.encode(
                prompt_str, 
                return_tensors="pt", 
                add_special_tokens=False, 
                truncation=False
        ).squeeze(0)

        eot_id_indices = (
                (convo_tokens == self.tokenizer.convert_tokens_to_ids("<|eot_id|>"))
                .nonzero(as_tuple=True)[0]
                .tolist()
        )
            
        preamble_len = eot_id_indices[1] - prompt_tokens.shape[0]

        convo_embeds = self.llm_model.model.embed_tokens(
                convo_tokens.unsqueeze(0).to(self.device)
        )
            
        input_embeds = torch.cat(
            [
                    convo_embeds[:, :preamble_len],
                    embedded_images.to(dtype=convo_embeds.dtype),
                    convo_embeds[:, preamble_len:],
            ],
            dim=1,
        ).to(self.device)
            
        input_ids = torch.cat(
            [
                    convo_tokens[:preamble_len].unsqueeze(0),
                    torch.zeros((1, embedded_images.shape[1]), dtype=torch.long),
                    convo_tokens[preamble_len:].unsqueeze(0),
            ],
            dim=1,
        ).to(self.device)

        attention_mask = torch.ones_like(input_ids)

        generate_ids = self.llm_model.generate(
                input_ids,
                inputs_embeds=input_embeds,
                attention_mask=attention_mask,
                max_new_tokens=300,
                do_sample=True,
                suppress_tokens=None,
        )
            
        generate_ids = generate_ids[:, input_ids.shape[1] :]
        if generate_ids[0][-1] == self.tokenizer.eos_token_id or generate_ids[0][-1] == self.tokenizer.convert_tokens_to_ids("<|eot_id|>"):
            generate_ids = generate_ids[:, :-1]
  
        caption = self.tokenizer.batch_decode(
                generate_ids,
                skip_special_tokens=True,
                clean_up_tokenization_spaces=False,
        )[0].strip()

        return (caption,)

    def unload_model(self):
        try:
            del self.clip_model
            del self.llm_model
            del self.image_adapter
            del self.tokenizer
            del self.clip_processor
            torch.cuda.empty_cache()
        except Exception as e:
            logger.info("unload model failed, ignored", exc_info=e)

@torch.no_grad()
def joycaption2_llm_captioning(image_paths: List[str], output_dir: str, model_info :CaptioningModelInfo, 
                               update_status :Callable, class_token=None, prompt_type: str = "Descriptive",
                               global_prompt :str = None,
                               is_append :bool = False) -> List[dict]:
    joy_captioner = None
    try:
        joy_captioner = JoyCaptioner(model_info) 
        for i, image_path in enumerate(image_paths):
            caption_text = ""
            cap_file_path = ""
            success = False
            try:
                logger.info(f"Processing image: {image_path}")
                image = Image.open(image_path).convert("RGB")
                caption_text = joy_captioner.generate(image, prompt_type)[0]
                if global_prompt is not None:
                    caption_text = f"{global_prompt}, {caption_text}"
                success, cap_file_path = write_caption_file(image_path, output_dir, caption_text, class_token=class_token, is_append=is_append)
            except Exception as e:
                logger.warning(f"Error processing image: {image_path}", exc_info=e)
            finally:
                update_status(i + 1, len(image_paths), cap_file_path, caption_text, success)
    finally:
        if joy_captioner is not None:
            joy_captioner.unload_model()
            del joy_captioner
        gc.collect()
        torch.cuda.empty_cache()