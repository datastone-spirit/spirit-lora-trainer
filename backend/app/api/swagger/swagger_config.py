# 查询目录结构
file_config = {
    "tags": ["Directory"],
    "description": "获取指定目录下的当前层级的文件和目录结构，支持懒加载",
    "parameters": [
        {
            "name": "path",
            "in": "query",
            "type": "string",
            "required": True,
            "default": "/",
            "description": "当前路径",
        },
        {
            "name": "is_dir",
            "in": "query",
            "type": "string",
            "required": False,
            "default": "true",
            "description": "是否是目录 默认true 只返回目录 不返回文件",
        },
    ],
    "responses": {
        "200": {
            "description": "返回目录信息",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "description": "返回状态码",
                        "example": 0,
                    },
                    "msg": {
                        "type": "string",
                        "description": "返回消息",
                        "example": "ok",
                    },
                    "data": {
                        "type": "array",
                        "description": "目录和文件列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "value": {
                                    "type": "string",
                                    "description": "目录或文件路径",
                                    "example": "/subdir1",
                                },
                                "label": {
                                    "type": "string",
                                    "description": "目录或文件名称",
                                    "example": "subdir1",
                                },
                                "isLeaf": {
                                    "type": "boolean",
                                    "description": "是否为叶子节点",
                                    "example": False,
                                },
                            },
                        },
                    },
                },
            },
        }
    },
}

file_check_config = {
    "tags": ["Directory"],
    "description": "检测目录是否存在以及是否有数据",
    "parameters": [
        {
            "name": "path",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "需要检测的目录路径",
        },
        {
            "name": "has_data",
            "in": "query",
            "type": "boolean",
            "required": False,
            "default": False,
            "description": "是否检查目录中是否有数据",
        },
    ],
    "responses": {
        "200": {
            "description": "返回目录检测结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {
                        "type": "boolean",
                        "description": "是否成功",
                        "example": True,
                    },
                    "message": {
                        "type": "string",
                        "description": "返回信息",
                        "example": "目录存在且有数据",
                    },
                    "data": {
                        "type": "object",
                        "properties": {
                            "exists": {
                                "type": "boolean",
                                "description": "目录是否存在",
                                "example": True,
                            },
                            "has_data": {
                                "type": "boolean",
                                "description": "目录是否有数据",
                                "example": True,
                            },
                        },
                    },
                },
            },
        }
    },
}

# 获取打标文件夹中的图片和txt文件
tag_dir_config = {
    "tags": ["Directory"],
    "description": "获取指定目录中的图片文件和txt文件信息，按名称关联",
    "parameters": [
        {
            "name": "path",
            "in": "query",
            "type": "string",
            "required": True,
            "default": "/",
            "description": "当前目录路径",
        }
    ],
    "responses": {
        "200": {
            "description": "返回目录中的图片和txt文件配对信息",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "description": "返回状态码",
                        "example": 0,
                    },
                    "message": {
                        "type": "string",
                        "description": "返回消息",
                        "example": "ok",
                    },
                    "data": {
                        "type": "array",
                        "description": "图片和txt文件配对信息列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "image_path": {
                                    "type": "string",
                                    "description": "图片文件路径",
                                    "example": "/path/to/image.png",
                                },
                                "txt_path": {
                                    "type": "string",
                                    "description": "TXT文件路径",
                                    "example": "/path/to/image.txt",
                                },
                                "image_name": {
                                    "type": "string",
                                    "description": "图片文件名称",
                                    "example": "image.png",
                                },
                                "txt_name": {
                                    "type": "string",
                                    "description": "TXT文件名称",
                                    "example": "image.txt",
                                },
                                "txt_content": {
                                    "type": "string",
                                    "description": "TXT文件内容",
                                    "example": "This is the content of the text file.",
                                },
                            },
                        },
                    },
                },
            },
        }
    },
}

