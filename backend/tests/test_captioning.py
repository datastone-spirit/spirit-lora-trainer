from app.api.model.captioning_model_mgr import cap_model_mgr
from utils.util import getmodelpath
import os

def test_captioning_model_mgr():
    model_info = cap_model_mgr.get_model("florence2")

    assert model_info is not None
    assert model_info.name == "multimodalart/Florence-2-large-no-flash-attn"
    path = os.path.join(getmodelpath(), "florence2", "models--multimodalart--Florence-2-large-no-flash-attn")
    assert model_info.path == path
    cache_dir = os.path.join(getmodelpath(), "florence2")
    assert model_info.cache_dir == cache_dir
