import os
from typing import List, Optional, Dict, Callable
from dataclasses import dataclass
from ..common.utils import getmodelpath
import dacite
from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

@dataclass
class CaptioningModelInfo:
    path : str
    name : str
    cache_dir : str #models/joy-caption-alpha-two/cgrkzexw-599808
    captioning: Optional[Callable]
    llm_cache_dir : str = "" #models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit
    clip_cache_dir: str = "" #models/siglip-so400m-patch14-384

    @staticmethod
    def from_dict(key: str, dikt: dict) -> 'CaptioningModelInfo':
        obj = dacite.from_dict(data_class=CaptioningModelInfo, data=dikt)

        if not os.path.isabs(obj.cache_dir):
            obj.cache_dir = os.path.join(getmodelpath(), obj.cache_dir)
        
        if not is_empty_str(obj.llm_cache_dir) and not os.path.isabs(obj.llm_cache_dir):
            obj.llm_cache_dir = os.path.join(getmodelpath(), obj.llm_cache_dir)
        
        if not is_empty_str(obj.clip_cache_dir) and not os.path.isabs(obj.clip_cache_dir):
            obj.clip_cache_dir = os.path.join(getmodelpath(), obj.clip_cache_dir)

        obj.cache_dir = os.path.join(getmodelpath(), key)
        if obj.path != ".":
            obj.path = os.path.join(os.path.join(getmodelpath(), key),  obj.path)
        
        logger.info(f"model_info is {obj}")
        return obj
    
def is_empty_str(s: str) -> bool:
    return not s or s.isspace()
