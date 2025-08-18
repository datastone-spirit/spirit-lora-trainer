# Kontext LoRA 训练任务
kontext_training_api_config = {
    "tags": ["Training"],
    "description": "启动 Kontext (Flux Kontext LoRA) 训练任务",
    "parameters": [
        {
            "name": "kontext_config",
            "in": "body",
            "required": True,
            "description": "Kontext LoRA 训练配置对象",
            "schema": {
                "type": "object",
                "properties": {
                    "job": {
                        "type": "string",
                        "example": "extension",
                        "description": "训练任务类型"
                    },
                    "meta": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "example": "[name]",
                                "description": "元数据名称"
                            },
                            "version": {
                                "type": "string",
                                "example": "1.0",
                                "description": "版本号"
                            }
                        }
                    },
                    "config": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "example": "my_first_flux_kontext_lora_v1",
                                "description": "训练配置名称"
                            },
                            "process": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "type": "string",
                                            "example": "sd_trainer",
                                            "description": "处理器类型"
                                        },
                                        "training_folder": {
                                            "type": "string",
                                            "example": "/path/to/training/output",
                                            "description": "训练输出文件夹路径"
                                        },
                                        "device": {
                                            "type": "string",
                                            "example": "cuda:0",
                                            "description": "训练设备"
                                        },
                                        "datasets": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "folder_path": {
                                                        "type": "string",
                                                        "example": "/path/to/dataset",
                                                        "description": "数据集文件夹路径"
                                                    },
                                                    "control_path": {
                                                        "type": "string",
                                                        "example": "/path/to/control",
                                                        "description": "控制图像路径"
                                                    },
                                                    "caption_ext": {
                                                        "type": "string",
                                                        "example": "txt",
                                                        "description": "标注文件扩展名"
                                                    },
                                                    "caption_dropout_rate": {
                                                        "type": "number",
                                                        "example": 0.05,
                                                        "description": "标注丢弃率"
                                                    },
                                                    "shuffle_tokens": {
                                                        "type": "boolean",
                                                        "example": False,
                                                        "description": "是否打乱token"
                                                    },
                                                    "cache_latents_to_disk": {
                                                        "type": "boolean",
                                                        "example": True,
                                                        "description": "是否缓存latents到磁盘"
                                                    },
                                                    "resolution": {
                                                        "type": "array",
                                                        "items": {"type": "integer"},
                                                        "example": [512, 768],
                                                        "description": "图像分辨率"
                                                    }
                                                }
                                            }
                                        },
                                        "model": {
                                            "type": "object",
                                            "properties": {
                                                "arch": {
                                                    "type": "string",
                                                    "example": "flux_kontext",
                                                    "description": "模型架构"
                                                },
                                                "name_or_path": {
                                                    "type": "string",
                                                    "example": "/path/to/base/model",
                                                    "description": "基础模型路径"
                                                },
                                                "quantize": {
                                                    "type": "boolean",
                                                    "example": True,
                                                    "description": "是否量化"
                                                },
                                                "low_vram": {
                                                    "type": "boolean",
                                                    "example": True,
                                                    "description": "是否使用低显存模式"
                                                }
                                            }
                                        },
                                        "network": {
                                            "type": "object",
                                            "properties": {
                                                "type": {
                                                    "type": "string",
                                                    "example": "lora",
                                                    "description": "网络类型"
                                                },
                                                "linear": {
                                                    "type": "integer",
                                                    "example": 16,
                                                    "description": "线性层维度"
                                                },
                                                "linear_alpha": {
                                                    "type": "integer",
                                                    "example": 16,
                                                    "description": "线性层alpha值"
                                                }
                                            }
                                        },
                                        "sample": {
                                            "type": "object",
                                            "properties": {
                                                "sampler": {
                                                    "type": "string",
                                                    "example": "flowmatch",
                                                    "description": "采样器类型"
                                                },
                                                "sample_every": {
                                                    "type": "integer",
                                                    "example": 250,
                                                    "description": "采样间隔"
                                                },
                                                "sample_steps": {
                                                    "type": "integer",
                                                    "example": 20,
                                                    "description": "采样步数"
                                                },
                                                "prompts": {
                                                    "type": "array",
                                                    "items": {"type": "string"},
                                                    "example": ["make this person a big head"],
                                                    "description": "采样提示词列表"
                                                },
                                                "neg": {
                                                    "type": "string",
                                                    "example": "",
                                                    "description": "负向提示词"
                                                },
                                                "seed": {
                                                    "type": "integer",
                                                    "example": 42,
                                                    "description": "随机种子"
                                                },
                                                "walk_seed": {
                                                    "type": "boolean",
                                                    "example": True,
                                                    "description": "是否随机种子游走"
                                                },
                                                "width": {
                                                    "type": "integer",
                                                    "example": 1024,
                                                    "description": "生成图像宽度"
                                                },
                                                "height": {
                                                    "type": "integer",
                                                    "example": 1024,
                                                    "description": "生成图像高度"
                                                },
                                                "guidance_scale": {
                                                    "type": "number",
                                                    "example": 4.0,
                                                    "description": "引导强度"
                                                }
                                            }
                                        },
                                        "save": {
                                            "type": "object",
                                            "properties": {
                                                "dtype": {
                                                    "type": "string",
                                                    "example": "float16",
                                                    "description": "保存数据类型"
                                                },
                                                "save_every": {
                                                    "type": "integer",
                                                    "example": 250,
                                                    "description": "保存间隔"
                                                },
                                                "max_step_saves_to_keep": {
                                                    "type": "integer",
                                                    "example": 4,
                                                    "description": "最大保存检查点数量"
                                                },
                                                "push_to_hub": {
                                                    "type": "boolean",
                                                    "example": False,
                                                    "description": "是否推送到Hub"
                                                }
                                            }
                                        },
                                        "train": {
                                            "type": "object",
                                            "properties": {
                                                "batch_size": {
                                                    "type": "integer",
                                                    "example": 1,
                                                    "description": "批次大小"
                                                },
                                                "steps": {
                                                    "type": "integer",
                                                    "example": 3000,
                                                    "description": "训练步数"
                                                },
                                                "gradient_accumulation_steps": {
                                                    "type": "integer",
                                                    "example": 1,
                                                    "description": "梯度累积步数"
                                                },
                                                "train_unet": {
                                                    "type": "boolean",
                                                    "example": True,
                                                    "description": "是否训练UNet"
                                                },
                                                "train_text_encoder": {
                                                    "type": "boolean",
                                                    "example": False,
                                                    "description": "是否训练文本编码器"
                                                },
                                                "gradient_checkpointing": {
                                                    "type": "boolean",
                                                    "example": True,
                                                    "description": "是否使用梯度检查点"
                                                },
                                                "noise_scheduler": {
                                                    "type": "string",
                                                    "example": "flowmatch",
                                                    "description": "噪声调度器"
                                                },
                                                "optimizer": {
                                                    "type": "string",
                                                    "example": "adamw8bit",
                                                    "description": "优化器"
                                                },
                                                "lr": {
                                                    "type": "number",
                                                    "example": 0.0001,
                                                    "description": "学习率"
                                                },
                                                "dtype": {
                                                    "type": "string",
                                                    "example": "bf16",
                                                    "description": "训练数据类型"
                                                },
                                                "timestep_type": {
                                                    "type": "string",
                                                    "example": "weighted",
                                                    "description": "时间步类型"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "frontend_config": {
                        "type": "string",
                        "example": "",
                        "description": "前端配置字符串"
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "返回Kontext训练任务启动结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "data": {
                        "type": "object",
                        "properties": {
                            "task_id": {
                                "type": "string",
                                "example": "abc123def456",
                                "description": "训练任务ID"
                            }
                        }
                    },
                    "message": {
                        "type": "string",
                        "example": "Kontext training task abc123def456 started successfully.",
                        "description": "成功消息"
                    },
                    "code": {
                        "type": "integer",
                        "example": 0,
                        "description": "返回状态码"
                    }
                },
            },
        },
        "400": {
            "description": "请求无效，配置参数错误或验证失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "message": {
                        "type": "string",
                        "example": "Training parameters validation failed: folder_path is required and must exist",
                        "description": "错误详细信息"
                    },
                    "code": {
                        "type": "integer",
                        "example": 400,
                        "description": "错误状态码"
                    }
                },
            },
        },
        "500": {
            "description": "服务器错误，训练启动失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "message": {
                        "type": "string",
                        "example": "Server Internal Error, please contact the administrator",
                        "description": "服务器错误信息"
                    },
                    "code": {
                        "type": "integer",
                        "example": 500,
                        "description": "错误状态码"
                    }
                },
            },
        },
    },
}