#删除文件
delete_file_config = {
  "tags": ["Directory"],
  "description": "删除指定路径的文件",
  "parameters": [
    {
      "name": "file_path",
      "in": "query",
      "type": "string",
      "required": True,
      "description": "需要删除的文件的完整路径",
      "example": "/home/user/documents/example.txt"
    }
  ],
  "responses": {
    "200": {
      "description": "文件删除成功",
      "schema": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": True,
            "description": "操作是否成功"
          },
          "message": {
            "type": "string",
            "example": "文件已删除: /home/user/documents/example.txt",
            "description": "操作的详细信息"
          },
          "code": {
            "type": "integer",
            "description": "返回状态码",
            "example": 0,
          },
          "data": {
            "type": "null",
            "description": "",
            "example": 'null',
          },
        }
      }
    },
    "400": {
      "description": "请求参数错误或文件不存在",
      "schema": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": False,
            "description": "操作是否成功"
          },
          "message": {
            "type": "string",
            "example": "文件不存在: /home/user/documents/example.txt",
            "description": "错误的详细信息"
          }
        }
      }
    },
    "500": {
      "description": "服务器错误，删除失败",
      "schema": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": False,
            "description": "操作是否成功"
          },
          "message": {
            "type": "string",
            "example": "删除文件失败: 权限不足",
            "description": "错误的详细信息"
          }
        }
      }
    }
  }
}

# 预览图片文件
preview_file_config = {
        "tags": ["Directory"],
        "description": "获取图片内容",
        "parameters": [
            {
                "name": "image_path",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "图片文件的路径",
                "example": "/path/to/image.jpg"
            },
            {
                "name": "compress",
                "in": "query",
                "type": "string",
                "required": False,
                "description": "是否压缩 默认false->不压缩 true->压缩",
                "example": "compress=false"
            }
        ],
        "responses": {
            "200": {
                "description": "成功返回图片内容",
                "schema": {
                    "type": "file",
                    "description": "图片文件内容"
                }
            },
            "400": {
                "description": "请求参数错误或文件不存在",
                "schema": {
                    "type": "object",
                    "properties": {
                        "success": {
                            "type": "boolean",
                            "example": False
                        },
                        "message": {
                            "type": "string",
                            "example": "文件不存在: path/to/image.jpg"
                        }
                    }
                }
            },
            "500": {
                "description": "服务器错误，返回图片失败",
                "schema": {
                    "type": "object",
                    "properties": {
                        "success": {
                            "type": "boolean",
                            "example": False
                        },
                        "message": {
                            "type": "string",
                            "example": "无法返回图片: 权限不足"
                        }
                    }
                }
            }
        }
    }


# 文件上传
upload_config = {
    "tags": ["Upload"],
    "description": "上传多个图片文件，支持同时上传多个图片，并返回文件名、文件路径、上传时间等信息，支持查询上传进度",
    "parameters": [
        {
            "name": "files",
            "in": "formData",
            "type": "file",
            "required": True,
            "description": "上传的图片文件，支持同时上传多个文件",
        },
        {
            "name": "upload_path",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "上传的文件路径，用于指定上传的文件存储位置",
        },
        {
            "name": "upload_id",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "由请求方生成的唯一的 upload_id，标识这一批上传的文件",
        },
    ],
    "responses": {
        "200": {
            "description": "文件上传成功",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 0},
                    "msg": {"type": "string", "example": "上传成功"},
                    "data": {
                        "type": "array",
                        "description": "上传的图片信息列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "filename": {"type": "string", "example": "image1.jpg"},
                                "path": {
                                    "type": "string",
                                    "example": "/uploads/images/image1.jpg",
                                },
                                "upload_time": {
                                    "type": "string",
                                    "example": "2024-12-05T08:30:00",
                                },
                            },
                        },
                    },
                },
            },
        },
        "400": {
            "description": "文件上传失败",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 1},
                    "msg": {"type": "string", "example": "上传失败"},
                },
            },
        },
    },
}


tag_config = {
    "tags": ["Training"],
    "description": "打标多张图片",
    "parameters": [{
        "name": "tagging",
        "in": "body",
        "required": True,
        "schema":{
            "type": "object",
            "properties": {
               "model_name": {
                    "type": "string",
                    "description": "模型名称，用于选择相应的打标方式",
               },
               "image_path": {
                    "type": "string",
                    "description": "要打标的图片文件夹路径",
               },
               "class_token": {
                    "type": "string",
                    "description": "token of class, if it is not empty, the class token will be written before the caption text, split by comma",
               },
               "prompt_type": {
                    "type": "string",
                    "description": "dedicated to joy-caption-alpha-two, valid value are:\n- Descriptive\n - Training Prompt\n- \"MidJourney\"\n- \"Booru tag list\"\n- \"Booru-like tag list\"\n- \"Art Critic\"\n- \"Product Listing\"\n- \"Social Media Post\":"
               }
            }
        }
    }],
    "responses": {
        "200": {
            "description": "返回训练任务启动结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "task_id": {
                        "type": "string",
                        "example": "id of the task",
                    },
                    "msg": {
                        "type": "string",
                        "example": "训练任务已启动",
                    }
                },
            },
        },
        "400": {
            "description": "请求无效，配置文件不存在或读取失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {
                        "type": "string",
                        "example": "配置文件不存在",
                    },
                },
            },
        },
        "500": {
            "description": "服务器错误，训练启动失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {
                        "type": "string",
                        "example": "训练启动失败",
                    },
                },
            },
        },
    },
}


