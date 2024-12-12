from flask import jsonify
import os
from flasgger import swag_from
from app.api.model.training_paramter import TrainingConfig, TrainingParameter, Dataset, Subset
from typing import List, Tuple
from utils.util import getmodelpath
import logging
    
# 公共 response 方法
def res(data=None, message="Ok", success=True, code=200):
    return jsonify(
        {
            "success": success,
            "message": message,
            "data": data,
        },
        code,
    )


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_directory_structure(directory):
    """返回当前目录层级的文件和目录结构"""
    try:
        items = os.listdir(directory)  # 获取指定目录下的所有项（文件和目录）
        dirs = []
        files = []

        for item in items:
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path):
                dirs.append(
                    {
                        "value": item_path,  # 子目录的 id 可以使用目录的路径作为标识
                        "label": item,  # 显示在树形结构中的名称
                        "isLeaf": False,  # 目录肯定不是叶子节点
                    }
                )
            elif os.path.isfile(item_path):
                files.append(
                    {
                        "value": item_path,
                        "label": item,
                        "isLeaf": True,
                    }
                )

        return {"directories": dirs, "files": files}

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

def validate_subsets(subsets: List[Subset]) -> 'Tuple[bool, str]':
    for idx in range(len(subsets)):
        if subsets[idx].class_tokens is None:
            return False, "class_tokens is required"
        if subsets[idx].image_dir is None:
            return False, "image_dir is required"
        if subsets[idx].num_repeats is None or subsets[idx].num_repeats <= 0:
            logging.warning("num_repeats is not set, set to 1")
            subsets[idx].num_repeats = 1
    return True, "Ok"

def validate_datasets(datasets :List[Dataset]) -> 'Tuple[bool, str]':
    for idx in range(len(datasets)):
        if idx >= len(datasets):
            break
        if datasets[idx].batch_size is None or datasets[idx].batch_size <= 0:
            logging.warning("batch_size is not set, set to 1")
            datasets[idx].batch_size = 1

        validate, reason = validate_subsets(datasets[idx].subsets)
        if not validate:
            return validate, reason

        if datasets[idx].resolution < 0:
            return False, "resolution must be greater than 0"
        idx += 1
    return True, "Ok"

def validate_dataset(dataset) -> 'Tuple[bool, str]':
    if dataset.datasets is None:
        return False, "datasets is required"
    if dataset.general is None:
        return False, "general is required"
    
    if dataset.general.caption_extension is None:
        dataset.general.caption_extension = ".txt"
    
    if dataset.general.keep_tokens is None:
        logging.warning("keep_tokens is not set, set to 1")
        dataset.general.keep_tokens = 1
    
    return validate_datasets(dataset.datasets)
    

def validate_config(config: TrainingConfig) -> 'Tuple[bool, str]':
    if config.output_name is None:
        return False, "output_name is required"
    if config.bucket_reso_steps is None or config.bucket_reso_steps <= 32 or config.bucket_reso_steps % 64 != 0:
        logging.warning("bucket_reso_steps is not set, set to 64, must be multiple of 64")
        config.bucket_reso_steps = 64
    
    if config.clip_l is None or config.clip_l == "":
        logging.warning("clip_l is not set, set to default")
        config.clip_l = getmodelpath() + "/clip/clip_l.safetensors"
    elif not os.path.exists(config.clip_l):
        return False, "clip_l is not exists"

    if config.t5xxl is None or config.t5xxl == "":
        logging.warning("t5xxl is not set, set to default")
        config.t5xxl = getmodelpath() + "/clip/t5xxl_fp16.safetensors"
    elif not os.path.exists(config.t5xxl):
        return False, "t5xxl is not exists"

    if config.ae is None or config.ae == "":
        logging.warning("ae is not set, set to default")
        config.ae = getmodelpath() + "/vae/ae.safetensors"
    elif not os.path.exists(config.ae):
        return False, "ae is not exists"

    if config.pretrained_model_name_or_path is None or config.pretrained_model_name_or_path == "":
        logging.warning("pretrained_model_name_or_path is not set, set to default")
        config.pretrained_model_name_or_path = getmodelpath() + "/unet/flux1-dev.safetensors"
    elif not os.path.exists(config.pretrained_model_name_or_path):
        return False, "pretrained_model_name_or_path is not exists"

    return True, "Ok"

def validate_parameter(parameter :TrainingParameter) -> 'Tuple[bool, str]':
    validated, reason = validate_config(parameter.config)
    if not validated:
        return validated, reason
    
    validated, reason = validate_dataset(parameter.dataset)
    return validated, reason
