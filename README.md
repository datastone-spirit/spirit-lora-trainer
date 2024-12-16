# spirit-lora-trainer

智灵LoRA训练器


## prerequisite

### Preinstall library:

First, you must install torch libraries, we strongly recommand the torch-2.5.1, you should install the 2.5.1 match your local environment cuda driver

eg:

```bash
pip install torch==2.5.1+cu121 torchvision==0.20.1+cu121 torchaudio==2.5.1+cu121 \
    --extra-index-url https://download.pytorch.org/whl/cu121
```
Secondly the xformers will help getting better performance, you should choose the correct version to match torch version.

```bash
pip install -U xformers==0.0.28.post3 --index-url https://download.pytorch.org/whl/cu121 
```


