/*
 * @Author: mulingyuer
 * @Date: 2025-03-20 09:30:27
 * @LastEditTime: 2025-03-24 09:31:21
 * @LastEditors: mulingyuer
 * @Description: wan类型
 * @FilePath: \frontend\src\views\lora\wan\types.ts
 * 怎么可能会有bug！！！
 */

/** 表单类型 */
export interface RuleForm {
	/** 输出的模型名称 */
	output_name: string;
	/** 触发词 */
	class_tokens: string;
	// ---------
	/** 数据集目录 */
	image_dir: string;
	/** 打标模型 */
	tagger_model: string;
	/** joy-caption-alpha-two打标模型的提示词类型 */
	prompt_type: string;
	/** 是否把触发词输出到打标文件中 */
	output_trigger_words: boolean;
	/** 打标高级设置 */
	tagger_advanced_settings: boolean;
	/** 打标提示词 */
	tagger_global_prompt: string;
	/** 是否追加到已有打标文件中 */
	tagger_is_append: boolean;
	// ---------
	/** 任务类型 */
	task: string;
	/** wan2模型地址 */
	dit: string;
	/** 使用PyTorch原生注意力 */
	sdpa: boolean;
	/** 混合精度模式 */
	mixed_precision: string;
	/** 启用基础FP8模式 */
	fp8_base: boolean;
	/** FP8缩放模式 */
	fp8_scaled: boolean;
	/** T5模型路径 */
	t5_model: string;
	/** T5使用FP8模式 */
	fp8_t5: boolean;
	/** T5模型的预训练权重文件的路径 */
	t5_checkpoint: string;
	/** T5模型的分词器 */
	t5_tokenizer: string;
	/** vae模型路径 */
	vae: string;
	/** VAE模型的预训练权重文件的路径 */
	vae_checkpoint: string;
	/** vae维度跨度 */
	vae_stride: string;
	/** 优化器类型 */
	optimizer_type: string;
	/** 学习率（需转换为数字） */
	learning_rate: string;
	/** 显存优化开关 */
	gradient_checkpointing: boolean;
	/** LoRA模块地址 */
	// network_module: string;
	/** LoRA维度 */
	network_dim: number;
	/** 融合模型保存名称 */
	save_merged_model: string;
	/** 运动流控制参数 */
	discrete_flow_shift: number;
	/** 文本长度限制 */
	text_len: number;
	/** 训练轮数 */
	epoch: number;
	/** 保存间隔轮数 */
	save_every_n_epochs: number;
	/** 分类器引导强度 */
	guidance_scale: number;
	/** 时间步采样方法 */
	timestep_sampling: string;
	/** Sigmoid采样缩放因子 */
	sigmoid_scale: number;
	/** 时间步加权方案 */
	weighting_scheme: string;
	/** logit_normal均值 */
	logit_mean: number;
	/** logit_normal标准差 */
	logit_std: number;
	/** mode加权缩放因子 */
	mode_scale: number;
	/** 最小时间步（0-999） */
	min_timestep: number;
	/** 最大时间步（1-1000）*/
	max_timestep: number;
	/** 输出目录路径 */
	output_dir: string;
	/** 保存训练状态 配合 resume 参数可以继续从某个状态训练 */
	save_state: boolean;
	/** 恢复训练状态文件目录 */
	resume: string;
	/** 扩散模型总时间步 */
	num_train_timesteps: number;
	/** 视频采样帧率 */
	sample_fps: number;
	/** 默认负面提示词 */
	sample_neg_prompt: string;
	// --------- I2V-14B配置
	/** CLIP模型路径 */
	clip: string;
	/** CLIP模型的预训练权重文件的路径 */
	clip_checkpoint: string;
	/** CLIP模型的分词器 */
	clip_tokenizer: string;
	// --------- I2V和T2V公共配置
	/** 视频patch划分 */
	patch_size: string;
	/** 隐藏层维度 */
	dim: number;
	/** FeedForward维度 */
	ffn_dim: number;
	/** 注意力头数 */
	num_heads: number;
	/** 总层数 */
	num_layers: number;
	/** 全局注意力窗口 */
	window_size: string;
	/** Q/K归一化 */
	qk_norm: boolean;
	/** 交叉注意力归一化 */
	cross_attn_norm: boolean;
	// --------- 数据集
	/** 图片尺寸-宽度 */
	resolution_width: number;
	/** 图片尺寸-高度 */
	resolution_height: number;
	/** 批次大小 */
	batch_size: number;
	/** 启用动态分辨率，启用 arb 桶以允许非固定宽高比的图片 */
	enable_bucket: boolean;
	/** 允许小图放大，arb 桶不放大图片 */
	bucket_no_upscale: boolean;
	/** 缓存的目录 */
	cache_directory: string;
	/** 单帧训练模式 */
	target_frames: string;
	/** 提取首帧 */
	frame_extraction: string;
	/** 数据集重复次数 */
	num_repeats: number;
	/** 初始帧的图片文件地址 I2V-14B */
	image_jsonl_file_image_path: string;
	/** 初始帧的图片描述 */
	image_jsonl_file_caption: string;
}
