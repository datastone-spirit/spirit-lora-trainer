# Wan 训练任务
wan_training_api_config = {
    "tags": ["Training"],
    "description": "启动Wan训练任务",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "dataset": {
                        "type": "object",
                        "properties": {
                            "general": {
                                "type": "object",
                                "properties": {
                                    "resolution": {
                                        "type": "array",
                                        "items": {"type": "integer"},
                                        "example": [960, 544],
                                        "description": "默认分辨率 [宽, 高]"
                                    },
                                    "caption_extension": {
                                        "type": "string",
                                        "example": ".txt",
                                        "description": "标注文件扩展名"
                                    },
                                    "batch_size": {
                                        "type": "integer",
                                        "example": 1,
                                        "description": "默认批次大小"
                                    },
                                    "num_repeats": {
                                        "type": "integer",
                                        "example": 1,
                                        "description": "默认重复次数"
                                    },
                                    "enable_bucket": {
                                        "type": "boolean",
                                        "example": True,
                                        "description": "启用分辨率分桶"
                                    },
                                    "bucket_no_upscale": {
                                        "type": "boolean",
                                        "example": False,
                                        "description": "不在分桶中上采样"
                                    }
                                }
                            },
                            "datasets": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "resolution": {
                                            "type": "array",
                                            "items": {"type": "integer"},
                                            "example": [960, 544],
                                            "description": "数据集分辨率 [宽, 高]"
                                        },
                                        "caption_extension": {
                                            "type": "string",
                                            "example": ".txt",
                                            "description": "标注文件扩展名"
                                        },
                                        "batch_size": {
                                            "type": "integer",
                                            "example": 1,
                                            "description": "批次大小"
                                        },
                                        "num_repeats": {
                                            "type": "integer",
                                            "example": 1,
                                            "description": "重复次数"
                                        },
                                        "enable_bucket": {
                                            "type": "boolean",
                                            "example": True,
                                            "description": "启用分辨率分桶"
                                        },
                                        "bucket_no_upscale": {
                                            "type": "boolean",
                                            "example": False,
                                            "description": "不在分桶中上采样图像"
                                        },
                                        "cache_directory": {
                                            "type": "string",
                                            "example": "/path/to/cache",
                                            "description": "缓存目录路径"
                                        },
                                        "image_directory": {
                                            "type": "string",
                                            "example": "/path/to/images",
                                            "description": "图像目录路径"
                                        },
                                        "image_jsonl_file": {
                                            "type": "string",
                                            "example": "/path/to/images.jsonl",
                                            "description": "图像JSONL文件路径"
                                        },
                                        "video_directory": {
                                            "type": "string",
                                            "example": "/path/to/videos",
                                            "description": "视频目录路径"
                                        },
                                        "video_jsonl_file": {
                                            "type": "string",
                                            "example": "/path/to/videos.jsonl",
                                            "description": "视频JSONL文件路径"
                                        },
                                        "target_frames": {
                                            "type": "array",
                                            "items": {"type": "integer"},
                                            "example": [1, 25, 79],
                                            "description": "目标帧列表"
                                        },
                                        "frame_extraction": {
                                            "type": "string",
                                            "enum": ["head", "chunk", "slide", "uniform", "full"],
                                            "example": "chunk",
                                            "description": "帧提取方法"
                                        },
                                        "frame_stride": {
                                            "type": "integer",
                                            "example": 4,
                                            "description": "适用于slide方法的帧步长"
                                        },
                                        "frame_sample": {
                                            "type": "integer",
                                            "example": 8,
                                            "description": "适用于uniform方法的采样帧数"
                                        },
                                        "max_frames": {
                                            "type": "integer",
                                            "example": 129,
                                            "description": "适用于full方法的最大帧数"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "config": {
                        "type": "object",
                        "properties": {
                            "async_upload": {"type": "boolean", "example": False, "description": "异步上传到HuggingFace"},
                            "base_weights": {"type": "string", "example": "/path/to/base_weights", "description": "训练前要合并的网络权重"},
                            "base_weights_multiplier": {"type": "number", "example": 1.0, "description": "基础权重合并倍数"},
                            "blocks_to_swap": {"type": "integer", "example": 1, "description": "要交换的块数量"},
                            "clip": {"type": "string", "example": "/path/to/clip", "description": "文本编码器(CLIP)检查点路径"},
                            "config_file": {"type": "string", "example": "/path/to/config_file", "description": "使用.toml配置文件而非参数"},
                            "dataset_config": {"type": "string", "example": "/path/to/dataset_config", "description": "数据集配置文件"},
                            "ddp_gradient_as_bucket_view": {"type": "boolean", "example": False, "description": "DDP梯度桶视图"},
                            "ddp_static_graph": {"type": "boolean", "example": False, "description": "DDP静态图"},
                            "ddp_timeout": {"type": "integer", "example": 1800, "description": "DDP超时(分钟)"},
                            "dim_from_weights": {"type": "boolean", "example": False, "description": "从权重自动确定维度"},
                            "discrete_flow_shift": {"type": "number", "example": 1.0, "description": "离散流偏移"},
                            "dit": {"type": "string", "example": "/path/to/dit", "description": "DiT检查点路径"},
                            "dit_high_noise": {"type": "string", "example": "/path/to/dit_high_noise", "description": "高噪声DiT检查点路径"},
                            "dynamo_backend": {"type": "string", "example": "inductor", "description": "Dynamo后端类型"},
                            "dynamo_dynamic": {"type": "boolean", "example": False, "description": "使用动态Dynamo"},
                            "dynamo_fullgraph": {"type": "boolean", "example": False, "description": "使用全图Dynamo"},
                            "dynamo_mode": {"type": "string", "example": "default", "description": "Dynamo模式"},
                            "flash3": {"type": "boolean", "example": False, "description": "使用FlashAttention 3"},
                            "flash_attn": {"type": "boolean", "example": False, "description": "使用FlashAttention"},
                            "fp8_base": {"type": "boolean", "example": False, "description": "对基础模型使用fp8"},
                            "fp8_scaled": {"type": "boolean", "example": False, "description": "使用缩放fp8"},
                            "fp8_t5": {"type": "boolean", "example": False, "description": "对T5文本编码器使用fp8"},
                            "gradient_accumulation_steps": {"type": "integer", "example": 1, "description": "梯度累积步数"},
                            "gradient_checkpointing": {"type": "boolean", "example": False, "description": "启用梯度检查点"},
                            "guidance_scale": {"type": "number", "example": 1.0, "description": "嵌入式分类器无关引导缩放"},
                            "huggingface_path_in_repo": {"type": "string", "example": "/path/in/repo", "description": "HuggingFace仓库中的路径"},
                            "huggingface_repo_id": {"type": "string", "example": "repo_id", "description": "HuggingFace仓库ID"},
                            "huggingface_repo_type": {"type": "string", "example": "model", "description": "HuggingFace仓库类型"},
                            "huggingface_repo_visibility": {"type": "string", "example": "private", "description": "HuggingFace仓库可见性"},
                            "huggingface_token": {"type": "string", "example": "token", "description": "HuggingFace访问令牌"},
                            "img_in_txt_in_offloading": {"type": "boolean", "example": False, "description": "将img_in和txt_in卸载到CPU"},
                            "learning_rate": {"type": "number", "example": 2e-06, "description": "学习率"},
                            "log_config": {"type": "boolean", "example": False, "description": "记录训练配置"},
                            "log_prefix": {"type": "string", "example": "log_prefix", "description": "日志目录前缀"},
                            "log_tracker_config": {"type": "string", "example": "/path/to/tracker_config", "description": "日志跟踪器配置路径"},
                            "log_tracker_name": {"type": "string", "example": "tracker_name", "description": "日志跟踪器名称"},
                            "log_with": {"type": "string", "example": "tensorboard", "description": "日志记录工具"},
                            "logging_dir": {"type": "string", "example": "/path/to/logging_dir", "description": "日志目录"},
                            "logit_mean": {"type": "number", "example": 0.0, "description": "logit_normal权重方案的均值"},
                            "logit_std": {"type": "number", "example": 1.0, "description": "logit_normal权重方案的标准差"},
                            "lr_decay_steps": {"type": "integer", "example": 0, "description": "学习率衰减步数"},
                            "lr_scheduler": {"type": "string", "example": "constant", "description": "学习率调度器"},
                            "lr_scheduler_args": {"type": "string", "example": "T_max=100", "description": "学习率调度器参数"},
                            "lr_scheduler_min_lr_ratio": {"type": "number", "example": 0.1, "description": "最小学习率比率"},
                            "lr_scheduler_num_cycles": {"type": "integer", "example": 1, "description": "cosine调度器重启次数"},
                            "lr_scheduler_power": {"type": "number", "example": 1.0, "description": "多项式调度器幂次"},
                            "lr_scheduler_timescale": {"type": "integer", "example": 1000, "description": "逆平方根调度器时间尺度"},
                            "lr_scheduler_type": {"type": "string", "example": "custom_scheduler", "description": "自定义调度器模块"},
                            "lr_warmup_steps": {"type": "integer", "example": 0, "description": "学习率预热步数"},
                            "max_data_loader_n_workers": {"type": "integer", "example": 8, "description": "数据加载器最大工作进程数"},
                            "max_grad_norm": {"type": "number", "example": 1.0, "description": "最大梯度裁剪"},
                            "max_timestep": {"type": "integer", "example": 1000, "description": "最大时间步"},
                            "max_train_epochs": {"type": "integer", "example": 10, "description": "最大训练轮数"},
                            "max_train_steps": {"type": "integer", "example": 1600, "description": "最大训练步数"},
                            "metadata_author": {"type": "string", "example": "author", "description": "模型元数据作者"},
                            "metadata_description": {"type": "string", "example": "description", "description": "模型元数据描述"},
                            "metadata_license": {"type": "string", "example": "license", "description": "模型元数据许可证"},
                            "metadata_tags": {"type": "string", "example": "tag1,tag2", "description": "模型元数据标签"},
                            "metadata_title": {"type": "string", "example": "title", "description": "模型元数据标题"},
                            "min_timestep": {"type": "integer", "example": 0, "description": "最小时间步"},
                            "mixed_precision": {"type": "string", "example": "bf16", "description": "混合精度设置", "enum": ["no", "fp16", "bf16"]},
                            "mode_scale": {"type": "number", "example": 1.29, "description": "mode权重方案的缩放因子"},
                            "network_alpha": {"type": "number", "example": 1.0, "description": "LoRA权重缩放Alpha值"},
                            "network_args": {"type": "string", "example": "key=value", "description": "网络额外参数"},
                            "network_dim": {"type": "integer", "example": 128, "description": "网络维度"},
                            "network_dropout": {"type": "number", "example": 0.1, "description": "网络dropout率"},
                            "network_module": {"type": "string", "example": "networks.lora_wan", "description": "要训练的网络模块"},
                            "network_weights": {"type": "string", "example": "/path/to/network_weights", "description": "预训练网络权重"},
                            "no_metadata": {"type": "boolean", "example": False, "description": "不保存元数据"},
                            "offload_inactive_dit": {"type": "boolean", "example": False, "description": "将非活跃DiT模型卸载到CPU"},
                            "one_frame": {"type": "boolean", "example": False, "description": "使用单帧采样方法生成样本"},
                            "optimizer_args": {"type": "string", "example": "weight_decay=0.01", "description": "优化器额外参数"},
                            "optimizer_type": {"type": "string", "example": "adamw", "description": "优化器类型"},
                            "output_dir": {"type": "string", "example": "/path/to/output_dir", "description": "输出目录"},
                            "output_name": {"type": "string", "example": "output_name", "description": "输出模型文件基本名称"},
                            "persistent_data_loader_workers": {"type": "boolean", "example": False, "description": "持久化数据加载器工作进程"},
                            "preserve_distribution_shape": {"type": "boolean", "example": False, "description": "保持时间步分布形状"},
                            "resume": {"type": "string", "example": "/path/to/resume", "description": "恢复训练的状态路径"},
                            "resume_from_huggingface": {"type": "boolean", "example": False, "description": "从HuggingFace恢复训练"},
                            "sage_attn": {"type": "boolean", "example": False, "description": "使用SageAttention"},
                            "sample_at_first": {"type": "boolean", "example": False, "description": "训练前生成样本"},
                            "sample_every_n_epochs": {"type": "integer", "example": 1, "description": "每N轮生成样本"},
                            "sample_every_n_steps": {"type": "integer", "example": 1000, "description": "每N步生成样本"},
                            "sample_prompts": {"type": "string", "example": "/path/to/sample_prompts", "description": "样本提示词文件路径"},
                            "save_every_n_epochs": {"type": "integer", "example": 1, "description": "每N轮保存检查点"},
                            "save_every_n_steps": {"type": "integer", "example": 1000, "description": "每N步保存检查点"},
                            "save_last_n_epochs": {"type": "integer", "example": 5, "description": "保留最后N个epoch检查点"},
                            "save_last_n_epochs_state": {"type": "integer", "example": 5, "description": "保留最后N个epoch状态"},
                            "save_last_n_steps": {"type": "integer", "example": 5000, "description": "保留最后N个step检查点"},
                            "save_last_n_steps_state": {"type": "integer", "example": 5000, "description": "保留最后N个step状态"},
                            "save_state": {"type": "boolean", "example": False, "description": "保存训练状态"},
                            "save_state_on_train_end": {"type": "boolean", "example": False, "description": "训练结束时保存状态"},
                            "save_state_to_huggingface": {"type": "boolean", "example": False, "description": "保存状态到HuggingFace"},
                            "scale_weight_norms": {"type": "number", "example": 1.0, "description": "权重范数缩放"},
                            "sdpa": {"type": "boolean", "example": False, "description": "使用SDPA"},
                            "seed": {"type": "integer", "example": 42, "description": "随机种子"},
                            "show_timesteps": {"type": "string", "example": "console", "description": "显示时间步分布", "enum": ["image", "console"]},
                            "sigmoid_scale": {"type": "number", "example": 1.0, "description": "sigmoid时间步采样缩放因子"},
                            "split_attn": {"type": "boolean", "example": False, "description": "使用分割注意力"},
                            "t5": {"type": "string", "example": "/path/to/t5", "description": "文本编码器(T5)检查点路径"},
                            "task": {"type": "string", "example": "t2v-14B", "description": "要运行的任务", "enum": ["t2v-14B", "i2v-14B", "i2v-A14B", "t2v-A14B"]},
                            "timestep_boundary": {"type": "integer", "example": 500, "description": "高低噪声模型切换时间步边界"},
                            "timestep_sampling": {"type": "string", "example": "sigma", "description": "时间步采样方法", "enum": ["sigma", "uniform", "sigmoid", "shift", "flux_shift"]},
                            "training_comment": {"type": "string", "example": "comment", "description": "训练注释"},
                            "vae": {"type": "string", "example": "/path/to/vae", "description": "VAE检查点路径"},
                            "vae_cache_cpu": {"type": "boolean", "example": False, "description": "在CPU上缓存VAE特征"},
                            "vae_dtype": {"type": "string", "example": "float16", "description": "VAE数据类型"},
                            "wandb_api_key": {"type": "string", "example": "api_key", "description": "WandB API密钥"},
                            "wandb_run_name": {"type": "string", "example": "run_name", "description": "WandB运行名称"},
                            "weighting_scheme": {"type": "string", "example": "none", "description": "时间步分布权重方案", "enum": ["none", "logit_normal", "mode", "cosine"]},
                            "xformers": {"type": "boolean", "example": False, "description": "使用xformers"}
                        }
                    },
                    "frontend_config": {
                        "type": "string",
                        "example": "frontend_config",
                        "description": "前端配置字符串"
                    },
                    "skip_cache_text_encoder_latent": {
                        "type": "boolean",
                        "example": False,
                        "description": "跳过缓存文本编码器潜在变量步骤"
                    },
                    "skip_cache_latent": {
                        "type": "boolean",
                        "example": False,
                        "description": "跳过缓存潜在变量步骤"
                    },
                    "dit_model_type": {
                        "type": "string",
                        "example": "low",
                        "description": "DiT模型类型",
                        "enum": ["low", "high", "both"]
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "返回训练任务启动结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "task_id": {"type": "string", "example": "id of the task"},
                    "msg": {"type": "string", "example": "训练任务已启动"}
                }
            }
        },
        "400": {
            "description": "请求无效，训练参数错误",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "训练参数错误"}
                }
            }
        },
        "500": {
            "description": "服务器错误，训练启动失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "训练启动失败"}
                }
            }
        }
    }
}

