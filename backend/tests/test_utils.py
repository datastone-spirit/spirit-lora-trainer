
from utils.util import getmodelpath
import pathlib


def test_model_path():
    assert getmodelpath() == str(pathlib.Path("./models").absolute())