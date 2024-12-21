from flask import jsonify
import os
from flasgger import swag_from
from dataclasses import asdict
from app.api.model.training_paramter import TrainingConfig, TrainingParameter, Dataset, Subset, TrainingDataset
from typing import List, Tuple
from utils.util import getmodelpath, getprojectpath
import tempfile
import toml

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)
    
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


def get_directory_structure(directory, is_dir="true"):
    """
        返回当前目录层级的文件和目录结构
        :param directory: 要扫描的目录路径
        :param is_dir: 是否只返回目录，true 表示只返回目录，其它值返回目录和文件
    """
    try:
        items = os.listdir(directory)  # 获取指定目录下的所有项（文件和目录）
        result = []  # 存放最终的结果

        for item in items:
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path):
                result.append(
                    {
                        "value": item_path,  # 子目录的路径作为标识
                        "label": item,  # 显示在树形结构中的名称
                        "isLeaf": False,  # 目录肯定不是叶子节点
                    }
                )
            elif os.path.isfile(item_path) and is_dir != "true":
                result.append(
                    {
                        "value": item_path,
                        "label": item,
                        "isLeaf": True,  # 文件是叶子节点
                    }
                )

        return result

    except Exception as e:
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

    
def validate_training_data(image_dir: str, caption_ext: str = ".txt") -> 'Tuple[bool, str]':
    if not os.path.isdir(image_dir):
        return False, f"{image_dir} is not a valid directory"

    valid_image_extensions = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".gif"}
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
            if file_ext in valid_image_extensions:
                valid_images.append(file_name)
                caption_file = file[0] + caption_ext
                caption_path = os.path.join(image_dir, caption_file)
                if os.path.isfile(caption_path):
                    valid_captions.append(caption_file)

    if len(valid_images) < 1 or len(valid_captions) < 1:
        return False, f"No valid images found in the directory {image_dir}"

    if len(valid_images) != len(valid_captions):
        logger.warning(f"Mismatch between images:{len(valid_images)} and caption files {len(valid_captions)}")
        return True, f"Mismatch between images {len(valid_images)} and caption files {len(valid_captions)}"

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

    return True, "Ok"

def validate_parameter(parameter :TrainingParameter) -> 'Tuple[bool, str]':
    validated, reason = validate_config(parameter.config)
    if not validated:
        return validated, reason
    
    validated, reason = validate_dataset(parameter, parameter.dataset)
    return validated, reason


def config2toml(config: TrainingConfig, dataset_path: str) -> str:
    config.dataset_config = dataset_path
    configdikt = asdict(config)
    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".toml")
    temp_file_path = temp_file.name

    logger.info(f"config file path is {temp_file_path}")

    # Write the dictionary to the temporary file in TOML format
    with open(temp_file_path, 'w+', encoding='utf-8') as f:
        toml.dump(configdikt, f)
    return temp_file_path


def dataset2toml(dataset :TrainingDataset) -> str:
    # accroding to the value of feild to generate a toml format file 
    # in the temporary directory and return the path
    # Convert the TrainingDataset instance to a dictionary
    data = asdict(dataset)

    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".toml")
    temp_file_path = temp_file.name
    logger.info(f"dataset file path is {temp_file_path}")

    # Write the dictionary to the temporary file in TOML format
    with open(temp_file_path, 'w+', encoding='utf-8') as f:
        toml.dump(data, f)
    return temp_file_path