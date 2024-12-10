# 查询目录结构
file_config = {
    "tags": ["Directory"],
    "description": "获取指定目录下的当前层级的文件和目录结构，支持懒加载",
    "parameters": [
        {
            "name": "parent_id",
            "in": "query",
            "type": "string",
            "required": True,
            "default": "/",
            "description": "父目录路径",
        },
        {
            "name": "path",
            "in": "query",
            "type": "string",
            "required": True,
            "default": "/",
            "description": "请求的子目录路径",
        },
        {
            "name": "level",
            "in": "query",
            "type": "integer",
            "required": False,
            "description": "目录层级，默认值为 0",
            "example": 0,
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
                        "type": "object",
                        "properties": {
                            "directories": {
                                "type": "array",
                                "description": "目录列表",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "string",
                                            "description": "目录 ID",
                                            "example": "/subdir1",
                                        },
                                        "label": {
                                            "type": "string",
                                            "description": "目录名称",
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
                            "files": {
                                "type": "array",
                                "description": "文件列表",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "string",
                                            "description": "文件 ID",
                                            "example": "/file1.txt",
                                        },
                                        "label": {
                                            "type": "string",
                                            "description": "文件名称",
                                            "example": "file1.txt",
                                        },
                                        "isLeaf": {
                                            "type": "boolean",
                                            "description": "是否为叶子节点",
                                            "example": True,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }
    },
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

# 上传进度查询
upload_progress_config = {
    "tags": ["Upload"],
    "description": "查询指定文件的上传进度，返回进度信息流。",
    "parameters": [
        {
            "name": "upload_id",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "上传任务的唯一标识，用于查询该文件的上传进度",
        }
    ],
    "responses": {
        "200": {
            "description": "文件上传进度流",
            "content": {
                "text/event-stream": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "progress": {"type": "integer", "example": 50},
                            "total_size": {"type": "integer", "example": 5000000},
                        },
                    }
                }
            },
        },
        "400": {
            "description": "上传进度查询失败",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 1},
                    "msg": {"type": "string", "example": "查询失败"},
                },
            },
        },
    },
}

tag_config = {
    "tags": ["Training"],
    "description": "打标多张图片",
    "parameters": [
        {
            "name": "model_name",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "模型名称，用于选择相应的打标方式",
        },
        {
            "name": "image_path",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "要打标的图片文件夹路径",
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
                        "type": "array",
                        "description": "打标结果列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "image_path": {
                                    "type": "string",
                                    "description": "图片路径",
                                    "example": "/images/image1.jpg",
                                },
                                "marking_text": {
                                    "type": "string",
                                    "description": "打标文本信息",
                                    "example": "A beautiful sunset over the mountains.",
                                },
                                "marking_file": {
                                    "type": "string",
                                    "description": "打标文件路径",
                                    "example": "xxx.txt",
                                },
                            },
                        },
                    },
                },
            },
            "400": {
                "description": "打标失败",
                "schema": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "integer", "example": 1},
                        "msg": {"type": "string", "example": "打标失败"},
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
                                "example": "/captions_output/image1_caption.txt",
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

save_config_config = {
    "tags": ["Training"],
    "description": "保存配置内容",
    "parameters": [
        {
            "name": "config_name",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "配置名称，用于标识保存的配置",
        },
        {
            "name": "config_content",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "配置内容，以 JSON 格式表示配置的详细内容",
        },
    ],
    "responses": {
        "200": {
            "description": "配置保存结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "msg": {"type": "string", "example": "配置保存成功"},
                },
            },
        },
        "400": {
            "description": "配置保存失败",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "配置内容格式无效，请提供有效的 JSON 内容"},
                },
            },
        },
    },
}

get_config_config = {
    "tags": ["Training"],
    "description": "获取保存的配置内容",
    "parameters": [
        {
            "name": "config_name",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "配置名称，用于读取相应的配置",
        },
    ],
    "responses": {
        "200": {
            "description": "返回配置内容",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "data": {
                        "type": "object",
                        "description": "配置内容",
                        "example": {"model_name": "florence2", "image_size": [224, 224]},
                    },
                },
            },
        },
        "400": {
            "description": "配置文件不存在",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": False},
                    "msg": {"type": "string", "example": "配置文件不存在"},
                },
            },
        },
    },
}

