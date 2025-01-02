
<p align="center">
  <img src="../public/images/logo.png" alt="智灵训练器" style="max-width: 100%;" />
</p>

# Spirit Lora Trainer 智灵训练器

## 介绍

Spirit Lora Trainer 是一款功能强大的工具包，旨在提供简单且可靠的方式来训练 Flux1-LoRA 模型。该工具包基于 [kohya-ss script](https://github.com/kohya-ss/sd-scripts)构建，拥有简洁直观的用户界面，能够有效简化模型训练过程，同时提供实时监控功能。其分离架构确保了训练过程的稳定性，支持基本的训练工作流程，包括模型训练和图像打标。

## 特征

- **简单**：Spirit Lora Trainer 是一个用户友好且直观的工具，用户只需配置少量参数即可训练自己的 Flux1 LoRA 模型。

- **可观察**：过实时显示关键指标（如损失值、训练步数、剩余预估时间等），用户可以轻松监控训练过程。

- **稳定**：软件基于分离式架构设计，确保训练状态持久化。即使在重新打开前端页面后，训练进度也不会丢失。

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

### 准备模型

在运行训练器之前，你需要准备相应的模型。这些模型分为两类，分别用于训练模型和图片打标。你可以从下表中下载模型，并根据表中的 `模型路径` 将它们放置在 `backend/models` 的相应目录下。

#### 训练模型

|模型名称|模型路径|模型描述|下载链接|分类|
|-|-|-|-|-|
|flux1-dev.safetensors|`backend/models/unet/`|The Unet model, released by the BlackForestLib | [Download](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors?download=true)|Training|
|ae.safetensors|`backend/models/vae/`|The Variation Auto Encoder model, released by the BlackForestLib | [Download](https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/ae.safetensors?download=true)|Training|
|clip_l.safetensors|`backend/models/clip/`|The Flux Text Encoder model, released by the BlackForestLib | [Download](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors?download=true)|Training|
|t5xxl_fp16.safetensors|`backend/models/clip/`|The Text to Text model, released by the Google | [Download](https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/t5xxl_fp16.safetensors?download=true)|Training|

#### 打标模型

##### Florence2

此模型专用于打标。

- **模型名称**: Florence2
- **模型路径**: `backend/models/florence2/models--multimodalart--Florence-2-large-no-flash-attn`
- **模型描述**: Florence2 是一个多模态模型，能够生成图像描述，基于 MultimodalArt。
- **下载命令**: 进入  `backend/models/florence2/models--multimodalart--Florence-2-large-no-flash-attn` 目录并运行命令: `huggingface-cli download multimodalart/Florence-2-large-no-flash-attn --localdir .`

##### Joy-Caption-Two-Alpha

Joy-Caption-Two-Alpha 模型在生成图像描述方面表现更佳。此大型模型结构复杂，需要更多资源。要使用 Joy-Caption-Two-Alpha 进行打标，需安装以下依赖项：

Llama3.1 模型

- **模型名称**: Llama3.1
- **模型路径**: `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit`
- **模型描述**: Llama3.1 是一个基于 Meta 发布的 Llama3.1 模型的大型语言模型（LLM）。
- **下载命令**:
  - 创建目录 `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit`
  - 进入目录  `backend/models/llm/Meta-Llama-3.1-8B-Instruct-bnb-4bit` 并运行命令：`huggingface-cli download unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit --local-dir .`

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
  - 进入目录  `backend/models/clip/siglip-so400m-patch14-384` 并运行命令：`huggingface-cli download google/siglip-so400m-patch14-384 --local-dir .`

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
- [ ] 支持 混元视频模型 Lora 训练
- [ ] 持久化任务状态到数据库

## 感谢

- 感谢 [kohya-ss](https://github.com/kohya-ss/sd-scripts) 为 Flux1 训练贡献了如此优秀的脚本，这些脚本使我们能够构建此训练器。