tag_manual_config = {
    "tags": ["Training"],
    "description": "手动打标单张图片",
    "parameters": [
        {
            "name": "image_path",
            "in": "body",
            "type": "string",
            "required": True,
            "description": "打标图片的完整路径",
        },
        {
            "name": "caption_text",
            "in": "body",
            "type": "string",
            "required": True,
            "description": "图片标注文本",
        },
    ],
    "responses": {
        "200": {
            "description": "返回打标结果",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 0},
                    "msg": {"type": "string", "example": "打标成功"},
                    "data": {
                        "type": "object",
                        "description": "打标结果数据",
                        "properties": {
                            "image_path": {
                                "type": "string",
                                "description": "图片路径",
                                "example": "/images/image1.jpg",
                            },
                            "caption_text": {
                                "type": "string",
                                "description": "图片的打标文本",
                                "example": "A scenic view of a waterfall surrounded by lush greenery.",
                            },
                            "txt_path": {
                                "type": "string",
                                "description": "保存的打标文件路径",
                                "example": "/captions_output/image1.txt",
                            },
                        },
                    },
                },
            },
        },
        "400": {
            "description": "手动打标失败",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 1},
                    "msg": {"type": "string", "example": "打标失败，参数错误"},
                },
            },
        },
    },
}

# 启动训练任务
start_training = {
  "tags": ["Training"],
   "description": "启动训练任务",
  "parameters": [
    {
      "name": "config",
      "in": "body",
      "required": True,
      "description": "包含所有训练配置的对象",
      "schema": {
        "type": "object",
        "properties": {
          "output_name": { "type": "string", "example": "" },
          "class_tokens": { "type": "string", "example": "" },
          "pretrained_model_name_or_path": { "type": "string", "example": "" },
          "ae": { "type": "string", "example": "" },
          "clip_l": { "type": "string", "example": "" },
          "t5xxl": { "type": "string", "example": "" },
          "resume": { "type": "string", "example": "" },
          "output_dir": { "type": "string", "example": "" },
          "save_model_as": { "type": "string", "example": "" },
          "save_precision": { "type": "string", "example": "" },
          "save_state": { "type": "boolean", "example": False },
          "train_data_dir": { "type": "string", "example": "" },
          "num_repeats": { "type": "integer", "example": 10 },
          "max_train_epochs": { "type": "integer", "example": 10 },
          "train_batch_size": { "type": "integer", "example": 1 },
          "resolution_width": { "type": "integer", "example": 768 },
          "resolution_height": { "type": "integer", "example": 768 },
          "enable_bucket": { "type": "boolean", "example": True },
          "min_bucket_reso": { "type": "integer", "example": 256 },
          "max_bucket_reso": { "type": "integer", "example": 2048 },
          "bucket_reso_steps": { "type": "integer", "example": 32 },
          "bucket_no_upscale": { "type": "boolean", "example": True },
          "seed": { "type": "integer", "example": 1337 },
          "max_data_loader_n_workers": { "type": "integer", "example": 2 },
          "learning_rate": { "type": "string", "example": "1e-4" },
          "save_every_n_epochs": { "type": "integer", "example": 2 },
          "guidance_scale": { "type": "integer", "example": 1 },
          "timestep_sampling": { "type": "string", "example": "sigmoid" },
          "network_dim": { "type": "integer", "example": 2 },
          "sigmoid_scale": { "type": "integer", "example": 1 },
          "model_prediction_type": { "type": "string", "example": "raw" },
          "discrete_flow_shift": { "type": "integer", "example": 3 },
          "loss_type": { "type": "string", "example": "l2" },
          "gradient_checkpointing": { "type": "boolean", "example": True },
          "gradient_accumulation_steps": { "type": "integer", "example": 1 },
          "network_train_unet_only": { "type": "boolean", "example": True },
          "network_train_text_encoder_only": { "type": "boolean", "example": False },
          "unet_lr": { "type": "string", "example": "5e-4" },
          "text_encoder_lr": { "type": "number", "example": "0.00001" },
          "lr_scheduler": { "type": "string", "example": "cosine_with_restarts" },
          "lr_warmup_steps": { "type": "integer", "example": 1 },
          "lr_scheduler_num_cycles": { "type": "integer", "example": 1 },
          "optimizer_type": { "type": "string", "example": "PagedAdamW8bit" },
          "optimizer_args_custom": {
            "type": "string",
            "example": ""
          },
          "network_module": { "type": "string", "example": "networks.lora_flux" },
          "network_weights": { "type": "string", "example": "" },
          "network_alpha": { "type": "integer", "example": 16 },
          "network_dropout": { "type": "integer", "example": 0 },
          "network_args_custom": {
            "type": "string",
            "example": ""
          },
          "enable_base_weight": { "type": "boolean", "example": False },
          "base_weights": {
            "type": "string",
            "example": ""
          },
          "base_weights_multiplier": { "type": "number", "example": "" },
          "enable_preview": { "type": "boolean", "example": False },
          "log_with": { "type": "string", "example": "tensorboard" },
          "log_prefix": { "type": "string", "example": "" },
          "log_tracker_name": { "type": "string", "example": "" },
          "logging_dir": { "type": "string", "example": "./logs" },
          "caption_extension": { "type": "string", "example": ".txt" },
          "shuffle_caption": { "type": "boolean", "example": False },
          "weighted_captions": { "type": "boolean", "example": False },
          "keep_tokens": { "type": "integer", "example": 0 },
          "keep_tokens_separator": { "type": "string", "example": "" },
          "color_aug": { "type": "boolean", "example": False },
          "flip_aug": { "type": "boolean", "example": False },
          "random_crop": { "type": "boolean", "example": False },
          "clip_skip": { "type": "integer", "example": 2 },
          "ui_custom_params": { "type": "string", "example": "" },
          "mixed_precision": { "type": "string", "example": "bf16" },
          "full_fp16": { "type": "boolean", "example": False },
          "full_bf16": { "type": "boolean", "example": False },
          "fp8_base": { "type": "boolean", "example": True },
          "fp8_base_unet": { "type": "boolean", "example": False },
          "no_half_vae": { "type": "boolean", "example": False },
          "sdpa": { "type": "boolean", "example": True },
          "lowram": { "type": "boolean", "example": False },
          "cache_latents": { "type": "boolean", "example": True },
          "cache_latents_to_disk": { "type": "boolean", "example": True },
          "cache_text_encoder_outputs": { "type": "boolean", "example": True },
          "cache_text_encoder_outputs_to_disk": { "type": "boolean", "example": True },
          "persistent_data_loader_workers": { "type": "boolean", "example": True },
          "ddp_gradient_as_bucket_view": { "type": "boolean", "example": False }
        }
      }
    },
    {
  "name": "dataset",
  "in": "body",
  "required": True,
  "description": "包含训练配置的对象",
  "schema": {
    "type": "object",
    "properties": {
      "general": {
        "type": "object",
        "properties": {
          "shuffle_caption": {
            "type": "boolean",
            "example": False
          },
          "caption_extension": {
            "type": "string",
            "example": ".txt"
          },
          "keep_tokens": {
            "type": "integer",
            "example": 1
          }
        }
      },
      "datasets": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "resolution": {
              "type": "integer",
              "example": 512
            },
            "batch_size": {
              "type": "integer",
              "example": 1
            },
            "keep_tokens": {
              "type": "integer",
              "example": 1
            },
            "subsets": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "class_tokens": {
                    "type": "string",
                    "example": "abc"
                  },
                  "image_dir": {
                    "type": "string",
                    "example": "/upload/image"
                  },
                  "num_repeats": {
                    "type": "integer",
                    "example": 10
                  }
                }
              }
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
            "description": "返回训练任务启动结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "task_id": {
                        "type": "string",
                        "example": "id of the task",
                    },
                    "msg": {
                        "type": "string",
                        "example": "训练任务已启动",
                    }
                },
            },
        },
        "400": {
            "description": "请求无效，配置文件不存在或读取失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {
                        "type": "string",
                        "example": "配置文件不存在",
                    },
                },
            },
        },
        "500": {
            "description": "服务器错误，训练启动失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {
                        "type": "string",
                        "example": "训练启动失败",
                    },
                },
            },
        },
    }
}

