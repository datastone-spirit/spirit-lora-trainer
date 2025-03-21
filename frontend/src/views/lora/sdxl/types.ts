/*
 * @Author: mulingyuer
 * @Date: 2024-12-06 14:57:11
 * @LastEditTime: 2025-01-10 11:28:19
 * @LastEditors: mulingyuer
 * @Description: sdxl类型定义
 * @FilePath: \frontend\src\views\lora\sdxl\types.ts
 * 怎么可能会有bug！！！
 */

// model_train_type:sdxl-lora   这个参数固定

/** 表单 */
export interface RuleForm {
	/** lora名称 */
	output_name: string;
	/** 触发词 */
	class_tokens: string;
	/** 底模 */
	pretrained_model_name_or_path: string;
	/** 从某个 save_state 保存的中断状态继续训练，选择文件路径 */
	resume: string;
	/** vae */
	vae: string;
	/** lora保存路径 */
	output_dir: string;
	/** 模型保存格式 */
	save_model_as: string;
	/** 模型保存精度 */
	save_precision: string;
	/** 保存训练状态 配合 resume 参数可以继续从某个状态训练 */
	save_state: boolean;
	// ---------
	/** 数据集目录 */
	image_dir: string;
	/** 打标模型 */
	tagger_model: string;
	/** 每个图像重复训练次数 */
	num_repeats: number;
	/** 最大训练 epoch（轮数） */
	max_train_epochs: number;
	/** 批量大小, 越高显存占用越高 */
	train_batch_size: number;
	/** 图片尺寸-宽度 */
	resolution_width: number;
	/** 图片尺寸-高度 */
	resolution_height: number;
	/** 启用 arb 桶以允许非固定宽高比的图片 */
	enable_bucket: boolean;
	/** arb 桶最小分辨率 */
	min_bucket_reso: number;
	/** arb 桶最大分辨率 */
	max_bucket_reso: number;
	/** arb 桶分辨率划分单位，SDXL 可以使用 32 (SDXL低于32时失效) */
	bucket_reso_steps: number;
	// ---------
	/** 随机种子 */
	seed: number;
	/** 总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效。 */
	learning_rate: string;
	/** 每 N epoch（轮）自动保存一次模型 */
	save_every_n_epochs: number;
	/** 网络维度，常用 4~128，不是越大越好, 低dim可以降低显存占用 */
	network_dim: number;
	// ---------
	/** 梯度检查点 */
	gradient_checkpointing: boolean;
	/** 梯度累加步数 */
	gradient_accumulation_steps: number | undefined;
	/** 仅训练 U-Net 训练SDXL Lora时推荐开启 */
	network_train_unet_only: boolean;
	/** 仅训练文本编码器 */
	network_train_text_encoder_only: boolean;
	// ---------
	/** U-Net 学习率 */
	unet_lr: string;
	/** 文本编码器学习率 */
	text_encoder_lr: string;
	/** 学习率调度器设置 */
	lr_scheduler: string;
	/** 学习率预热步数 */
	lr_warmup_steps: number;
	/** 重启次数 */
	lr_scheduler_num_cycles: number;
	/** 优化器设置 */
	optimizer_type: string;
	/** 最小信噪比伽马值, 如果启用推荐为 5 */
	min_snr_gamma: number | undefined;
	/**
	 * 自定义优化器选项参数，可以key=value的格式指定多个值，以空格分隔。
	 * 示例：weight_decay=0.01 betas=.9,.999
	 */
	optimizer_args: string;
	// ---------
	/** 训练网络模块 */
	network_module: string;
	/** 从已有的 LoRA 模型上继续训练 */
	network_weights: string;
	/** 视为 OFT 的约束。我们建议使用 1e-2 到 1e-4 */
	network_alpha: string;
	/** dropout 概率 （与 lycoris 不兼容，需要用 lycoris 自带的） */
	network_dropout: number;
	/** 最大范数正则化。如果使用，推荐为 1 */
	scale_weight_norms: number | undefined;
	/** 自定义 network_args
	 * 示例："context_attn_dim=2" "context_mlp_dim=3" "context_mod_dim=4"
	 */
	network_args: string;
	/** 启用分层学习率训练（只支持网络模块 networks.lora） */
	enable_block_weights: boolean;
	/** 启用基础权重（差异炼丹） */
	enable_base_weight: boolean;
	/** 分层学习-U-Net 的 Encoder 层分层学习率权重，共 12 层 */
	down_lr_weight: string;
	/** 分层学习-U-Net 的 Mid 层分层学习率权重，共 1 层 */
	mid_lr_weight: string;
	/** 分层学习-U-Net 的 Decoder 层分层学习率权重，共 12 层 */
	up_lr_weight: string;
	/** 分层学习-分层学习率置 0 阈值 */
	block_lr_zero_threshold: number;
	/** 基础权重-合并入底模的 LoRA 路径，可以选择多个 */
	base_weights: string;
	/** 基础权重-合并入底模的 LoRA 权重，英文逗号分隔，与 base_weights 对应 */
	base_weights_multiplier: number | null;
	// ---------
	/** 启用训练预览图 */
	enable_preview: boolean;
	// ---------
	/** 日志保存文件夹 */
	logging_dir: string;
	// ---------
	/** Tag 文件扩展名 */
	caption_extension: string;
	/** 训练时随机打乱 tokens */
	shuffle_caption: boolean;
	/** 使用带权重的 token，不推荐与 shuffle_caption 一同开启 */
	weighted_captions: boolean;
	/** 在随机打乱 tokens 时，保留前 N 个不变 */
	keep_tokens: number;
	/** 保留 tokens 时使用的分隔符 */
	keep_tokens_separator: string;
	/** 最大 token 长度 */
	max_token_length: number;
	/** 丢弃全部标签的概率，对一个图片概率不使用 caption 或 class token */
	caption_dropout_rate: number | undefined;
	/** 每 N 个 epoch 丢弃全部标签 */
	caption_dropout_every_n_epochs: number | undefined;
	/** 按逗号分隔的标签来随机丢弃 tag 的概率 */
	caption_tag_dropout_rate: number | undefined;
	// ---------
	/** 在训练中添加噪声偏移来改良生成非常暗或者非常亮的图像，如果启用推荐为 0.1 */
	noise_offset: number | undefined;
	/** 多分辨率（金字塔）噪声迭代次数 推荐 6-10。无法与 noise_offset 一同启用 */
	multires_noise_iterations: number | undefined;
	/** 多分辨率（金字塔）衰减率 推荐 0.3-0.8，须同时与上方参数 multires_noise_iterations 一同启用 */
	multires_noise_discount: number | undefined;
	// ---------
	/** 颜色改变 */
	color_aug: boolean;
	/** 图像翻转 */
	flip_aug: boolean;
	/** 随机剪裁 */
	random_crop: boolean;
	// ---------
	/** CLIP 跳过层数 玄学 */
	clip_skip: number;
	// ---------
	/** 训练混合精度, RTX30系列以后也可以指定bf16 */
	mixed_precision: string;
	/** 完全使用 FP16 精度 */
	full_fp16: boolean;
	/** 完全使用 BF16 精度 */
	full_bf16: boolean;
	/** 对基础模型使用 FP8 精度 */
	fp8_base: boolean;
	/** 不使用半精度 VAE */
	no_half_vae: boolean;
	/** 启用 xformers */
	xformers: boolean;
	/** 启用 sdpa */
	sdpa: boolean;
	/** 低内存模式 该模式下会将 U-net、文本编码器、VAE 直接加载到显存中 */
	lowram: boolean;
	/** 缓存图像 latent, 缓存 VAE 输出以减少 VRAM 使用 */
	cache_latents: boolean;
	/** 缓存图像 latent 到磁盘 */
	cache_latents_to_disk: boolean;
	/** 缓存文本编码器的输出，减少显存使用。使用时需要关闭 shuffle_caption */
	cache_text_encoder_outputs: boolean;
	/** 缓存文本编码器的输出到磁盘 */
	cache_text_encoder_outputs_to_disk: boolean;
	/** 保留加载训练集的worker，减少每个 epoch 之间的停顿 */
	persistent_data_loader_workers: boolean;
	/** vae 编码批量大小 */
	vae_batch_size: number | undefined;
	// ---------
	/** 分布式训练超时时间 */
	ddp_timeout: number | undefined;
	/** 启动梯度作为bucket视图进行同步 */
	ddp_gradient_as_bucket_view: boolean;
}
