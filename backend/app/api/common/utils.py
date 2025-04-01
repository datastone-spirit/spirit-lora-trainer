import os
from flasgger import swag_from
from dataclasses import asdict, fields
from app.api.model.training_paramter import TrainingConfig, TrainingParameter, Dataset, Subset
from typing import List, Tuple, Any
from utils.util import getmodelpath, getprojectpath
from enum import Enum
import tempfile
import toml
import mimetypes

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class StateError(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message

    def __str__(self):
        return self.message
    
# 公共 response 方法
def res(data=None, message="Ok", success=True, code=200):
    return {
            "success": success,
            "message": message,
            "data": data,
            "code": code
        }


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def is_flux_sampling(config: TrainingConfig) -> bool:
    if config.sample_every_n_steps is None:
        return False

    if config.sample_every_n_steps >= 10 and config.sample_prompts is not None and config.sample_prompts != "":
        return True
    return False

def get_directory_structure(directory, url=""):
    """
        返回当前目录层级的文件和目录结构
        :param directory: 要扫描的目录路径
        :param type: 返回的结构类型，index 表示返回文件和目录，subfolders 表示只返回目录
        :param url: 当前请求的域名
    """
    try:
        items = sorted(os.listdir(directory), key=lambda x: (not os.path.isdir(os.path.join(directory, x)), x))  # 获取指定目录下的所有项（文件和目录），并将目录放在前面
        result = []  # 存放最终的结果

        for item in items:
            try:
                item_path = os.path.join(directory, item)
                item_stat = os.stat(item_path)
                # logger.info(f"item_stat-------------------------- is {item_stat}")
                item_info = {
                    "basename": os.path.basename(item_path),
                    "extension": os.path.splitext(item_path)[1],
                    "extra_metadata": [],
                    "last_modified": int(item_stat.st_mtime),
                    "path": f"{item_path}",
                    "type": "dir" if os.path.isdir(item_path) else "file",
                    "visibility": "public",
                }
                if os.path.isdir(item_path):
                    result.append(item_info)
                elif os.path.isfile(item_path):
                    item_info["file_size"] = item_stat.st_size
                    item_info["mime_type"] = mimetypes.guess_type(item_path)[0]
                    if item_info["extension"].lower() in {".png", ".jpg", ".jpeg", ".gif"}:
                        item_info["url"] = f"{url}api/image{item_path}"
                    result.append(item_info)
            except Exception as e:
                logger.warning(f"get directory structure failed, error:{str(e)}")
                continue
        else:
            return {
                "storages": ["local"],
                "adapter": "local",
                "dirname": directory,
                "files": result
            }

    except Exception as e:
        logger.warning(f"get directory structure failed, error:", exc_info=e)
        return {"error": str(e)}


# 装饰器函数，用于将 Swagger 配置应用到资源方法
def use_swagger_config(swagger_config=None):
    def decorator(func):
        # 如果没有传递参数，则使用默认配置
        return swag_from(swagger_config)(func)

    return decorator


def config2args(parameter :TrainingConfig) -> 'List[str]':
    args = []
    for key, value in parameter.__dict__.items():
        if value is not None:
            if isinstance(value, bool):
                if value:
                    args.append(f'--{key}') 
            elif isinstance(value, str):
                args.append(f'--{key} "{value}"')
            else:
                args.append(f'--{key} {value}')
    return args

def config2args2(parameter :TrainingConfig) -> 'List[str]':
    args = []
    for key, value in parameter.__dict__.items():
        if value is not None:
            if isinstance(value, bool):
                if value:
                    args.append(f'--{key}') 
            elif isinstance(value, str):
                args.append(f'--{key}')
                args.append(f'"{value}"')
            else:
                args.append(f'--{key}')
                args.append(f'{value}')
    return args

def force_float_fields(config: Any):
    """
    Iterates all float fields in a dataclass and converts integer values to float.
    """
    for f in fields(config):
        # Check if the field type is float
        if f.type == float:
            val = getattr(config, f.name)
            # If the field's value is an integer, convert it to float
            if isinstance(val, int):
                setattr(config, f.name, float(val)) 
   

def validate_training_data(image_dir: str, caption_ext: str = ".txt") -> 'Tuple[bool, str]':
    if not os.path.isdir(image_dir):
        return False, f"{image_dir} is not a valid directory"

    valid_data_extensions = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".gif", ".tif", 
                              "mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv", ".mpg", ".mpeg"}
    valid_images = []
    valid_captions = []

    for file_name in os.listdir(image_dir):
        file_path = os.path.join(image_dir, file_name)
        if os.path.isfile(file_path):
            file = os.path.splitext(file_name)
            if len(file) < 2:
                logger.warning(f"ignore file {file_name} which hasn't extension")
                continue

            file_ext = file[1].lower()
            if file_ext in valid_data_extensions:
                valid_images.append(file_name)
                caption_file = file[0] + caption_ext
                caption_path = os.path.join(image_dir, caption_file)
                if os.path.isfile(caption_path):
                    valid_captions.append(caption_file)

    if len(valid_images) < 1 or len(valid_captions) < 1:
        return False, f"No valid images (or videos) found in the directory {image_dir}"

    if len(valid_images) != len(valid_captions):
        logger.warning(f"Mismatch between images (or videos):{len(valid_images)} and caption files {len(valid_captions)}")
        return True, f"Mismatch between images (or videos) {len(valid_images)} and caption files {len(valid_captions)}"

    return True, "OK" 

