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
                                        "example": [960, 544]
                                    },
                                    "caption_extension": {
                                        "type": "string",
                                        "example": ".txt"
                                    },
                                    "batch_size": {
                                        "type": "integer",
                                        "example": 1
                                    },
                                    "num_repeats": {
                                        "type": "integer",
                                        "example": 1
                                    },
                                    "enable_bucket": {
                                        "type": "boolean",
                                        "example": True
                                    },
                                    "bucket_no_upscale": {
                                        "type": "boolean",
                                        "example": False
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
                                            "example": [960, 544]
                                        },
                                        "caption_extension": {
                                            "type": "string",
                                            "example": ".txt"
                                        },
                                        "batch_size": {
                                            "type": "integer",
                                            "example": 1
                                        },
                                        "num_repeats": {
                                            "type": "integer",
                                            "example": 1
                                        },
                                        "enable_bucket": {
                                            "type": "boolean",
                                            "example": True
                                        },
                                        "bucket_no_upscale": {
                                            "type": "boolean",
                                            "example": False
                                        },
                                        "cache_directory": {
                                            "type": "string",
                                            "example": "/path/to/cache"
                                        },
                                        "image_directory": {
                                            "type": "string",
                                            "example": "/path/to/images"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "config": {
                        "type": "object",
                        "properties": {
                            "async_upload": {"type": "boolean", "example": False},
                            "base_weights": {"type": "string", "example": "/path/to/base_weights"},
                            "base_weights_multiplier": {"type": "number", "example": 1.0},
                            "blocks_to_swap": {"type": "integer", "example": 1},
                            "clip": {"type": "string", "example": "/path/to/clip"},
                            "config_file": {"type": "string", "example": "/path/to/config_file"},
                            "ddp_gradient_as_bucket_view": {"type": "boolean", "example": False},
                            "ddp_static_graph": {"type": "boolean", "example": False},
                            "ddp_timeout": {"type": "integer", "example": 1800},
                            "dim_from_weights": {"type": "boolean", "example": False},
                            "discrete_flow_shift": {"type": "number", "example": 1.0},
                            "dit": {"type": "string", "example": "/path/to/dit"},
                            "flash3": {"type": "boolean", "example": False},
                            "flash_attn": {"type": "boolean", "example": False},
                            "fp8_base": {"type": "boolean", "example": False},
                            "fp8_scaled": {"type": "boolean", "example": False},
                            "fp8_t5": {"type": "boolean", "example": False},
                            "gradient_accumulation_steps": {"type": "integer", "example": 1},
                            "gradient_checkpointing": {"type": "boolean", "example": False},
                            "guidance_scale": {"type": "number", "example": 1.0},
                            "huggingface_path_in_repo": {"type": "string", "example": "/path/in/repo"},
                            "huggingface_repo_id": {"type": "string", "example": "repo_id"},
                            "huggingface_repo_type": {"type": "string", "example": "model"},
                            "huggingface_repo_visibility": {"type": "string", "example": "private"},
                            "huggingface_token": {"type": "string", "example": "token"},
                            "img_in_txt_in_offloading": {"type": "boolean", "example": False},
                            "learning_rate": {"type": "number", "example": 2e-06},
                            "log_config": {"type": "boolean", "example": False},
                            "log_prefix": {"type": "string", "example": "log_prefix"},
                            "log_tracker_config": {"type": "string", "example": "/path/to/tracker_config"},
                            "log_tracker_name": {"type": "string", "example": "tracker_name"},
                            "log_with": {"type": "string", "example": "tensorboard"},
                            "logging_dir": {"type": "string", "example": "/path/to/logging_dir"},
                            "logit_mean": {"type": "number", "example": 0.0},
                            "logit_std": {"type": "number", "example": 1.0},
                            "lr_decay_steps": {"type": "integer", "example": 0},
                            "lr_scheduler": {"type": "string", "example": "constant"},
                            "lr_scheduler_args": {"type": "string", "example": "T_max=100"},
                            "lr_scheduler_min_lr_ratio": {"type": "number", "example": 0.1},
                            "lr_scheduler_num_cycles": {"type": "integer", "example": 1},
                            "lr_scheduler_power": {"type": "number", "example": 1.0},
                            "lr_scheduler_timescale": {"type": "integer", "example": 1000},
                            "lr_scheduler_type": {"type": "string", "example": "custom_scheduler"},
                            "lr_warmup_steps": {"type": "integer", "example": 0},
                            "max_data_loader_n_workers": {"type": "integer", "example": 8},
                            "max_grad_norm": {"type": "number", "example": 1.0},
                            "max_timestep": {"type": "integer", "example": 1000},
                            "max_train_epochs": {"type": "integer", "example": 10},
                            "max_train_steps": {"type": "integer", "example": 10000},
                            "metadata_author": {"type": "string", "example": "author"},
                            "metadata_description": {"type": "string", "example": "description"},
                            "metadata_license": {"type": "string", "example": "license"},
                            "metadata_tags": {"type": "string", "example": "tag1,tag2"},
                            "metadata_title": {"type": "string", "example": "title"},
                            "min_timestep": {"type": "integer", "example": 0},
                            "mixed_precision": {"type": "string", "example": "bf16"},
                            "mode_scale": {"type": "number", "example": 1.29},
                            "network_alpha": {"type": "number", "example": 1.0},
                            "network_args": {"type": "string", "example": "key=value"},
                            "network_dim": {"type": "integer", "example": 128},
                            "network_dropout": {"type": "number", "example": 0.1},
                            "network_module": {"type": "string", "example": "network_module"},
                            "network_weights": {"type": "string", "example": "/path/to/network_weights"},
                            "no_metadata": {"type": "boolean", "example": False},
                            "optimizer_args": {"type": "string", "example": "weight_decay=0.01"},
                            "optimizer_type": {"type": "string", "example": "adamw"},
                            "output_dir": {"type": "string", "example": "/path/to/output_dir"},
                            "output_name": {"type": "string", "example": "output_name"},
                            "persistent_data_loader_workers": {"type": "boolean", "example": False},
                            "resume": {"type": "string", "example": "/path/to/resume"},
                            "resume_from_huggingface": {"type": "boolean", "example": False},
                            "sage_attn": {"type": "boolean", "example": False},
                            "sample_at_first": {"type": "boolean", "example": False},
                            "sample_every_n_epochs": {"type": "integer", "example": 1},
                            "sample_every_n_steps": {"type": "integer", "example": 1000},
                            "sample_prompts": {"type": "string", "example": "/path/to/sample_prompts"},
                            "save_every_n_epochs": {"type": "integer", "example": 1},
                            "save_every_n_steps": {"type": "integer", "example": 1000},
                            "save_last_n_epochs": {"type": "integer", "example": 5},
                            "save_last_n_epochs_state": {"type": "integer", "example": 5},
                            "save_last_n_steps": {"type": "integer", "example": 5000},
                            "save_last_n_steps_state": {"type": "integer", "example": 5000},
                            "save_state": {"type": "boolean", "example": False},
                            "save_state_on_train_end": {"type": "boolean", "example": False},
                            "save_state_to_huggingface": {"type": "boolean", "example": False},
                            "scale_weight_norms": {"type": "number", "example": 1.0},
                            "sdpa": {"type": "boolean", "example": False},
                            "seed": {"type": "integer", "example": 42},
                            "show_timesteps": {"type": "string", "example": "console"},
                            "sigmoid_scale": {"type": "number", "example": 1.0},
                            "split_attn": {"type": "boolean", "example": False},
                            "t5": {"type": "string", "example": "/path/to/t5"},
                            "task": {"type": "string", "example": "t2v-14B"},
                            "timestep_sampling": {"type": "string", "example": "sigma"},
                            "training_comment": {"type": "string", "example": "comment"},
                            "vae": {"type": "string", "example": "/path/to/vae"},
                            "vae_cache_cpu": {"type": "boolean", "example": False},
                            "vae_dtype": {"type": "string", "example": "float16"},
                            "wandb_api_key": {"type": "string", "example": "api_key"},
                            "wandb_run_name": {"type": "string", "example": "run_name"},
                            "weighting_scheme": {"type": "string", "example": "none"},
                            "xformers": {"type": "boolean", "example": False}
                        }
                    },
                    "frontend_config": {
                        "type": "string",
                        "example": "frontend_config"
                    },
                    "skip_cache_text_encoder_latent": {
                        "type": "bool",
                        "example": False
                    },
                    "skip_cache_latent": {
                        "type": "bool",
                        "example": False
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