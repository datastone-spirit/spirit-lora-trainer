<div align="center">
  <img src="/public/images/logo.png" alt="智灵训练器" style="max-width: 100%;" />
  <p text-aligin="center"><span style="font-weight:bold">一个强大、简单且可靠的 Flux1-LoRA 训练器</span></p>
  <div align="center">
    <a href="https://serverless.datastone.cn/">官网</a>&emsp;|&emsp;
    <a href="https://serverless.datastone.cn/sprite/app/login">在线体验</a>&emsp;|&emsp;
    <a href="https://serverless.datastone.cn/sprite/docs/zh/lora-trainer/quick-start">文档</a>
  </div>
</div>

# Spirit Lora Trainer 智灵训练器

## 介绍

Spirit Lora Trainer 是一款功能强大的工具，旨在提供简单且可靠的方式来训练 Flux1-LoRA 模型。它基于 [kohya-ss script](https://github.com/kohya-ss/sd-scripts) 构建，拥有简洁直观的用户界面，能够有效简化模型训练过程，同时提供实时监控功能，其分离架构确保了训练过程的稳定性。训练器支持基本的训练工作流程，包括模型训练和图像打标。

## 功能特点

- **简单**：Spirit Lora Trainer 是一个对用户友好且直观的工具，用户只需配置少量参数即可训练自己的 Flux1 LoRA 模型。

- **可观察**：通过实时显示关键指标（如损失值、训练步数、剩余预估时间等），用户可以轻松监控训练过程。

- **稳定**：基于分离式架构设计，确保训练状态持久化。即使在重新打开前端页面后，训练进度也不会丢失。

## 支持训练的模型

1. Flux
2. Flux Kontext
3. 混元视频（HunyuanVideo）
4. Wan2.1/2.2
5. Qwen Image（Edit）
6. 开发中...

## 环境要求

### 前端环境要求

首先，你需要安装 Node.js 和 pnpm，这两者是构建和运行前端所必需的。我们强烈建议使用 nvm 来安装 Node.js。可以通过以下命令安装 nvm：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh |bash
```

安装 nvm 后，通过以下命令安装 Node.js。推荐安装 v20.0.0 及以上版本：

```bash
nvm install v22.12.0
```

Node.js 安装完成后，使用以下命令安装 pnpm。推荐安装 pnpm 8.0.0 及以上版本：

```bash
npm install -g pnpm
```

### 后端环境要求

后端运行需要 Python 3.10 及以上版本。推荐使用 Anaconda 来安装 Python。

此外，你需要安装 torch 库，强烈推荐使用 torch-2.5.1。请根据本地环境的 cuda 驱动程序安装与之匹配的 torch 2.5.1 版本。示例命令如下：

eg:

```bash
pip install torch==2.5.1+cu121 torchvision==0.20.1+cu121 torchaudio==2.5.1+cu121 \
    --extra-index-url https://download.pytorch.org/whl/cu121
```

另外，xformers 库可以提升性能。你需要安装与 torch 版本匹配的正确版本：

```bash
pip install -U xformers==0.0.28.post3 --index-url https://download.pytorch.org/whl/cu121
```

## 构建和运行

### 前端构建

在运行前端之前，你必须先将前端项目打包构建。为此，请进入到 `frontend` 目录，并运行以下命令以安装依赖项：

```bash
pnpm install
```

安装依赖项后，运行以下命令构建前端。构建完成后，生成的文件将保存到 `frontend/dist` 目录中：

```bash
pnpm run build-only
```

### 后端配置

我们的训练器基于 [kohya-ss script](https://github.com/kohya-ss/sd-scripts) ，所以你需要先克隆 kohya-ss 仓库。进入到 `backend` 目录，运行以下命令来克隆 kohya-ss 仓库，克隆完毕后并将 kohya-ss 仓库切换到 flux1 训练分支：

```bash
git clone https://github.com/kohya-ss/sd-scripts
cd sd-scripts/
git checkout -b sd3 origin/sd3
```

克隆完成后，需要安装 kohya-ss 脚本的依赖项。进入到 `backend/sd-scripts` 目录，然后运行以下命令：

```bash
pip install -r requirements.txt
```

接着，你需要为训练器的后端安装依赖项。进入到 `backend` 目录，然后运行以下命令：

```bash
pip install -r requirements.txt
```

### 打标模型配置

#### Florence2

此模型专用于打标。

- **模型名称**: Florence2
- **模型路径**: `backend/models/florence2/models--multimodalart--Florence-2-large-no-flash-attn`
- **模型描述**: Florence2 是一个多模态模型，能够生成图像描述，基于 MultimodalArt。
- **下载命令**: 进入 `backend/models/florence2/models--multimodalart--Florence-2-large-no-flash-attn` 目录并运行命令: `huggingface-cli download multimodalart/Florence-2-large-no-flash-attn --localdir .`

#### Joy-Caption-Two-Alpha

Joy-Caption-Two-Alpha 模型在生成图像描述方面表现更佳。此大型模型结构复杂，需要更多资源。要使用 Joy-Caption-Two-Alpha 进行打标，需安装以下依赖项：

Llama3.1 模型

- **模型名称**: Llama3.1
- **模型路径**: `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit`
- **模型描述**: Llama3.1 是一个基于 Meta 发布的 Llama3.1 模型的大型语言模型（LLM）。
- **下载命令**:
  - 创建目录 `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit`
  - 进入目录 `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit` 并运行命令：`huggingface-cli download unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit --local-dir .`

Joy-Caption-Alpha-Two 模型

- **模型名称**: Joy-Caption-Two-Alpha
- **模型路径**: `backend/models/joy-caption-alpha-two`
- **模型描述**: 此模型的描述尚未提供
- **下载命令**:
  - 确保已安装 git-lfs
  - 进入目录 `backend/models/` 并运行命令：`git lfs clone --depth 1 https://huggingface.co/spaces/fancyfeast/joy-caption-alpha-two`

siglip-so400m-patch14-384

- **模型名称**: siglip-so400m-patch14-384
- **模型路径**: `backend/models/clip/siglip-so400m-patch14-384`
- **模型描述**: siglip-so400m-patch14-384 是一个基于 Google 发布的 CLIP 模型。
- **下载命令**:
  - 创建目录 `backend/models/clip/siglip-so400m-patch14-384`
  - 进入目录 `backend/models/clip/siglip-so400m-patch14-384` 并运行命令：`huggingface-cli download google/siglip-so400m-patch14-384 --local-dir .`

### Flux 模型设置

在运行训练器之前，您需要准备模型。有两种类型的模型，训练模型和推理模型。您可以从以下表格下载模型，并根据表格中的 Model Path 将模型放置在 backend/models 的适当目录中。

#### 训练模型

| 模型名称             | 模型路径             | 模型描述                                                | 下载链接                                                                                                          | 类别 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| flux1-dev.safetensors  | `backend/models/unet/` | BlackForestLib 发布的 Unet 模型                   | [下载](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors?download=true)       | 训练 |
| ae.safetensors         | `backend/models/vae/`  | Variation Auto Encoder 模型，由 BlackForestLib 发布 | [下载](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/ae.safetensors?download=true)              | 训练 |
| clip_l.safetensors     | `backend/models/clip/` | Flux Text Encoder 模型，由 BlackForestLib 发布      | [下载](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors?download=true)     | 训练 |
| t5xxl_fp16.safetensors | `backend/models/clip/` | 文本到文本模型，由谷歌发布                   | [下载](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp16.safetensors?download=true) | 训练 |

#### 分词器

kohya-ss 脚本需要 tokenizers。如果你还没有下载 tokenizers，kohya-ss 脚本会自动下载它们。但我们建议你手动下载 tokenizers 并将其放在 `backend/models` 目录中。以下命令可以帮助你下载 tokenizers 并将其放在正确的位置：

1. openai/clip-vit-large-patch14，进入到 `backend/models/clip/` 目录并运行命令：

    ```bash
    mkdir -p openai_clip-vit-large-patch14
    cd openai_clip-vit-large-patch14
    huggingface-cli download openai/clip-vit-large-patch14  --exclude "*.bin" "*.msgpack" "*.h5" "*.safetensors"  --local-dir .
    ```

2. google/t5-v1_1-xxl，进入到 `backend/models/clip/` 目录并运行命令：

    ```bash
    mkdir -p google_t5-v1_1-xxl
    cd google_t5-v1_1-xxl
    huggingface-cli download google/t5-v1_1-xxl --exclude "*.bin" "*.h5" --local-dir .
    ```

### Wan2.1 模型设置

在训练 Wan2.1 LoRA 模型之前，您需要下载 Wan2.1 模型并将其放置在 `backend/models` 的正确目录中。以下表格将帮助您下载模型并放置在正确目录中：

| 模型名称             | 模型路径             | 模型描述                                                | 下载链接                                                                                                           | 类别 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| umt5_xxl_fp8_e4m3fn_scaled.safetensors | `backend/models/clip/` | Wan2.1 文本编码器模型，由 Wan2.1 团队发布      | [下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors?download=true)     | 训练 |
| clip_vision_h.safetensors     | `backend/models/clip/` | Wan2.1 文本编码器模型，由 Wan2.1 团队发布      | [下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/clip_vision/clip_vision_h.safetensors?download=true)     | 训练 |
| models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth|`backend/models/clip/`| Wan2.1 文本编码器模型，由 Wan2.1 团队发布      | [下载](https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-720P/resolve/main/models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth?download=true)     | 训练 |
| wan_2.1_vae.safetensors| `backend/models/vae/` | Wan2.1 vae 模型 | [下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/vae/wan_2.1_vae.safetensors?download=true)     | 训练 |
|wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors|`backend/models/wan/`| Wan 2.1 演化模型，图像转视频，fp8 |[下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/diffusion_models/wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors?download=true)|  训练 |
|wan2.1_t2v_14B_fp8_e4m3fn.safetensors?|`backend/models/wan/`| Wan 2.1 扩散模型，图像转视频，fp8 |[下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/diffusion_models/wan2.1_t2v_14B_fp8_e4m3fn.safetensors?download=true)|    训练 |

### Wan2.2 模型设置

在训练 Wan2.2 LoRA 模型之前，您需要下载 Wan2.2 模型并将其放置在 `backend/models` 的正确目录中。以下表格将帮助您下载模型并放置在正确目录中：

| 模型名称             | 模型路径             | 模型描述                                                | 下载链接                                                                                                           | 类别 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| umt5_xxl_fp8_e4m3fn_scaled.safetensors | `backend/models/clip/` | Wan2.1 文本编码器模型，由 Wan2.1 团队发布      | [下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors?download=true)     | 训练 |
| clip_vision_h.safetensors     | `backend/models/clip/` | Wan2.1 文本编码器模型，由 Wan2.1 团队发布      | [下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/clip_vision/clip_vision_h.safetensors?download=true)     | 训练 |
| models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth|`backend/models/clip/`| Wan2.1 文本编码器模型，由 Wan2.1 团队发布      | [下载](https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-720P/resolve/main/models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth?download=true)     | 训练 |
| wan_2.1_vae.safetensors| `backend/models/vae/` | Wan2.1 vae 模型 | [下载](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/vae/wan_2.1_vae.safetensors?download=true)     | 训练 |
| wan2.2_i2v_high_noise_14B_fp16.safetensors | `backend/models/wan/` | Wan 2.2 i2v high模型 | [下载](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/resolve/main/split_files/diffusion_models/wan2.2_i2v_high_noise_14B_fp16.safetensors?download=true) | 训练 |
| wan2.2_i2v_low_noise_14B_fp16.safetensors | `backend/models/wan/` | Wan 2.2 i2v low模型 | [下载](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/resolve/main/split_files/diffusion_models/wan2.2_i2v_low_noise_14B_fp16.safetensors?download=true) | 训练 |
| wan2.2_t2v_high_noise_14B_fp16.safetensors | `backend/models/wan/` | Wan 2.2 t2v high模型 | [下载](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/resolve/main/split_files/diffusion_models/wan2.2_t2v_high_noise_14B_fp16.safetensors?download=true) | 训练 |
| wan2.2_t2v_low_noise_14B_fp16.safetensors | `backend/models/wan/` | Wan 2.2 t2v low模型 | [下载](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/resolve/main/split_files/diffusion_models/wan2.2_t2v_low_noise_14B_fp16.safetensors?download=true) | 训练 |

### Flux Kontext 模型设置

在训练 Flux Kontext LoRA 模型之前，您需要克隆 Flux Kontext 模型仓库并将其放置在 `backend/models/kontext-dev` 目录中。

- Flux Kontext 仓库地址：[FLUX.1-Kontext-dev](https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev)

```bash
git clone https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev
```

注意：克隆完后成，`backend/models/kontext-dev` 目录下就是被克隆仓库下的具体文件，不能再嵌套目录了。其中Flux Kontext 模型仓库根目录的 `flux1-kontext-dev.safetensors` 模型文件可以不必下载，因为在该仓库的 `transformers` 中已经存在了。

目录结构：

```bash
backend/models/kontext-dev
├── LICENSE.md
├── README.md
├── ae.safetensors
├── model_index.json
├── scheduler
│   └── scheduler_config.json
├── teaser.png
├── text_encoder
│   ├── config.json
│   └── model.safetensors
├── text_encoder_2
│   ├── config.json
│   ├── model-00001-of-00002.safetensors
│   ├── model-00002-of-00002.safetensors
│   └── model.safetensors.index.json
├── tokenizer
│   ├── merges.txt
│   ├── special_tokens_map.json
│   ├── tokenizer_config.json
│   └── vocab.json
├── tokenizer_2
│   ├── special_tokens_map.json
│   ├── spiece.model
│   ├── tokenizer.json
│   └── tokenizer_config.json
├── transformer
│   ├── config.json
│   ├── diffusion_pytorch_model-00001-of-00003.safetensors
│   ├── diffusion_pytorch_model-00002-of-00003.safetensors
│   ├── diffusion_pytorch_model-00003-of-00003.safetensors
│   └── diffusion_pytorch_model.safetensors.index.json
└── vae
    ├── config.json
    └── diffusion_pytorch_model.safetensors
```

### 混元视频模型设置

在训练混元视频（HunyuanVideo）LoRA 模型之前，您需要下载相关文件并将其放置在 `backend/models` 的正确目录中。

| 模型名称             | 模型路径             | 模型描述                                                | 下载链接                                                                                                          | 类别 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| hunyuan_video_720_cfgdistill_fp8_e4m3fn.safetensors | `backend/models/hunyuan/transformer` | 混元模型 | [下载](https://huggingface.co/Kijai/HunyuanVideo_comfy/resolve/main/hunyuan_video_720_cfgdistill_fp8_e4m3fn.safetensors?download=truetps) | 训练 |
| clip-vit-large-patch14  | `backend/models/hunyuan/clip` | 该 clip 模型由 OpenAI 的研究人员开发 | [克隆整个仓库](https://huggingface.co/openai/clip-vit-large-patch14) | 训练 |
| llava-llama-3-8b-text-encoder-tokenizer | `backend/models/hunyuan/llm` |  | [克隆整个仓库](https://huggingface.co/Kijai/llava-llama-3-8b-text-encoder-tokenizer) | 训练 |
| hunyuan_video_vae_bf16.safetensors | `backend/models/hunyuan/vae` | 混元官方发布的 VAE 模型 | [下载](https://huggingface.co/Comfy-Org/HunyuanVideo_repackaged/resolve/main/split_files/vae/hunyuan_video_vae_bf16.safetensors?download=true) | 训练 |

### Qwen Image（Edit）模型设置

在训练 Qwen Image 或 Qwen Image Edit LoRA 模型时，您需要下载相关文件并将其放置在 `backend/models` 的正确目录中。

| 模型名称             | 模型路径             | 模型描述                                                | 下载链接                                                                                                          | 类别 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| qwen_image_bf16.safetensors | `backend/models/qwen-image/transformer` | Qwen Image底模 | [下载](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/diffusion_models/qwen_image_bf16.safetensors?download=true) | 训练 |
| qwen_image_edit_bf16.safetensors | `backend/models/qwen-image/transformer` | Qwen Image Edit底模 | [下载](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/resolve/main/split_files/diffusion_models/qwen_image_edit_bf16.safetensors?download=true) | 训练 |
| diffusion_pytorch_model.safetensors | `backend/models/qwen-image/vae` | 用于图像编码解码 | [下载](https://huggingface.co/Qwen/Qwen-Image/resolve/main/vae/diffusion_pytorch_model.safetensors?download=true) | 训练 |
| qwen_2.5_vl_7b.safetensors | `backend/models/qwen-image/text_encoders/` | 文本编码器，处理文本提示 | [下载](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/resolve/main/split_files/text_encoders/qwen_2.5_vl_7b.safetensors?download=true) | 训练 |

### 运行训练器

完成前端构建及后端设置后，你可以运行训练器。请按以下步骤操作：

- 进入 `frontend/dist` 目录，并复制前端的静态文件：

```bash
mkdir -p ../../backend/dist/
copy -r * ../../backend/dist/
```

- 运行后端服务，进入 `backend` 目录并运行以下命令：

```bash
python -m app.api.run.py
```

## 未来计划

- [ ] 支持 Windows 操作系统
- [ ] 支持 SDXL 模型 Lora 训练
- [x] 支持混沌视频模型 LoRA 训练
- [x] 支持 Flux Kontext 模型 LoRA 训练
- [x] 支持 Wan2.1 模型 LoRA 训练
- [x] 支持 Wan2.2 模型 LoRA 训练
- [x] 支持 Qwen Image（Edit）模型 LoRA 训练
- [ ] 持久化任务状态到数据库

## 鸣谢

本训练器的开发与成功离不开以下开源项目的宝贵支持与贡献，我们在此致以诚挚的感谢：

- **[kohya-ss/sd-scripts](https://github.com/kohya-ss/sd-scripts)**：其卓越的脚本对 Flux1 模型的训练起到了关键作用。
- **[ostris/ai-toolkit](https://github.com/ostris/ai-toolkit)**：为 Flux Kontext 模型的训练提供了重要脚本。
- **[tdrussell/diffusion-pipe](https://github.com/tdrussell/diffusion-pipe)**：为 混元视频模型的训练提供了核心脚本。
- **[kohya-ss/musubi-tuner](https://github.com/kohya-ss/musubi-tuner)**：其脚本支持了 Wan2.1/2.2 及 Qwen Image（Edit）模型的训练。

这些项目的贡献共同构成了本训练器得以实现和优化的坚实基础。
