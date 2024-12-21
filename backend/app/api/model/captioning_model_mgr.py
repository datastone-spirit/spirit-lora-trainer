from typing import Optional, Dict, List
from dataclasses import dataclass
from .captioning_model import CaptioningModelInfo
from app.service.florence2_captioning import florence2_captioning
from app.service.joycaption2_captioning import joycaption2_captioning
from app.service.joycaption2_nf4_captioning import joycaption2_nf4_captioning


@dataclass
class CaptioningModelManager:
    models : Optional[Dict[str, CaptioningModelInfo]]

    @staticmethod
    def get_model_mgr() -> 'CaptioningModelManager':
        return CaptioningModelManager(models={
            "florence2": CaptioningModelInfo.from_dict("florence2", {
                "path": "models--multimodalart--Florence-2-large-no-flash-attn", 
                "name": "multimodalart/Florence-2-large-no-flash-attn",
                "cache_dir": "", 
                "captioning": florence2_captioning

            }),
            "joycaption2": CaptioningModelInfo.from_dict("joycaption2", {
                "path": ".", 
                "name": "fancyfeast/llama-joycaption-alpha-two-hf-llava",
                "cache_dir": "", 
                "captioning": joycaption2_captioning
            }),            
            "joycaption2_nf4": CaptioningModelInfo.from_dict("joycaption2_nf4", {
                "path": ".", 
                "name": "John6665/llama-joycaption-alpha-two-hf-llava-nf4",
                "cache_dir": "", 
                "captioning": joycaption2_nf4_captioning
            }),
        })
    
    def get_model(self, model_name: str) -> CaptioningModelInfo:
        model = self.models.get(model_name, None) 
        if model is None:
            raise ValueError(f"only support model name: {self.models.keys()}, but request model name is {model_name}")
        return model
    
    def keys(self) -> List[str]:
        return self.models.keys()




cap_model_mgr = CaptioningModelManager.get_model_mgr()