# 启动训练
start_training_config = {
    "tags": ["Training"],
    "description": "启动训练任务",
    "parameters": [
        {
            "name": "config_name",
            "in": "body",
            "type": "string",
            "required": True,
            "description": "配置名称，指定要使用的训练配置文件",
        }
    ],
    "responses": {
        "200": {
            "description": "返回训练任务启动结果",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "msg": {
                        "type": "string",
                        "example": "训练任务已启动",
                    },
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

# 生成命令参数
generate_sh_config = {
  "tags": ["Training"],
  "description": "获取保存的配置内容",
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
          "text_encoder_lr": { "type": "string", "example": "1e-5" },
          "lr_scheduler": { "type": "string", "example": "cosine_with_restarts" },
          "lr_warmup_steps": { "type": "integer", "example": 1 },
          "lr_scheduler_num_cycles": { "type": "integer", "example": 1 },
          "optimizer_type": { "type": "string", "example": "PagedAdamW8bit" },
          "optimizer_args_custom": {
            "type": "array",
            "items": { "type": "string" },
            "example": []
          },
          "network_module": { "type": "string", "example": "networks.lora_flux" },
          "network_weights": { "type": "string", "example": "" },
          "network_alpha": { "type": "integer", "example": 16 },
          "network_dropout": { "type": "integer", "example": 0 },
          "network_args_custom": {
            "type": "array",
            "items": { "type": "string" },
            "example": []
          },
          "enable_base_weight": { "type": "boolean", "example": False },
          "base_weights": {
            "type": "array",
            "items": { "type": "string" },
            "example": []
          },
          "base_weights_multiplier": { "type": "string", "example": "" },
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
    }
  ],
  "responses": {
    "200": {
      "description": "返回配置内容",
      "schema": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": True },
          "data": { 
            "type": "string",
            "description": "TOML 格式的配置文件内容",
            "example": "[settings]\noutput_name = \"\"\nclass_tokens = \"\"\npretrained_model_name_or_path = \"\"\nae = \"\"\nclip_l = \"\"\nt5xxl = \"\"\nresume = \"\"\noutput_dir = \"\"\nsave_model_as = \"\"\nsave_precision = \"\"\nsave_state = False\ntrain_data_dir = \"\"\nnum_repeats = 10\nmax_train_epochs = 10\ntrain_batch_size = 1\nresolution_width = 768\nresolution_height = 768\nenable_bucket = True\nmin_bucket_reso = 256\nmax_bucket_reso = 2048\nbucket_reso_steps = 32\nbucket_no_upscale = True\nseed = 1337\nmax_data_loader_n_workers = 2\nlearning_rate = \"1e-4\"\nsave_every_n_epochs = 2\nguidance_scale = 1\ntimestep_sampling = \"sigmoid\"\nnetwork_dim = 2\nsigmoid_scale = 1\nmodel_prediction_type = \"raw\"\ndiscrete_flow_shift = 3\nloss_type = \"l2\"\ngradient_checkpointing = True\ngradient_accumulation_steps = 1\nnetwork_train_unet_only = True\nnetwork_train_text_encoder_only = False\nunet_lr = \"5e-4\"\ntext_encoder_lr = \"1e-5\"\nlr_scheduler = \"cosine_with_restarts\"\nlr_warmup_steps = 1\nlr_scheduler_num_cycles = 1\noptimizer_type = \"PagedAdamW8bit\"\noptimizer_args_custom = []\nnetwork_module = \"networks.lora_flux\"\nnetwork_weights = \"\"\nnetwork_alpha = 16\nnetwork_dropout = 0\nnetwork_args_custom = []\nenable_base_weight = False\nbase_weights = []\nbase_weights_multiplier = \"\"\nenable_preview = False\nlog_with = \"tensorboard\"\nlog_prefix = \"\"\nlog_tracker_name = \"\"\nlogging_dir = \"./logs\"\ncaption_extension = \".txt\"\nshuffle_caption = False\nweighted_captions = False\nkeep_tokens = 0\nkeep_tokens_separator = \"\"\ncolor_aug = False\nflip_aug = False\nrandom_crop = False\nclip_skip = 2\nui_custom_params = \"\"\nmixed_precision = \"bf16\"\nfull_fp16 = False\nfull_bf16 = False\nfp8_base = True\nfp8_base_unet = False\nno_half_vae = False\nsdpa = True\nlowram = False\ncache_latents = True\ncache_latents_to_disk = True\ncache_text_encoder_outputs = True\ncache_text_encoder_outputs_to_disk = True\npersistent_data_loader_workers = True\nddp_gradient_as_bucket_view = False"
          }
        }
      }
    }
  }
}