def validate_subsets(subsets: List[Subset], captioning_ext: str = ".txt") -> 'Tuple[bool, str]':
    if subsets is None or len(subsets) == 0 :
        return False, "subsets is required"

    for idx in range(len(subsets)):
        if subsets[idx].class_tokens is None:
            return False, "class_tokens is required"

        if subsets[idx].image_dir is None or subsets[idx].image_dir == "":
            return False, "image_dir is required"

        if os.path.exists(subsets[idx].image_dir) and not os.path.isdir(subsets[idx].image_dir):
            return False, f"image_dir {subsets[idx].image_dir} of subsets must be a directory"
        
        valid, reason = validate_training_data(subsets[idx].image_dir, captioning_ext)
        if not valid :
            return valid, reason

        if subsets[idx].num_repeats is None or subsets[idx].num_repeats <= 0:
            logger.warning("num_repeats is not set, set to 1")
            subsets[idx].num_repeats = 1
    return True, "Ok"

def validate_datasets(parameter: TrainingParameter, datasets :List[Dataset]) -> 'Tuple[bool, str]':
    if datasets is None or len(datasets) == 0:
        return False, "datasets is required"

    for idx in range(len(datasets)):
        if datasets[idx].batch_size is None or datasets[idx].batch_size <= 0:
            logger.warning("batch_size is not set, set to 1")
            datasets[idx].batch_size = 1

        validate, reason = validate_subsets(datasets[idx].subsets, parameter.config.caption_extension)
        if not validate:
            return validate, reason

        if datasets[idx].resolution[0] <=  0:
            return False, "resolution must be greater than 0"

        if datasets[idx].resolution[1] <=  0:
            return False, "resolution must be greater than 0"

    return True, "Ok"

def validate_dataset(parameter :TrainingParameter, dataset) -> 'Tuple[bool, str]':
    if dataset.datasets is None:
        return False, "datasets is required"

    if dataset.general is None:
        return False, "general is required"
    
    if dataset.general.caption_extension is None:
        dataset.general.caption_extension = ".txt"
    
    if dataset.general.keep_tokens is None:
        logger.warning("keep_tokens is not set, set to 1")
        dataset.general.keep_tokens = 1
    
    return validate_datasets(parameter, dataset.datasets)
    

