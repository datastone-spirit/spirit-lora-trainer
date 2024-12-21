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
    cache_dir : str
    captioning: Optional[Callable]

    @staticmethod
    def from_dict(key: str, dikt: dict) -> 'CaptioningModelInfo':
        obj = dacite.from_dict(data_class=CaptioningModelInfo, data=dikt)
        obj.cache_dir = os.path.join(getmodelpath(), key)
        if obj.path != ".":
            obj.path = os.path.join(os.path.join(getmodelpath(), key),  obj.path)
        return obj
