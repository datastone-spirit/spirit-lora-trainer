import pathlib
import logging
import os
import mimetypes
import sys
import re
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

def parse_kohya_stdout(stdout, detail: dict) -> None:
    """_summary_

    Args:
        stdout (_type_): _description_

need to parse the following information, include number of train images, number of reg images, number of batches per epoch, number of epochs, batch size per device, gradient accumulation steps, total optimization steps
running training / 学習開始
num train images * repeats / 学習画像の数×繰り返し回数: 10
num reg images / 正則化画像の数: 0
num batches per epoch / 1epochのバッチ数: 10
num epochs / epoch数: 10
batch size per device / バッチサイズ: 1
gradient accumulation steps / 勾配を合計するステップ数 = 1
total optimization steps / 学習ステップ数: 100
    """
    pattern = {
         "num_train_images": r"num train images \* repeats .*?: (\d+)",
         "num_reg_images": r"num reg images .*?: (\d+)",
         "num_batches_per_epoch": r"num batches per epoch .*?: (\d+)",
         "num_epochs": r"num epochs .*?: (\d+)",
         "batch_size_per_device": r"batch size per device .*?: (\d+)",
         "gradient_accumulation_steps": r"gradient accumulation steps .*?=? (\d+)",
         "total_optimization_steps": r"total optimization steps .*?: (\d+)"
     }
     
    for key, regex in pattern.items():
        match = re.search(regex, stdout)
        if match:
            detail[key] = int(match.group(1))

def parse_kohya_progress_line(line: str, detail: dict):
     """Parse elements from progress bar output
     Examples:
        >>> parse_progress_line("steps: 100%|██████████| 40/40 [00:42<00:00,  1.07s/it, avr_loss=0.145]")
        {
            'progress': 100,
            'current': 40,
            'total': 40,
            'elapsed': '00:42',
            'remaining': '00:00',
            'speed': 1.07,
            'loss': 0.145
        }
    """
     if not ('|' in line and '%' in line and 'steps' in line and '/' in line ):
          return
            
     patterns = {
          'steps': r'\|?\s*(\d+)/(\d+)',
          'time': r'\[(.*?)(?=<)<(.*?)(?=,)',  # Using lookahead to exclude < and ,
          'speed': r'([\d.]+)s/it',
          'loss': r'avr_loss=([\d.]+)'
     }
        
     for key, pattern in patterns.items():
          match = re.search(pattern, line)
          if match:
               if key == 'steps' and detail.get('total') is None:
                   detail['total'] = int(match.group(2))
               elif key == 'time':
                   detail['elapsed'] = match.group(1)
                   detail['remaining'] = match.group(2)
               elif key == 'speed':
                   detail[key] = float(match.group(1))