gpu_log_config = {
  "tags": ["Training"],
  "description": "获取 GPU 的功耗、显存和名称等信息，每块 GPU 以 gpu_index 为键值。",
  "responses": {
    "200": {
      "description": "成功获取 GPU 信息",
      "schema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "gpu_index": {
              "type": "integer",
              "example": 0,
              "description": "GPU 的索引"
            },
            "gpu_name": {
              "type": "string",
              "example": "NVIDIA GeForce RTX 4090",
              "description": "GPU 的名称"
            },
            "power_draw_watts": {
              "type": "number",
              "format": "float",
              "example": 35.56,
              "description": "GPU 当前功耗（瓦特）"
            },
            "power_total_watts": {
              "type": "number",
              "format": "float",
              "example": 450,
              "description": "GPU 总功耗（瓦特）"
            },
            "memory_total_mb": {
              "type": "number",
              "format": "float",
              "example": 8192,
              "description": "GPU 总显存大小（MB）"
            },
            "memory_used_mb": {
              "type": "number",
              "format": "float",
              "example": 2048,
              "description": "GPU 已使用的显存大小（MB）"
            },
            "memory_free_mb": {
              "type": "number",
              "format": "float",
              "example": 6144,
              "description": "GPU 剩余的显存大小（MB）"
            }
          }
        }
      }
    },
    "500": {
      "description": "无法获取 GPU 信息，可能是 nvidia-smi 未安装或系统错误",
      "schema": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "example": "nvidia-smi not found",
            "description": "错误信息"
          }
        }
      }
    }
  }
}

