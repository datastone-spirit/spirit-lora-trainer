from app.api.model.hunyuan_paramter import HunyuanTrainingParameter
import json
from unittest.mock import patch

json_payload="""
{
    "config": {
        "output_dir": "/root",
        "dataset": "",
        "epochs": 1000,
        "micro_batch_size_per_gpu": 1,
        "pipeline_stages": 1,
        "gradient_accumulation_steps": 4,
        "gradient_clipping": 1,
        "warmup_steps": 100,
        "eval_every_n_epochs": 1,
        "eval_before_first_step": true,
        "eval_micro_batch_size_per_gpu": 1,
        "eval_gradient_accumulation_steps": 1,
        "save_every_n_epochs": 2,
        "checkpoint_every_n_minutes": 120,
        "activation_checkpointing": true,
        "partition_method": "parameters",
        "save_dtype": "bfloat16",
        "caching_batch_size": 1,
        "steps_per_print": 1,
        "video_clip_mode": "single_middle",
        "model": {
            "type": "hunyuan-video",
            "transformer_path": "",
            "vae_path": "",
            "llm_path": "",
            "clip_path": "",
            "dtype": "bfloat16",
            "transformer_dtype": "float8",
            "timestep_sample_method": "logit_normal"
        },
        "adapter": {
            "type": "lora",
            "rank": 32,
            "dtype": "bfloat16",
            "init_from_existing": ""
        },
        "optimizer": {
            "type": "adamw_optimi",
            "lr": 0.00002,
            "betas": [
                0.9,
                0.99
            ],
            "weight_decay": 0.01,
            "eps": 1e-8
        }
    },
    "dataset": {
        "resolutions": [
            512,
            512
        ],
        "enable_ar_bucket": true,
        "min_ar": 0.5,
        "max_ar": 2,
        "num_ar_buckets": 7,
        "frame_buckets": [
            1,
            33,
            65
        ],
        "directories": [
            {
                "path": "/root",
                "num_repeats": 10,
                "resolutions": [
                    512,
                    512
                ],
                "frame_buckets": [
                    1,
                    33,
                    65
                ]
            }
        ]
    }
}
"""

def test_hunyuan_parameter_from_dict():
    payload = json.loads(json_payload)
    training_parameter = HunyuanTrainingParameter.from_dict(payload)
    assert training_parameter.config.output_dir == "/root"
    assert training_parameter.dataset.directories[0].path == "/root"

def test_validate_hunyuan_parameter():
    payload = json.loads(json_payload)
    training_parameter = HunyuanTrainingParameter.from_dict(payload)
    
    # Mock paths that should exist
    paths = {
        "hunyuan_video_720_cfgdistill_fp8_e4m3fn.safetensors": True,
        "hunyuan_video_vae_bf16.safetensors": True,
        "llava-llama-3-8b-text-encoder-tokenizer": True,
        "clip-vit-large-patch14": True
    }
    
    # Mock os.path.exists
    with patch('os.path.exists') as mock_exists:
        mock_exists.side_effect = lambda path: paths.get(next((k for k in paths.keys() if k in path), None), False)
        
        # Run validation
        valid, reason = HunyuanTrainingParameter.validate(training_parameter)
        
        assert valid == True
        assert reason == ""