import pathlib
import logging
import os
import sys


def getmodelpath() -> str:
     return  os.path.join(getprojectpath() , "models")


def getprojectpath() -> str:
     return str(pathlib.Path(__file__).parent.parent)

def pathFormat(path: str) -> str:
     # 处理路径，确保拼接的是绝对路径
     full_path = path
     if not os.path.isabs(path):
          full_path = os.path.normpath(os.path.join(getprojectpath(), path))
     return full_path

def setup_logging(args=None, log_level=None, reset=False):
     if logging.root.handlers:
          if reset:
            # remove all handlers
               for handler in logging.root.handlers[:]:
                    logging.root.removeHandler(handler)
          else:
               return
    # log_level can be set by the caller or by the args, the caller has priority. If not set, use INFO
     if log_level is None:
        log_level = "INFO"
     log_level = getattr(logging, log_level)

     handler = logging.StreamHandler(sys.stdout)  # same as print
     handler.propagate = False

     formatter = logging.Formatter(
        fmt='%(asctime)s | %(levelname)-8s | %(module)-16s | %(message)-180s',
        datefmt='%Y-%m-%d %H:%M:%S'
     )
     handler.setFormatter(formatter)
     logging.root.setLevel(log_level)
     logging.root.addHandler(handler)


def resolveProjectPath(input_path: str) -> str:
     # 判断是否为绝对路径
     if os.path.isabs(input_path):
          return input_path

     # 拼接项目路径与相对路径
     project_path = getprojectpath()
     return os.path.abspath(os.path.join(project_path, input_path))