def validate_config(config: TrainingConfig) -> 'Tuple[bool, str]':
    if config.output_name is None or config.output_name == "":
        return False, "output_name is required"
    
    if config.output_dir is None or config.output_dir == "":
        return False, "output_dir is required"
    elif os.path.isabs(config.output_dir) and not os.path.exists(config.output_dir):
        return False, f"output_dir {config.output_dir} is not exists"
    elif not os.path.isabs(config.output_dir) and not os.path.exists(os.path.join(getprojectpath(), config.output_dir)):
        return False, f"output_dir {os.path.join(getprojectpath(), config.output_dir)} is not exists"

    if config.bucket_reso_steps is None or config.bucket_reso_steps <= 32 or config.bucket_reso_steps % 64 != 0:
        logger.warning("bucket_reso_steps is not set, set to 64, must be multiple of 64")
        config.bucket_reso_steps = 64
    
    if config.clip_l is None or config.clip_l == "":
        logger.warning("clip_l is not set, set to default")
        config.clip_l = os.path.join(getmodelpath() , "clip", "clip_l.safetensors")
    elif not os.path.exists(config.clip_l):
        return False, f"file {config.clip_l} is not exists"

    if config.t5xxl is None or config.t5xxl == "":
        logger.warning("t5xxl is not set, set to default")
        config.t5xxl = os.path.join(getmodelpath() , "clip", "t5xxl_fp16.safetensors")
    elif not os.path.exists(config.t5xxl):
        return False, f"file t5xxl {config.t5xxl} is not exists"

    if config.ae is None or config.ae == "":
        logger.warning("ae is not set, set to default")
        config.ae = os.path.join(getmodelpath() , "vae", "ae.safetensors")
    elif not os.path.exists(config.ae):
        return False, f"file ae {config.ae} is not exists"

    if config.pretrained_model_name_or_path is None or config.pretrained_model_name_or_path == "":
        logger.warning("pretrained_model_name_or_path is not set, set to default")
        config.pretrained_model_name_or_path = os.path.join(getmodelpath() , "unet", "flux1-dev.safetensors")
    elif not os.path.exists(config.pretrained_model_name_or_path):
        return False, f"file pretrained model {config.pretrained_model_name_or_path} is not exists"
    
    if config.resolution is None or config.resolution == "":
        logger.warning("resolution is requirements, set default to 1024,1024")
        config.resolution = "1024,1024"

    if config.network_weights == '':
        logger.info('network_wights should be set to None when empty')
        config.network_weights = None

    if config.caption_extension is None or config.caption_extension == "":
        config.caption_extension = ".txt"
    
    # We need parse the training progress with tensorboard log format, 
    # so overwrite the log_with value to tensorboard
    config.log_with = "tensorboard"

    # Set the logging directory
    if config.logging_dir is None or config.logging_dir == "":
        config.logging_dir = os.path.join(getprojectpath(), "logs")
    elif not os.path.isabs(config.logging_dir):
        config.logging_dir = os.path.join(getprojectpath(), config.logging_dir)
    
    if not os.path.exists(config.logging_dir):
        os.makedirs(config.logging_dir)
    
    if config.optimizer_type == "adafactor":
        logger.warning(f"optimizer_type {config.optimizer_type} is set, the lr_warmup_steps will be set to 0")
        config.lr_warmup_steps = 0

    openai_tokenizer_cache_dir = os.path.join(getmodelpath(), "clip", "openai_clip-vit-large-patch14")
    google_tokenizer_cache_dir = os.path.join(getmodelpath(), "clip", "google_t5-v1_1-xxl")

    if (config.tokenizer_cache_dir is None or config.tokenizer_cache_dir == "") and \
        (os.path.exists(openai_tokenizer_cache_dir) and os.path.exists(google_tokenizer_cache_dir)):
        config.tokenizer_cache_dir = os.path.join(getmodelpath(), "clip")
    
    return True, "Ok"

