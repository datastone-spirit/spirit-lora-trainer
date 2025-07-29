"""
Utility functions for converting dataclasses to YAML format
"""
import yaml
from dataclasses import is_dataclass, asdict
from typing import Any
import os
import uuid
from utils.util import setup_logging

setup_logging()
import logging
logger = logging.getLogger(__name__)


def dataclass_to_yaml_file(obj: Any, output_path: str, **yaml_kwargs) -> str:
    """
    Convert a dataclass to YAML and save to file.
    
    Args:
        obj: The dataclass instance to convert
        output_path: Path where to save the YAML file
        **yaml_kwargs: Additional arguments to pass to yaml.dump
        
    Returns:
        Path to the created YAML file
    """
    if not is_dataclass(obj):
        raise ValueError(f"Object {type(obj)} is not a dataclass")
    
    # Convert to dictionary using built-in asdict
    data_dict = asdict(obj)
    
    # Set default YAML dump parameters
    yaml_params = {
        'default_flow_style': False,
        'sort_keys': False,
        'indent': 2,
        'allow_unicode': True
    }
    yaml_params.update(yaml_kwargs)
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        yaml.dump(data_dict, f, **yaml_params)
    
    logger.info(f"Generated YAML config: {output_path}")
    return output_path


def dataclass_to_yaml_string(obj: Any, **yaml_kwargs) -> str:
    """
    Convert a dataclass to YAML string.
    
    Args:
        obj: The dataclass instance to convert
        **yaml_kwargs: Additional arguments to pass to yaml.dump
        
    Returns:
        YAML string representation
    """
    if not is_dataclass(obj):
        raise ValueError(f"Object {type(obj)} is not a dataclass")
    
    # Convert to dictionary using built-in asdict
    data_dict = asdict(obj)
    
    # Set default YAML dump parameters
    yaml_params = {
        'default_flow_style': False,
        'sort_keys': False,
        'indent': 2,
        'allow_unicode': True
    }
    yaml_params.update(yaml_kwargs)
    
    return yaml.dump(data_dict, **yaml_params)


def generate_config_filename(prefix: str = "config", suffix: str = "yaml", unique: bool = True) -> str:
    """
    Generate a configuration filename.
    
    Args:
        prefix: Filename prefix
        suffix: File extension (without dot)
        unique: Whether to add a unique identifier
        
    Returns:
        Generated filename
    """
    if unique:
        unique_id = uuid.uuid4().hex[:8]
        return f"{prefix}_{unique_id}.{suffix}"
    else:
        return f"{prefix}.{suffix}"


def save_dataclass_config(obj: Any, output_dir: str, filename: str = None, **yaml_kwargs) -> str:
    """
    Convenience function to save a dataclass as YAML config file.
    
    Args:
        obj: The dataclass instance to save
        output_dir: Directory where to save the config
        filename: Optional filename (auto-generated if None)
        **yaml_kwargs: Additional arguments to pass to yaml.dump
        
    Returns:
        Path to the saved config file
    """
    if filename is None:
        filename = generate_config_filename(prefix="config")
    
    output_path = os.path.join(output_dir, filename)
    return dataclass_to_yaml_file(obj, output_path, **yaml_kwargs)
