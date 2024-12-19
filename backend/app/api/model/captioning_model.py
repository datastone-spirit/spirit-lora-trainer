import os
from typing import List, Optional, Dict
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
    cache_dir : str

    @staticmethod
    def from_dict(key: str, dikt: dict) -> 'CaptioningModelInfo':
        obj = dacite.from_dict(data_class=CaptioningModelInfo, data=dikt)
        obj.cache_dir = os.path.join(getmodelpath(), key)
        obj.path = os.path.join(os.path.join(getmodelpath(), key),  obj.path)
        return obj

@dataclass
class CaptioningModelManager:
    models : Optional[Dict[str, CaptioningModelInfo]]

    @staticmethod
    def get_model_mgr() -> 'CaptioningModelManager':
        return CaptioningModelManager(models={
            "florence2": CaptioningModelInfo.from_dict("florence2", {
                "path": "models--multimodalart--Florence-2-large-no-flash-attn", 
                "name": "multimodalart/Florence-2-large-no-flash-attn",
                "cache_dir": ""
            })
        })
    
    def get_model(self, model_name: str) -> CaptioningModelInfo:
        model = self.models.get(model_name, None) 
        if model is None:
            raise ValueError(f"only support model name: {self.models.keys()}, but request model name is {model_name}")
        return model
    
    def keys(self) -> List[str]:
        return self.models.keys()


cap_model_mgr = CaptioningModelManager.get_model_mgr()