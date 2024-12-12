import pathlib


def getmodelpath() -> str:
     return  getprojectpath() + "/models"


def getprojectpath() -> str:
     return str(pathlib.Path(__file__).parent.parent)