import pathlib


def getmodelpath() -> str:
     return str(pathlib.Path(__file__).parent.parent) + "/models"