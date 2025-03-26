import pathlib
import logging
import os
import mimetypes
import sys
from typing import Tuple

# Register common image MIME types
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/jpeg", ".jpeg")
mimetypes.add_type("image/jpeg", ".jpg")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("image/gif", ".gif")
mimetypes.add_type("image/bmp", ".bmp")
mimetypes.add_type("image/tiff", ".tiff")
mimetypes.add_type("image/tif", ".tif")

def is_blank (args: str):
    return not (args and args.strip())

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


def caculate_image_steps(images :Tuple[(str, int)]) -> int:
     total_steps = 0;
     extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".tif", ".gif"}
     for item in images:
          if not os.path.exists(item[0]):
               continue
          for file in os.listdir(item[0]):
              file_path = os.path.join(item[0], file)
              if os.path.isfile(file_path) and os.path.splitext(file)[1].lower() in extensions:
                    total_steps +=1
          total_steps *= item[1]
     return total_steps

def get_image_mime_type(file_path: str) -> str:
    """
    Returns the MIME type for an image file.
    Falls back to a common type based on file extension if mimetypes.guess_type returns None.
    """
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".webp":
            mime_type = "image/webp"
        elif ext in [".jpg", ".jpeg"]:
            mime_type = "image/jpeg"
        elif ext == ".png":
            mime_type = "image/png"
        elif ext == ".gif":
            mime_type = "image/gif"
        elif ext == ".bmp":
            mime_type = "image/bmp"
        elif ext in [".tiff", ".tif"]:
            mime_type = "image/tiff"
        else:
            mime_type = "application/octet-stream"
    return mime_type