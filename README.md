# Spirit Lora Trainer 智灵训练器


## Introduction

Spirit Lora Trainer is a robust toolkit for training Flux1-LoRA models with a focus on simplicity and reliability. It features a clean, intuitive interface that simplifies the model training process while providing real-time monitoring capabilities. Built on a decoupled architecture, it ensures stable training sessions. The toolkit supports essential machine learning workflows including model training and image captioning.

## Features

- **Simple**: Spirit Lora Trainer is designed to be user-friendly and intuitive. Train your own Flux1 LoRA model by configuring just a few parameters.

- **Observable**: Monitor your training process in real-time with key metrics including loss values, training steps, and estimated time remaining.

- **Stable**: Built with a decoupled frontend-backend architecture, Spirit Lora Trainer maintains training status persistence. Resume monitoring your training progress seamlessly even after reopening the frontend page.


## Prerequisite

### Frontend prerequisite:

First, you must install Node.js and pnpm, which are required to build and run the frontend.  We strongly recommend you install node via nvm, you can install nvm via the following command:

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

### Backend prerequisite:

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
- [ ] Support CogVideoX Model Lora Training