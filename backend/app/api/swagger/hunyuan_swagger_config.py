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