wan_dataset_estimate = {
    "tags": ["Dataset"],
    "description": "Estimate the number of images that will be extracted from videos in the dataset",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "general": {
                        "type": "object",
                        "properties": {
                            "resolution": {
                                "type": "array",
                                "items": {"type": "integer"},
                                "example": [960, 544],
                                "description": "Resolution [width, height] for the dataset"
                            },
                            "caption_extension": {
                                "type": "string",
                                "example": ".txt",
                                "description": "File extension for caption files"
                            },
                            "batch_size": {
                                "type": "integer",
                                "example": 1,
                                "description": "Batch size for training"
                            },
                            "num_repeats": {
                                "type": "integer",
                                "example": 1,
                                "description": "Number of times to repeat each image in dataset"
                            },
                            "enable_bucket": {
                                "type": "boolean",
                                "example": True,
                                "description": "Enable resolution buckets"
                            },
                            "bucket_no_upscale": {
                                "type": "boolean",
                                "example": False,
                                "description": "Don't upscale images in buckets"
                            }
                        }
                    },
                    "datasets": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "video_directory": {
                                    "type": "string",
                                    "example": "/path/to/videos",
                                    "description": "Directory containing video files"
                                },
                                "image_directory": {
                                    "type": "string",
                                    "example": "/path/to/images",
                                    "description": "Directory containing image files"
                                },
                                "frame_extraction": {
                                    "type": "string",
                                    "enum": ["head", "chunk", "slide", "uniform", "full"],
                                    "example": "chunk",
                                    "description": "Method for extracting frames from videos"
                                },
                                "target_frames": {
                                    "type": "array",
                                    "items": {"type": "integer"},
                                    "example": [1, 25, 79],
                                    "description": "List of frame indices to extract"
                                },
                                "frame_stride": {
                                    "type": "integer",
                                    "example": 4,
                                    "description": "Step size for slide extraction method"
                                },
                                "frame_sample": {
                                    "type": "integer",
                                    "example": 8,
                                    "description": "Number of frames to sample for uniform method"
                                },
                                "max_frames": {
                                    "type": "integer",
                                    "example": 129,
                                    "description": "Maximum number of frames to extract for full method"
                                }
                            }
                        }
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully estimated frame count",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": "true"},
                    "message": {"type": "string", "example": "Ok"},
                    "data": {
                        "type": "object",
                        "properties": {
                            "total_images": {
                                "type": "integer", 
                                "example": 1250,
                                "description": "Total estimated number of images/frames"
                            },
                            "total_batches": {
                                "type": "integer", 
                                "example": 1250,
                                "description": "Total estimated number of images/frames"
                            }
                        }
                    },
                    "code": {"type": "integer", "example": 200}
                }
            }
        },
        "500": {
            "description": "Server error while estimating frame count",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": "false"},
                    "message": {"type": "string", "example": "Server internal error: [error details]"},
                    "code": {"type": "integer", "example": 500}
                }
            }
        }
    }
}