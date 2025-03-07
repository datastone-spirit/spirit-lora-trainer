# 智灵训练器

Spirit Lora Trainer 是一款功能强大的工具，旨在提供简单且可靠的方式来训练 Flux1-LoRA 模型。它基于 kohya-ss script 构建，拥有简洁直观的用户界面，能够有效简化模型训练过程，同时提供实时监控功能，其分离架构确保了训练过程的稳定性。训练器支持基本的训练工作流程，包括模型训练和图像打标。

## 环境变量

### 开发模式

需要在项目根目录创建 `.env.development` 文件，并在其中添加`.env.example`示例文件中定义的环境变量，其中 `NODE_ENV` 变量需要设置为 `development`

示例：

```env
# 本地环境
NODE_ENV="development"

```

### 生产模式

默认情况下已经设置好了生产环境的环境变量，无需额外设置。如果有定制需求可以自行修改 `.env.production` 文件。

### 自定义环境变量文件

如果需要使用自定义环境变量文件，需要使用`-mode xxx`命令模式，比如我们使用`build`命令打包：

```bash
pnpm run build -mode aaa
```

这就表示build命令需要使用`.env.aaa`环境变量文件。
