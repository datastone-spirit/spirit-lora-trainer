<div align="center">
  <img src="/public/images/logo.png" alt="智灵训练器" style="max-width: 100%;" />
  <p text-aligin="center"><span style="font-weight:bold">A robust, simplicity and reliability Flux1-LoRA trainer</span></p>
  <div align="center">
    <a href="https://serverless.datastone.cn/">Official website</a>&emsp;|&emsp;
    <a href="https://serverless.datastone.cn/sprite/app/login">Try Online</a>&emsp;|&emsp;
    <a href="https://serverless.datastone.cn/sprite/docs/zh/lora-trainer/quick-start">Docs</a>&emsp;|&emsp;
    <a href="./docs/README.zh-CN.md">中文README</a>
  </div>
  <div>
  </div>
</div>

## Introduction

Spirit Lora Trainer is a robust toolkit for training Flux1-LoRA models with a focus on simplicity and reliability and based on [kohya-ss script](https://github.com/kohya-ss/sd-scripts). It features a clean, intuitive interface that simplifies the model training process while providing real-time monitoring capabilities. Built on a decoupled architecture, it ensures stable training sessions. The toolkit supports essential machine learning workflows including model training and image captioning.

## Features

- **Simple**: Spirit Lora Trainer is designed to be user-friendly and intuitive. Train your own Flux1 LoRA model by configuring just a few parameters.

- **Observable**: Monitor your training process in real-time with key metrics including loss values, training steps, and estimated time remaining.

- **Stable**: Built with a decoupled frontend-backend architecture, Spirit Lora Trainer maintains training status persistence. Resume monitoring your training progress seamlessly even after reopening the frontend page.

## Prerequisite

### Frontend prerequisite

First, you must install Node.js and pnpm, which are required to build and run the frontend. We strongly recommend you install node via nvm, you can install nvm via the following command:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh |bash
```

After the nvim installed, you can install the node via the following command, we recommend you install node version over v20.0.0

```bash
nvm install v22.12.0
```

Then you can install the pnpm via the following command, we leverage the pnpm to manage the frontend dependencies.

```bash
npm install -g pnpm
```

### Backend prerequisite

Python 3.10+ is required to run the backend. We recommend you install Python via Anaconda.

You must install torch libraries, we strongly recommand the torch-2.5.1, you should install the 2.5.1 match your local environment cuda driver

eg:

```bash
pip install torch==2.5.1+cu121 torchvision==0.20.1+cu121 torchaudio==2.5.1+cu121 \
    --extra-index-url https://download.pytorch.org/whl/cu121
```

Secondly the xformers will help getting better performance, you should choose the correct version to match torch version.

```bash
pip install -U xformers==0.0.28.post3 --index-url https://download.pytorch.org/whl/cu121
```

## Build and Run

### Frontend Build

Before running the frontend, you must build the frontend. To do so, navigate to the `frontend` directory and run the following command to install the dependencies:

```bash
pnpm install
```

After dependencies are installed, run the following command to build the frontend, when the build is complete, the frontend artificats will be available in the `frontend/dist` directory:

```bash
pnpm run build-only
```

### Backend Setup

Our trainer is based on [kohya-ss script](https://github.com/kohya-ss/sd-scripts) , so you should clone the kohya-ss repository firstly. navigate to the `backend` directory and run the following command to clone the kohya-ss repository, and switch to flux1 training branch:

```bash
git clone https://github.com/kohya-ss/sd-scripts
cd sd-scripts/
git checkout -b sd3 origin/sd3
```

After cloning the kohya-ss repository, you should install the dependencies of kohya-ss script via the following command, nvigate to the `backend/sd-scripts` directory and run the following command:

```bash
pip install -r requirements.txt
```

Next, you need to install dependencies for the trainer backend, navigate to the `backend` directory and run the following command:

```bash
pip install -r requirements.txt
```

### Captioning models setup

#### Florence2

The following models are dedicated to captioning.

- **Name**: Florence2
- **Model Path**: `backend/models/florence2/models--multimodalart--Florence-2-large-no-flash-attn`
- **Description**: Florence2 is a multimodal model that can generate image captions. It is based on the Florence2 model released by MultimodalArt.
- **Download Command**: navigate to `backend/models/florence2/models--multimodalart--Florence-2-large-no-flash-attn` and run command: `huggingface-cli download multimodalart/Florence-2-large-no-flash-attn --localdir .`

##### Joy-Caption-Two-Alpha

Joy-Caption-Two-Alpha model has a better performance on generating image captions. but it is a large model, has a complicated structure, and requires more resources. Leverage the Joy-Caption-Two-Alpha to caption you must install following dependencies:

Llama3.1 model

- **Name**: Llama3.1
- **Model Path**: `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit`
- **Description**: Llama3.1 instruct model is a LLM model, it is based on the Llama3.1 model released by Meta.
- **Download Command**:
  - create a directory `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit`
  - navigate to `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit` and run command: `huggingface-cli download unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit --local-dir .`

Joy-Caption-Alpha-Two model

- **Name**: Joy-Caption-Two-Alpha
- **Model Path**: `backend/models/joy-caption-alpha-two`
- **Description**: .
- **Download Command**:
  - ensure the git-lfs was installed.
  - navigate to `backend/models/` and run command: `git lfs clone --depth 1 https://huggingface.co/spaces/fancyfeast/joy-caption-alpha-two`

siglip-so400m-patch14-384

- **Name**: siglip-so400m-patch14-384
- **Model Path**: `backend/models/clip/siglip-so400m-patch14-384`
- **Description**: siglip-so400m-patch14-384 is a CLIP model, it is based on the siglip-so400m-patch14-384 model released by Google.
- **Download Command**:
  - create a directory `backend/models/clip/siglip-so400m-patch14-384`
  - navigate to `backend/models/clip/siglip-so400m-patch14-384` and run command: `huggingface-cli download google/siglip-so400m-patch14-384 --local-dir .`

### Flux Models Setup

Before running the trainer, you need to prepare the models. There are two category models for different purposes, the training models and the captioning models. You can download the models from the following table, and place the models in the proper directory of `backend/models` according to `Model Path` of the table.

#### Training models

| Model Name             | Model Path             | Model Description                                                | Download Link                                                                                                          | Category |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| flux1-dev.safetensors  | `backend/models/unet/` | The Unet model, released by the BlackForestLib                   | [Download](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors?download=true)       | Training |
| ae.safetensors         | `backend/models/vae/`  | The Variation Auto Encoder model, released by the BlackForestLib | [Download](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/ae.safetensors?download=true)              | Training |
| clip_l.safetensors     | `backend/models/clip/` | The Flux Text Encoder model, released by the BlackForestLib      | [Download](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors?download=true)     | Training |
| t5xxl_fp16.safetensors | `backend/models/clip/` | The Text to Text model, released by the Google                   | [Download](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp16.safetensors?download=true) | Training |


#### Tokenizers

kohya-ss script requires the tokenizersd. If you have not downloaded the tokenizers, the kohya-ss script will download them automatically. but we recommend you download the tokenizers manually and place them in the `backend/models` directory. The following commands will help you download the tokenizers and place it in the proper directory:

1. openai/clip-vit-large-patch14, navigate to `backend/models/clip/` and run command:

```bash
mkdir -p openai_clip-vit-large-patch14
cd openai_clip-vit-large-patch14
huggingface-cli download openai/clip-vit-large-patch14  --exclude "*.bin" "*.msgpack" "*.h5" "*.safetensors"  --local-dir .
```

2. google/t5-v1_1-xxl, navigate to `backend/models/clip/` and run command:

```bash
mkdir -p google_t5-v1_1-xxl
cd google_t5-v1_1-xxl
huggingface-cli download google/t5-v1_1-xxl --exclude "*.bin" "*.h5" --local-dir .
```

### Wan2.1 Model Setup

Before training the Wan2.1 Lora model, you need to download the Wan2.1 model and place it in the proper directory of `backend/models`. The following table will help you download the models and place it in the proper directory:


| Model Name             | Model Path             | Model Description                                                | Download Link                                                                                                          | Category |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| umt5_xxl_fp8_e4m3fn_scaled.safetensors | `backend/models/clip/` | The Wan2.1 Text Encoder model, released by the Wan2.1 team      | [Download](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors?download=true)     | Training |
| clip_vision_h.safetensors     | `backend/models/clip/` | The Wan2.1 Text Encoder model, released by the Wan2.1 team      | [Download](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/clip_vision/clip_vision_h.safetensors?download=true)     | Training |
| models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth|`backend/models/clip/`| The Wan2.1 Text Encoder model, released by the Wan2.1 team      | [Download](https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-720P/resolve/main/models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth?download=true)     | Training |
| wan_2.1_vae.safetensors| `backend/models/vae/` | The Wan2.1 vae models| [Download](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/vae/wan_2.1_vae.safetensors?download=true)     | Training |
|wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors|`backend/models/wan/`|Wan 2.1 diffusion models, image to video , fp8|[Download](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/diffusion_models/wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors?download=true)|     | Training |
|wan2.1_t2v_14B_fp8_e4m3fn.safetensors?|`backend/models/wan/`|Wan 2.1 diffusion models, image to video , fp8|[Download](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/diffusion_models/wan2.1_t2v_14B_fp8_e4m3fn.safetensors?download=true)|     | Training |

### Run the Trainer

After building the frontend and setting up the backend, you can run the trainer. To do so,

- Copying the frontend static files, navigate to the `frontend/dist` directory and run the following command:

```bash
mkdir -p ../../backend/dist/
copy -r * ../../backend/dist/
```

- Run the backend server, navigate to the `backend` directory and run the following command:

```bash
python -m app.api.run.py
```

## Roadmap

- [ ] Support Windows OS
- [ ] Support SDXL Model Lora Training
- [x] Support HunyuanVideo Model Lora Training
- [x] Support Wan2.1 Model Lora Training
- [ ] Persistence the task status into the database

## Acknowledge

- [kohya-ss](https://github.com/kohya-ss/sd-scripts) contributed so amazing scripts for the Flux1 training, we leverage the scripts to build the trainer.
