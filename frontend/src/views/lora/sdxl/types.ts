/*
 * @Author: mulingyuer
 * @Date: 2024-12-06 14:57:11
 * @LastEditTime: 2024-12-06 15:49:44
 * @LastEditors: mulingyuer
 * @Description: sdxl类型定义
 * @FilePath: \frontend\src\views\lora\sdxl\types.ts
 * 怎么可能会有bug！！！
 */

/** 表单 */
export interface RuleForm {
	/** lora名称 */
	output_name: string;
	/** 触发词 */
	class_tokens: string;
	/** 底模 */
	pretrained_model_name_or_path: string;
	/** 从某个 save_state 保存的中断状态继续训练，填写文件路径 */
	resume: string;
	/** vae */
	vae: string;
	/** lora保存路径 */
	output_dir: string;
	/** 模型保存格式 */
	save_model_as: string;
	/** 模型保存精度 */
	save_precision: string;
	/** 每 N epoch（轮）自动保存一次模型 */
	save_every_n_epochs: number;
	/** 保存训练状态 配合 resume 参数可以继续从某个状态训练 */
	save_state: boolean;
	/** 数据集目录 */
	train_data_dir: string;
	/** 每个图像重复训练次数 */
	num_repeats: number;
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
	/** 最大训练 epoch（轮数） */
	max_train_epochs: number;
	/** 批量大小, 越高显存占用越高 */
	train_batch_size: number;
	/** 梯度检查点 */
	gradient_checkpointing: boolean;
	/** 梯度累加步数 */
	gradient_accumulation_steps: number | undefined;
	/** 仅训练 U-Net 训练SDXL Lora时推荐开启 */
	network_train_unet_only: boolean;
	/** 仅训练文本编码器 */
	network_train_text_encoder_only: boolean;
	/** 总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效。 */
	learning_rate: string;
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
	/** 自定义 optimizer_args，一行一个 */
	optimizer_args_custom: Array<string>;
}
