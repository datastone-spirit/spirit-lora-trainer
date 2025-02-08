/*
 * @Author: mulingyuer
 * @Date: 2025-01-06 10:37:35
 * @LastEditTime: 2025-02-08 10:17:24
 * @LastEditors: mulingyuer
 * @Description: 混元视频类型定义
 * @FilePath: \frontend\src\views\lora\hunyuan-video\types.ts
 * 怎么可能会有bug！！！
 */

/** 表单 */
export interface RuleForm {
	// --------- LoRA 基本信息 ---------
	/** 触发词 */
	class_tokens: string;
	// --------- 模型配置 ---------
	/** 底模路径 */
	model_transformer_path: string;
	/** vae路径 */
	model_vae_path: string;
	/** llm路径 */
	model_llm_path: string;
	/** clip路径 */
	model_clip_path: string;
	/** 用于所有模型的基础 dtype */
	model_dtype: string;
	/** 底模 dtype */
	model_transformer_dtype: string;
	/** 采样时间方式 */
	model_timestep_sample_method: string;
	/** 保存路径 */
	output_dir: string;
	// --------- 数据集配置 ---------
	/** 数据集路径 */
	directory_path: string;
	/** 数据集重复训练次数 */
	directory_num_repeats: number;
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
	/** 图片尺寸-宽度 */
	resolution_width: number; //resolution = [512, 512]
	/** 图片尺寸-高度 */
	resolution_height: number; //resolution = [512, 512]
	/** 启用长宽比分桶 */
	enable_ar_bucket: boolean;
	/** 最小长宽比 */
	min_ar: number;
	/** 最大长宽比 */
	max_ar: number;
	/** 长宽比桶的总数，在 min_ar 和 max_ar 之间均匀分布（在对数空间中） */
	num_ar_buckets: number;
	/** 对于视频训练，您需要配置帧桶（类似于长宽比桶）,示例：1, 33, 65 */
	frame_buckets: string;
	// --------- 训练设置 ---------
	/** epochs */
	epochs: number;
	/** 单个 GPU 的一次前向/后向传递的批大小 */
	micro_batch_size_per_gpu: number;
	/** 流水线并行度。模型的一个实例被划分到这么多 GPU 上 */
	pipeline_stages: number;
	/** 如果 pipeline_stages > 1，较高的 GAS 表示由于更小的流水线空洞（GPU 没有重叠计算），GPU 利用率更高 */
	gradient_accumulation_steps: number;
	/** 梯度范数裁剪 */
	gradient_clipping: number;
	/** 学习率预热 */
	warmup_steps: number;
	// --------- 评估设置 ---------
	/** 每n个epochs评估一次 */
	eval_every_n_epochs: number;
	/** 第一步前评估 */
	eval_before_first_step: boolean;
	/** 评估每个GPU的微批量大小 */
	eval_micro_batch_size_per_gpu: number;
	/** 评估梯度累积步骤 */
	eval_gradient_accumulation_steps: number;
	// --------- 杂项设置 ---------
	/** 每 N epoch（轮）自动保存一次模型 */
	save_every_n_epochs: number;
	/** 可以每 n 轮或分钟检查一次训练状态 */
	checkpoint_every_n_minutes: number;
	/** 除非您有大量 VRAM，否则始终设置为 true */
	activation_checkpointing: boolean;
	/** 控制 Deepspeed 如何决定将层划分到 GPU 上 */
	partition_method: string;
	/** 将 LoRA 或模型保存的 dtype */
	save_dtype: string;
	/** 缓存潜在变量和文本嵌入的批大小 */
	caching_batch_size: number;
	/** Deepspeed 记录到控制台的频率 */
	steps_per_print: number;
	/** 提取视频帧的方式 */
	video_clip_mode: string;
	// --------- 适配器配置 ---------
	/** 适配器类型 */
	adapter_type: string;
	/** rank */
	adapter_rank: number;
	/** 您正在训练的 LoRA 权重的 dtype */
	adapter_dtype: string;
	/** 您可以从先前训练的 lora 继续训练 */
	adapter_init_from_existing: string;
	// --------- 优化器配置 ---------
	/** 优化器类型 */
	optimizer_type: string;
	/** lr */
	optimizer_lr: string;
	/** betas */
	optimizer_betas: number[];
	/** weight_decay */
	optimizer_weight_decay: number;
	/** eps */
	optimizer_eps: string;
}
