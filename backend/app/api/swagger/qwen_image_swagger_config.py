# QwenImage Training Configuration
qwenimage_training_api_config = {
    "tags": ["Training"],
    "description": "启动QwenImage图像训练任务",
    "parameters": [
        {
            "name": "qwenimage_config",
            "in": "body",
            "required": True,
            "description": "QwenImage训练配置对象",
            "schema": {
                "type": "object",
                "properties": {
                    "config": {
                        "type": "object",
                        "description": "QwenImage训练配置",
                        "properties": {
                            "dit": {
                                "type": "string",
                                "description": "DiT模型路径",
                                "example": "/path/to/dit/model"
                            },
                            "vae": {
                                "type": "string", 
                                "description": "VAE模型路径",
                                "example": "/path/to/vae/model"
                            },
                            "text_encoder": {
                                "type": "string",
                                "description": "文本编码器模型路径",
                                "example": "/path/to/text_encoder"
                            },
                            "output_dir": {
                                "type": "string",
                                "description": "输出目录",
                                "example": "/path/to/output"
                            },
                            "output_name": {
                                "type": "string",
                                "description": "输出模型文件基本名称",
                                "example": "qwen_lora"
                            },
                            "max_train_steps": {
                                "type": "integer",
                                "description": "最大训练步数",
                                "example": 1600
                            },
                            "max_train_epochs": {
                                "type": "integer",
                                "description": "最大训练轮数 (覆盖max_train_steps)",
                                "example": 10
                            },
                            "learning_rate": {
                                "type": "number",
                                "description": "学习率",
                                "example": 2e-06
                            },
                            "network_dim": {
                                "type": "integer",
                                "description": "网络维度 (LoRA rank)",
                                "example": 32
                            },
                            "network_alpha": {
                                "type": "number",
                                "description": "网络Alpha值",
                                "example": 1.0
                            },
                            "network_module": {
                                "type": "string",
                                "description": "要训练的网络模块",
                                "example": "networks.lora"
                            },
                            "network_weights": {
                                "type": "string",
                                "description": "预训练网络权重路径",
                                "example": "/path/to/network_weights"
                            },
                            "network_args": {
                                "type": "string",
                                "description": "网络额外参数",
                                "example": "conv_dim=16 conv_alpha=16"
                            },
                            "network_dropout": {
                                "type": "number",
                                "description": "网络dropout率",
                                "example": 0.0
                            },
                            "gradient_accumulation_steps": {
                                "type": "integer",
                                "description": "梯度累积步数",
                                "example": 1
                            },
                            "gradient_checkpointing": {
                                "type": "boolean",
                                "description": "是否启用梯度检查点",
                                "example": False
                            },
                            "max_grad_norm": {
                                "type": "number",
                                "description": "最大梯度裁剪",
                                "example": 1.0
                            },
                            "fp8_scaled": {
                                "type": "boolean",
                                "description": "是否使用缩放fp8",
                                "example": False
                            },
                            "fp8_vl": {
                                "type": "boolean",
                                "description": "是否对文本编码器使用fp8",
                                "example": False
                            },
                            "fp8_base": {
                                "type": "boolean",
                                "description": "是否对基础模型使用fp8",
                                "example": False
                            },
                            "mixed_precision": {
                                "type": "string",
                                "description": "混合精度设置",
                                "example": "bf16",
                                "enum": ["no", "fp16", "bf16"]
                            },
                            "optimizer_type": {
                                "type": "string",
                                "description": "优化器类型",
                                "example": "AdamW"
                            },
                            "optimizer_args": {
                                "type": "string",
                                "description": "优化器额外参数",
                                "example": "weight_decay=0.01 betas=0.9,0.999"
                            },
                            "lr_scheduler": {
                                "type": "string",
                                "description": "学习率调度器",
                                "example": "constant"
                            },
                            "lr_scheduler_args": {
                                "type": "string",
                                "description": "学习率调度器额外参数",
                                "example": "T_max=100"
                            },
                            "lr_warmup_steps": {
                                "type": "integer",
                                "description": "学习率预热步数",
                                "example": 0
                            },
                            "lr_scheduler_num_cycles": {
                                "type": "integer",
                                "description": "cosine调度器重启次数",
                                "example": 1
                            },
                            "lr_scheduler_power": {
                                "type": "number",
                                "description": "多项式调度器幂次",
                                "example": 1.0
                            },
                            "lr_scheduler_min_lr_ratio": {
                                "type": "number",
                                "description": "最小学习率比率",
                                "example": 0.1
                            },
                            "save_every_n_steps": {
                                "type": "integer",
                                "description": "每N步保存检查点",
                                "example": 500
                            },
                            "save_every_n_epochs": {
                                "type": "integer",
                                "description": "每N轮保存检查点",
                                "example": 1
                            },
                            "save_last_n_epochs": {
                                "type": "integer",
                                "description": "保留最后N个epoch检查点",
                                "example": 3
                            },
                            "save_last_n_steps": {
                                "type": "integer",
                                "description": "保留最后N个step检查点",
                                "example": 100
                            },
                            "save_state": {
                                "type": "boolean",
                                "description": "是否保存训练状态",
                                "example": False
                            },
                            "save_state_on_train_end": {
                                "type": "boolean",
                                "description": "训练结束时保存状态",
                                "example": False
                            },
                            "resume": {
                                "type": "string",
                                "description": "恢复训练的状态路径",
                                "example": "/path/to/resume/state"
                            },
                            "sample_every_n_steps": {
                                "type": "integer", 
                                "description": "每N步生成样本",
                                "example": 100
                            },
                            "sample_every_n_epochs": {
                                "type": "integer",
                                "description": "每N轮生成样本",
                                "example": 1
                            },
                            "sample_prompts": {
                                "type": "string",
                                "description": "样本提示词文件路径",
                                "example": "/path/to/prompts.txt"
                            },
                            "sample_at_first": {
                                "type": "boolean",
                                "description": "是否在训练前生成样本",
                                "example": False
                            },
                            "logging_dir": {
                                "type": "string",
                                "description": "日志目录",
                                "example": "/path/to/logs"
                            },
                            "log_with": {
                                "type": "string",
                                "description": "日志记录工具",
                                "example": "tensorboard"
                            },
                            "log_prefix": {
                                "type": "string",
                                "description": "日志前缀",
                                "example": "qwen_training"
                            },
                            "log_config": {
                                "type": "boolean",
                                "description": "是否记录配置",
                                "example": False
                            },
                            "seed": {
                                "type": "integer",
                                "description": "随机种子",
                                "example": 42
                            },
                            "max_data_loader_n_workers": {
                                "type": "integer",
                                "description": "数据加载器最大工作进程数",
                                "example": 8
                            },
                            "persistent_data_loader_workers": {
                                "type": "boolean",
                                "description": "是否持久化数据加载器工作进程",
                                "example": False
                            },
                            "timestep_sampling": {
                                "type": "string",
                                "description": "时间步采样方法",
                                "example": "sigma",
                                "enum": ["sigma", "uniform", "sigmoid", "shift", "flux_shift"]
                            },
                            "discrete_flow_shift": {
                                "type": "number",
                                "description": "离散流偏移",
                                "example": 1.0
                            },
                            "sigmoid_scale": {
                                "type": "number",
                                "description": "sigmoid时间步采样缩放因子",
                                "example": 1.0
                            },
                            "weighting_scheme": {
                                "type": "string",
                                "description": "时间步分布权重方案",
                                "example": "none",
                                "enum": ["none", "logit_normal", "mode", "cosine"]
                            },
                            "logit_mean": {
                                "type": "number",
                                "description": "logit_normal权重方案的均值",
                                "example": 0.0
                            },
                            "logit_std": {
                                "type": "number",
                                "description": "logit_normal权重方案的标准差",
                                "example": 1.0
                            },
                            "mode_scale": {
                                "type": "number",
                                "description": "mode权重方案的缩放因子",
                                "example": 1.29
                            },
                            "min_timestep": {
                                "type": "integer",
                                "description": "最小时间步",
                                "example": 0
                            },
                            "max_timestep": {
                                "type": "integer",
                                "description": "最大时间步",
                                "example": 1000
                            },
                            "vae_dtype": {
                                "type": "string",
                                "description": "VAE数据类型",
                                "example": "bfloat16"
                            },
                            "flash_attn": {
                                "type": "boolean",
                                "description": "是否使用FlashAttention",
                                "example": False
                            },
                            "flash3": {
                                "type": "boolean",
                                "description": "是否使用FlashAttention 3",
                                "example": False
                            },
                            "sage_attn": {
                                "type": "boolean",
                                "description": "是否使用SageAttention",
                                "example": False
                            },
                            "sdpa": {
                                "type": "boolean",
                                "description": "是否使用SDPA",
                                "example": False
                            },
                            "xformers": {
                                "type": "boolean",
                                "description": "是否使用xformers",
                                "example": False
                            },
                            "split_attn": {
                                "type": "boolean",
                                "description": "是否使用分割注意力",
                                "example": False
                            },
                            "guidance_scale": {
                                "type": "number",
                                "description": "引导缩放",
                                "example": 1.0
                            },
                            "ddp_gradient_as_bucket_view": {
                                "type": "boolean",
                                "description": "DDP梯度桶视图",
                                "example": False
                            },
                            "ddp_static_graph": {
                                "type": "boolean",
                                "description": "DDP静态图",
                                "example": False
                            },
                            "ddp_timeout": {
                                "type": "integer",
                                "description": "DDP超时(分钟)",
                                "example": 30
                            },
                            "show_timesteps": {
                                "type": "string",
                                "description": "显示时间步分布",
                                "example": "console",
                                "enum": ["image", "console"]
                            },
                            "training_comment": {
                                "type": "string",
                                "description": "训练注释",
                                "example": "QwenImage LoRA training"
                            },
                            "metadata_title": {
                                "type": "string",
                                "description": "模型元数据标题",
                                "example": "My QwenImage LoRA"
                            },
                            "metadata_author": {
                                "type": "string",
                                "description": "模型元数据作者",
                                "example": "Author Name"
                            },
                            "metadata_description": {
                                "type": "string",
                                "description": "模型元数据描述",
                                "example": "A fine-tuned QwenImage model"
                            },
                            "metadata_license": {
                                "type": "string",
                                "description": "模型元数据许可证",
                                "example": "apache-2.0"
                            },
                            "metadata_tags": {
                                "type": "string",
                                "description": "模型元数据标签(逗号分隔)",
                                "example": "qwen,lora,diffusion"
                            },
                            "no_metadata": {
                                "type": "boolean",
                                "description": "是否不保存元数据",
                                "example": False
                            },
                            "base_weights": {
                                "type": "string",
                                "description": "训练前要合并的网络权重",
                                "example": "/path/to/base/weights"
                            },
                            "base_weights_multiplier": {
                                "type": "number",
                                "description": "基础权重合并倍数",
                                "example": 1.0
                            },
                            "scale_weight_norms": {
                                "type": "number",
                                "description": "权重范数缩放",
                                "example": 1.0
                            },
                            "dim_from_weights": {
                                "type": "boolean",
                                "description": "从权重自动确定维度",
                                "example": False
                            },
                            "blocks_to_swap": {
                                "type": "integer",
                                "description": "要交换的块数量",
                                "example": 0
                            },
                            "img_in_txt_in_offloading": {
                                "type": "boolean",
                                "description": "将img_in和txt_in卸载到CPU",
                                "example": False
                            },
                            "preserve_distribution_shape": {
                                "type": "boolean",
                                "description": "保持时间步分布形状",
                                "example": False
                            },
                            "async_upload": {
                                "type": "boolean",
                                "description": "异步上传到HuggingFace",
                                "example": False
                            },
                            "huggingface_repo_id": {
                                "type": "string",
                                "description": "HuggingFace仓库ID",
                                "example": "username/model-name"
                            },
                            "huggingface_token": {
                                "type": "string",
                                "description": "HuggingFace访问令牌",
                                "example": "hf_xxxxxxxxxxxx"
                            },
                            "huggingface_repo_type": {
                                "type": "string",
                                "description": "HuggingFace仓库类型",
                                "example": "model"
                            },
                            "huggingface_repo_visibility": {
                                "type": "string",
                                "description": "HuggingFace仓库可见性",
                                "example": "private"
                            },
                            "huggingface_path_in_repo": {
                                "type": "string",
                                "description": "HuggingFace仓库中的路径",
                                "example": "model.safetensors"
                            },
                            "wandb_api_key": {
                                "type": "string",
                                "description": "WandB API密钥",
                                "example": "xxxxxxxxxxxxxxxx"
                            },
                            "wandb_run_name": {
                                "type": "string",
                                "description": "WandB运行名称",
                                "example": "qwen_training_run"
                            },
                            "log_tracker_name": {
                                "type": "string",
                                "description": "日志跟踪器名称",
                                "example": "qwen_tracker"
                            },
                            "log_tracker_config": {
                                "type": "string",
                                "description": "日志跟踪器配置路径",
                                "example": "/path/to/tracker/config"
                            },
                            "resume_from_huggingface": {
                                "type": "boolean",
                                "description": "从HuggingFace恢复训练",
                                "example": False
                            },
                            "save_state_to_huggingface": {
                                "type": "boolean",
                                "description": "保存状态到HuggingFace",
                                "example": False
                            },
                            "save_last_n_epochs_state": {
                                "type": "integer",
                                "description": "保存最后N个epoch状态",
                                "example": 1
                            },
                            "save_last_n_steps_state": {
                                "type": "integer",
                                "description": "保存最后N个step状态",
                                "example": 100
                            },
                            "lr_decay_steps": {
                                "type": "integer",
                                "description": "学习率衰减步数",
                                "example": 0
                            },
                            "lr_scheduler_timescale": {
                                "type": "integer",
                                "description": "逆平方根调度器时间尺度",
                                "example": 1000
                            },
                            "lr_scheduler_type": {
                                "type": "string",
                                "description": "自定义调度器模块",
                                "example": "custom_scheduler"
                            },
                            "dynamo_backend": {
                                "type": "string",
                                "description": "Dynamo后端类型",
                                "example": "inductor"
                            },
                            "dynamo_mode": {
                                "type": "string",
                                "description": "Dynamo模式",
                                "example": "default"
                            },
                            "dynamo_dynamic": {
                                "type": "boolean",
                                "description": "使用动态Dynamo",
                                "example": False
                            },
                            "dynamo_fullgraph": {
                                "type": "boolean",
                                "description": "使用全图Dynamo",
                                "example": False
                            }
                        }
                    },
                    "dataset": {
                        "type": "object",
                        "description": "数据集配置",
                        "properties": {
                            "general": {
                                "type": "object",
                                "description": "通用数据集配置",
                                "properties": {
                                    "resolution": {
                                        "type": "array",
                                        "items": {"type": "integer"},
                                        "description": "图像分辨率 [宽, 高]",
                                        "example": [1024, 1024]
                                    },
                                    "batch_size": {
                                        "type": "integer",
                                        "description": "批次大小",
                                        "example": 1
                                    },
                                    "num_repeats": {
                                        "type": "integer", 
                                        "description": "重复次数",
                                        "example": 1
                                    },
                                    "enable_bucket": {
                                        "type": "boolean",
                                        "description": "是否启用分桶",
                                        "example": True
                                    },
                                    "caption_extension": {
                                        "type": "string",
                                        "description": "标注文件扩展名",
                                        "example": ".txt"
                                    },
                                    "bucket_no_upscale": {
                                        "type": "boolean",
                                        "description": "是否禁用分桶上采样",
                                        "example": False
                                    },
                                    "cache_directory": {
                                        "type": "string",
                                        "description": "缓存目录路径",
                                        "example": "/path/to/cache"
                                    }
                                }
                            },
                            "datasets": {
                                "type": "array",
                                "description": "数据集列表",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "resolution": {
                                            "type": "array",
                                            "items": {"type": "integer"},
                                            "description": "图像分辨率 [宽, 高]",
                                            "example": [1024, 1024]
                                        },
                                        "batch_size": {
                                            "type": "integer",
                                            "description": "批次大小",
                                            "example": 1
                                        },
                                        "num_repeats": {
                                            "type": "integer", 
                                            "description": "重复次数",
                                            "example": 1
                                        },
                                        "enable_bucket": {
                                            "type": "boolean",
                                            "description": "是否启用分桶",
                                            "example": True
                                        },
                                        "caption_extension": {
                                            "type": "string",
                                            "description": "标注文件扩展名",
                                            "example": ".txt"
                                        },
                                        "image_directory": {
                                            "type": "string",
                                            "description": "图像目录路径",
                                            "example": "/path/to/images"
                                        },
                                        "image_jsonl_file": {
                                            "type": "string",
                                            "description": "图像标注文件路径",
                                            "example": "/path/to/images.jsonl"
                                        },
                                        "bucket_no_upscale": {
                                            "type": "boolean",
                                            "description": "是否禁用分桶上采样",
                                            "example": False
                                        },
                                        "cache_directory": {
                                            "type": "string",
                                            "description": "缓存目录路径",
                                            "example": "/path/to/cache"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "multi_gpu_config": {
                        "type": "object",
                        "description": "多GPU配置",
                        "properties": {
                            "multi_gpu_enabled": {
                                "type": "boolean",
                                "description": "是否启用多GPU",
                                "example": False
                            },
                            "num_gpus": {
                                "type": "integer",
                                "description": "GPU数量",
                                "example": 1
                            },
                            "gpu_ids": {
                                "type": "array",
                                "items": {"type": "integer"},
                                "description": "GPU ID列表",
                                "example": [0]
                            },
                            "distributed_backend": {
                                "type": "string",
                                "description": "",
                                "example": "nccl"
                            },
                            "auto_gpu_selection": {
                                "type": "boolean",
                                "description": "是否启用自动GPU选择",
                                "example": True
                            },
                            "memory_requirement_mb": {
                                "type": "integer",
                                "description": "内存需求（MB）",
                                "example": 8000
                            },
                            "gradient_sync_every_n_steps": {
                                "type": "integer",
                                "description": "每N步进行一次梯度同步",
                                "example": 1
                            },
                            "gradient_accumulation_steps": {
                                "type": "integer",
                                "description": "梯度累积步数",
                                "example": 1
                            }
                        }
                    },
                    "skip_cache_latent": {
                        "type": "boolean",
                        "description": "是否跳过缓存潜在变量步骤",
                        "example": False
                    },
                    "skip_cache_text_encoder_output": {
                        "type": "boolean", 
                        "description": "是否跳过缓存文本编码器输出步骤",
                        "example": False
                    },
                    "frontend_config": {
                        "type": "string",
                        "description": "前端配置字符串",
                        "example": ""
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "返回QwenImage训练任务启动结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "data": {
                        "type": "object",
                        "properties": {
                            "task_id": {
                                "type": "string",
                                "example": "qwenimage_task_123456",
                                "description": "QwenImage训练任务ID"
                            }
                        }
                    },
                    "message": {
                        "type": "string",
                        "example": "QwenImage training task qwenimage_task_123456 started successfully.",
                        "description": "成功消息"
                    }
                },
            },
        },
        "400": {
            "description": "请求无效，配置参数错误",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "message": {
                        "type": "string",
                        "example": "Training parameters validation failed: [error details]",
                        "description": "参数验证错误信息"
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
                        "example": "Failed to start training: [error details]",
                        "description": "服务器错误信息"
                    }
                },
            },
        },
    },
}