def validate_sampling(config: TrainingConfig) -> 'Tuple[bool, str]':

    if not is_flux_sampling(config):
        return True, "Ok"
    
    sample_prompts_path = os.path.join(config.output_dir, "sample_prompts.txt")
    with open(sample_prompts_path, 'w', encoding='utf-8') as file:
        file.write(config.sample_prompts)    
    
    config.sample_prompts = sample_prompts_path
    return True, "Ok"
    

def validate_parameter(parameter :TrainingParameter) -> 'Tuple[bool, str]':
    if parameter is None:
        return False, "parameter is none"
    
    if parameter.config is None:
        return False, "config is required"

    if parameter.dataset is None :
        return False, "dataset is required"

    validated, reason = validate_config(parameter.config)
    if not validated:
        return validated, reason

    validated, reason = validate_sampling(parameter.config)
    if not validated:
        return validated, reason
    
    validated, reason = validate_dataset(parameter, parameter.dataset)
    return validated, reason


def convert_enum_to_dict(obj):
    """Helper function to convert Enum values to strings during dict conversion"""
    if isinstance(obj, Enum):
        return obj.value
    elif isinstance(obj, dict):
        return {k: convert_enum_to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_enum_to_dict(x) for x in obj]
    return obj

def config2toml(config: TrainingConfig, dataset_path: str) -> str:
    config.dataset_config = dataset_path
    # whole number write to toml file will parse as integer which could cause the sd-script thrown exception
    # force whole number convert to float, e.g. 1 -> 1.0
    force_float_fields(config)
    configdikt = asdict(config, 
                        dict_factory=lambda x: {k: convert_enum_to_dict(v) for k, v in x})
    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".toml")
    temp_file_path = temp_file.name

    logger.info(f"config file path is {temp_file_path}")

    # Write the dictionary to the temporary file in TOML format
    with open(temp_file_path, 'w+', encoding='utf-8') as f:
        toml.dump(configdikt, f)
    return temp_file_path


def dataset2toml(dataset: Any) -> str:
    """
    Convert dataset configuration to TOML format, handling Enum values properly.
    
    Args:
        dataset: Dataset configuration object
    
    Returns:
        str: Path to generated TOML file
    """
    # Convert the dataset instance to a dictionary with enum handling
    data = asdict(dataset, dict_factory=lambda x: {k: convert_enum_to_dict(v) for k, v in x})

    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".toml")
    temp_file_path = temp_file.name
    logger.info(f"dataset file path is {temp_file_path}")

    # Write the dictionary to the temporary file in TOML format
    with open(temp_file_path, 'w+', encoding='utf-8') as f:
        toml.dump(data, f)
    return temp_file_path


def write_caption_file(image_path: str, output_dir: str, caption_text: str, class_token=None, is_append: bool = False) -> Tuple[bool, str]:
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    cap_file_path = os.path.join(output_dir, f"{base_name}.txt")
    model = "w"
    if is_append:
        model = "a+"
    with open(cap_file_path, model, encoding="utf-8") as txt_file:
        if class_token is not None or class_token != "":
            caption_text = f"{class_token}, {caption_text}"
        txt_file.write(caption_text)    
    return True, cap_file_path

def get_dataset_contents(dataset_dir: str, extensions: List[str]):
    """
    Get the contents of the image file.
    """
    for filename in os.listdir(dataset_dir):
        file_path = os.path.join(dataset_dir, filename)
        ext = os.path.splitext(filename)[1].lower() 
        if not os.path.isfile(file_path) or not ext in extensions:
            continue

        # Get the base filename without extension
        base_name = os.path.splitext(filename)[0]
        # Construct full image path
        txt_path = os.path.join(dataset_dir, f"{base_name}.txt")
        caption = ""
        if not os.path.exists(txt_path):
            continue
        try:
            with open(txt_path, 'r', encoding='utf-8') as txt_file:
                caption = txt_file.read().strip()
        except Exception as e:
                logger.warning(f"Error reading caption from {txt_path}", exc_info=e)
        yield file_path, caption, ext