task_history = {
    "tags": ["Task"],
    "description": "通过id获取Task的信息",
    "parameters": [
        {
            "name": "task_id",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "任务的唯一标识",
        }
    ],
    "responses": {
        "200": {
            "description": "成功返回task_id 所标识的任务务信息",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "message": {"type": "string", "example": "current has no task to run"},
                    "data": {
                      "type": "object",
                      "description": "当前任务信息",
                      "properties": {
                        "id": {
                          "type": "string",
                          "description": "任务 ID",
                          "example": "1234567890abcdef"
                        },
                        "status": {
                            "type": "string",
                            "description": "任务状态",
                            "example": "running"
                        },
                        "task_type": {
                          "type": "string",
                          "description": "任务类型",
                          "example": "training"
                        },
                        "detail": {
                          "type": "object",
                          "description": "任务详情",
                          "example": {
                            "progress": 50,
                            "current": 20,
                            "total": 40,
                            "elapsed": "00:21",
                            "remaining": "00:21",
                            "speed": 1.07,
                            "loss": 0.145
                          }
                        }
                      }
                    }
                }
            }
        },
        "404": {
            "description": "当前没有正在运行的任务",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "current has no task to run"}
                }
            }
        },
        "500": {
            "description": "服务器错误，获取任务信息失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "get current task failed"}
                }
            }
        }
    }
}

task_current = {
    "tags": ["Task"],
    "description": "获取当前正在运行的任务信息",
    "responses": {
        "200": {
            "description": "成功获取当前任务信息",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "message": {"type": "string", "example": "current has no task to run"},
                    "data": {
                      "type": "object",
                      "description": "当前任务信息",
                      "properties": {
                        "id": {
                          "type": "string",
                          "description": "任务 ID",
                          "example": "1234567890abcdef"
                        },
                        "status": {
                            "type": "string",
                            "description": "任务状态",
                            "example": "running"
                        },
                        "task_type": {
                          "type": "string",
                          "description": "任务类型",
                          "example": "training"
                        },
                        "detail": {
                          "type": "object",
                          "description": "任务详情",
                          "example": {
                            "progress": 50,
                            "current": 20,
                            "total": 40,
                            "elapsed": "00:21",
                            "remaining": "00:21",
                            "speed": 1.07,
                            "loss": 0.145
                          }
                        }
                      }
                    }
                }
            }
        },
        "404": {
            "description": "当前没有正在运行的任务",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "current has no task to run"}
                }
            }
        },
        "500": {
            "description": "服务器错误，获取任务信息失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "get current task failed"}
                }
            }
        }
    }
}


huanyuan_training = {
  "tags": ["Training"],
  "description": "混元模型LoRA训练",
  "parameters": [
    {
      "name": "config",
      "in": "body",
      "required": True,
      "description": "包含所有训练配置的对象",
      "schema": {
            "type": "object",
            "required": ["output_dir"],
            "properties": {
                "output_dir": {"type": "string", "description": "Output directory for training results"},
                "dataset": {"type": "string"},
                "epochs": {"type": "integer", "default": 128},
                "micro_batch_size_per_gpu": {"type": "integer", "default": 1},
                "pipeline_stages": {"type": "integer", "default": 1},
                "gradient_accumulation_steps": {"type": "integer", "default": 4},
                "gradient_clipping": {"type": "number", "default": 1.0},
                "warmup_steps": {"type": "integer", "default": 100},
                "eval_every_n_epochs": {"type": "integer", "default": 1},
                "eval_before_first_step": {"type": "boolean", "default": True},
                "eval_micro_batch_size_per_gpu": {"type": "integer", "default": 1},
                "eval_gradient_accumulation_steps": {"type": "integer", "default": 1},
                "save_every_n_epochs": {"type": "integer", "default": 16},
                "checkpoint_every_n_minutes": {"type": "integer", "default": 120},
                "activation_checkpointing": {"type": "boolean", "default": True},
                "partition_method": {"type": "string", "default": "parameters"},
                "save_dtype": {"type": "string", "default": "bfloat16"},
                "caching_batch_size": {"type": "integer", "default": 1},
                "steps_per_print": {"type": "integer", "default": 1},
                "video_clip_mode": {"type": "string", "default": "single_middle"},
                "model": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string", "enum": ["hunyuan-video"]},
                        "transformer_path": {"type": "string"},
                        "vae_path": {"type": "string"},
                        "llm_path": {"type": "string"},
                        "clip_path": {"type": "string"},
                        "dtype": {"type": "string", "default": "bfloat16"},
                        "transformer_dtype": {"type": "string", "default": "fp8"},
                        "timestep_sample_method": {"type": "string", "enum": ["logit_normal", "uniform"], "default": "logit_normal"}
                    }
                },
                "adapter": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string", "enum": ["lora"]},
                        "rank": {"type": "integer", "minimum": 1, "maximum": 256, "default": 32},
                        "dtype": {"type": "string", "default": "bfloat16"},
                        "init_from_existing": {"type": "string"}
                    }
                },
                "optimizer": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string", "default": "adamw_optimi"},
                        "lr": {"type": "number", "default": 0.00002},
                        "betas": {
                            "type": "array",
                            "items": {"type": "number"},
                            "default": [0.9, 0.99]
                        },
                        "weight_decay": {"type": "number", "default": 0.01},
                        "eps": {"type": "number", "default": 0.00000001}
                    }
                }
            }
        }
     },
     {
      "name": "dataset",
      "in": "body",
      "required": True,
      "description": "数据集配置",
      "schema": {
        "type": "object",
        "properties": {
          "resolutions": {
            "type": "array",
            "items": {"type": "integer"},
            "default": [512]
          },
          "enable_ar_bucket": {"type": "boolean", "default": True},
          "min_ar": {"type": "number", "default": 0.5},
          "max_ar": {"type": "number", "default": 2.0},
          "num_ar_buckets": {"type": "integer", "default": 7},
          "frame_buckets": {
            "type": "array",
            "items": {"type": "integer"},
            "default": [1, 33, 65]
          },
          "directory": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "path": {"type": "string"},
                "num_repeats": {"type": "integer", "minimum": 1, "default": 10},
                "resolutions": {
                  "type": "array",
                  "items": {"type": "integer"}
                },
                "frame_buckets": {
                  "type": "array",
                  "items": {"type": "integer"}
                }
              },
              "required": ["path", "num_repeats"]
            }
          }
        }
      }
    }
  ],
  "responses": {
    "200": {
      "description": "任务提交成功",
      "schema": {
        "type": "object",
        "properties": {
          "success": {"type": "boolean", "example": True},
          "msg": {"type": "string", "example": "The training task was submitted successfully."},
        }
      }
    },
    "400": {
      "description": "参数错误训练失败",
      "schema": {
        "type": "object",
        "properties": {
          "success": {"type": "boolean", "example": False},
          "msg": {"type": "string", "example": "output is required but empty"}
        }
      }
    },
    "500": {
      "description": "服务器错误，训练失败",
      "schema": {
        "type": "object",
        "properties": {
          "success": {"type": "boolean", "example": False},
          "msg": {"type": "string", "example": "start hunyuan_video training failed, please contract the admin"}
        }
      }
    }        
  }
}

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