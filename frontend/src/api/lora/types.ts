/*
 * @Author: mulingyuer
 * @Date: 2024-12-17 10:28:36
 * @LastEditTime: 2024-12-17 15:36:12
 * @LastEditors: mulingyuer
 * @Description: lora api类型
 * @FilePath: \frontend\src\api\lora\types.ts
 * 怎么可能会有bug！！！
 */

/** 训练lora参数 */
export interface TrainLoraData {
	config: {
		/** 启用基础权重（差异炼丹） */
		enable_base_weight: boolean;
		// base_weights: string;
		// base_weights_multiplier: number;
		/** 启用 arb 桶以允许非固定宽高比的图片 */
		enable_bucket: boolean;
		/** arb 桶不放大图片 */
		bucket_no_upscale: boolean;
		/** arb 桶分辨率划分单位，SDXL 可以使用 32 (SDXL低于32时失效) */
		bucket_reso_steps: number;
		/** 缓存图像 latent, 缓存 VAE 输出以减少 VRAM 使用 */
		cache_latents: boolean;
		/** 缓存图像 latent 到磁盘 */
		cache_latents_to_disk: boolean;
		/** 缓存文本编码器的输出，减少显存使用。使用时需要关闭 shuffle_caption */
		cache_text_encoder_outputs: boolean;
		/** 缓存文本编码器的输出到磁盘 */
		cache_text_encoder_outputs_to_disk: boolean;
		/** Tag 文件扩展名 */
		caption_extension: string;
		// dataset里面有，这里还要吗？
		// /** 触发词 */
		// class_tokens: string;
		/** 颜色改变 */
		color_aug: boolean;
		/** 为 DDP 启用 gradient_as_bucket_view  */
		ddp_gradient_as_bucket_view: boolean;
		/** Euler 调度器离散流位移 */
		discrete_flow_shift: number;
		/** 启用训练预览图 */
		enable_preview: boolean;
		/** 图像翻转 */
		flip_aug: boolean;
		/** 对基础模型使用 FP8 精度 */
		fp8_base: boolean;
		/** 仅对 U-Net 使用 FP8 精度（CLIP-L不使用） */
		fp8_base_unet: boolean;
		/** 完全使用 FP16 精度 */
		full_fp16: boolean;
		/** 完全使用 BF16 精度 */
		full_bf16: boolean;
		/** 梯度累加步数 */
		gradient_accumulation_steps: number;
		/** 梯度检查点 */
		gradient_checkpointing: boolean;
		/** flux CFG 引导缩放 */
		guidance_scale: number;
		// dataset里面有，这里还要吗？
		/** 在随机打乱 tokens 时，保留前 N 个不变 */
		// keep_tokens: number;
		/** 保留 tokens 时使用的分隔符 */
		keep_tokens_separator: string;
		/** 总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效。格式化成数字 */
		learning_rate: number;
		/** 日志前缀 */
		log_prefix: string;
		/** 日志追踪器名称 */
		log_tracker_name: string;
		/** 日志模块 */
		log_with: string;
		/** 日志保存文件夹 */
		logging_dir: string;
		/** 损失函数类型 */
		loss_type: string;
		/** 低内存模式 该模式下会将 U-net、文本编码器、VAE 直接加载到显存中 */
		lowram: boolean;
		/** 学习率调度器设置 */
		lr_scheduler: string;
		/** 重启次数 */
		lr_scheduler_num_cycles: number;
		/** 学习率预热步数 */
		lr_warmup_steps: number;
		/** arb 桶最大分辨率 */
		max_bucket_reso: number;
		/** workers 数量 */
		max_data_loader_n_workers: number;
		/** 最大训练 epoch（轮数） */
		max_train_epochs: number;
		/** arb 桶最小分辨率 */
		min_bucket_reso: number;
		/** 训练混合精度, RTX30系列以后也可以指定bf16 */
		mixed_precision: string;
		/** 模型预测类型 */
		model_prediction_type: string;
		/** 视为 OFT 的约束。我们建议使用 1e-2 到 1e-4 */
		network_alpha: string;
		// 不是改成 network_args，然后值是string了吗？
		// "network_args_custom": [],
		/** 网络维度，常用 4~128，不是越大越好, 低dim可以降低显存占用 */
		network_dim: number;
		/** dropout 概率 （与 lycoris 不兼容，需要用 lycoris 自带的） */
		network_dropout: number;
		/** 训练网络模块 */
		network_module: string;
		/** 仅训练文本编码器 */
		network_train_text_encoder_only: boolean;
		/** 仅训练 U-Net */
		network_train_unet_only: boolean;
		/** 从已有的 LoRA 模型上继续训练，填写路径 */
		network_weights: string;
		/** 不使用半精度 VAE */
		no_half_vae: boolean;
		/** 每个图像重复训练次数 */
		num_repeats: number;
		// 秋叶没有啊，
		// dataset_repeats: number;
		// 不是改成 optimizer_args 吗？
		// optimizer_args_custom:string;
		/** 优化器设置 */
		optimizer_type: string;
		/** lora保存路径 */
		output_dir: string;
		/** lora名称 */
		output_name: string;
		/** 保留加载训练集的worker，减少每个 epoch 之间的停顿 */
		persistent_data_loader_workers: boolean;
		/** 随机剪裁 */
		random_crop: boolean;
		// 不是改成 resolution 吗？
		// resolution_height:number;
		// resolution_width:number;
		/** 从某个 save_state 保存的中断状态继续训练，选择文件路径 */
		resume: string;
		/** 每 N epoch（轮）自动保存一次模型 */
		save_every_n_epochs: number;
		/** 模型保存格式 */
		save_model_as: string;
		/** 模型保存精度 */
		save_precision: string;
		// 官方只有save_state_on_train_end 配置
		// save_state:boolean;
		/** 启用 sdpa */
		sdpa: boolean;
		/** 随机种子 */
		seed: number;
		/** 训练时随机打乱 tokens */
		shuffle_caption: boolean;
		/** sigmoid 缩放 */
		sigmoid_scale: number;
		/** 文本编码器学习率，转成数字 */
		text_encoder_lr: number;
		/** flux 时间步采样 */
		timestep_sampling: string;
		/** 批量大小, 越高显存占用越高 */
		train_batch_size: number;
		// 这个和 dataset里的image_dir重复了吧
		// train_data_dir:string;
		// 搜不到这个参数
		// ui_custom_params:string;
		/** U-Net 学习率，转成数字 */
		unet_lr: number;
		/** 使用带权重的 token，不推荐与 shuffle_caption 一同开启 */
		weighted_captions: boolean;
	};
	dataset: {
		datasets: [
			{
				/** 使用的train_batch_size，这里用了config对象里就不传  */
				batch_size: number;
				/** 在随机打乱 tokens 时，保留前 N 个不变 */
				keep_tokens: number;
				/** 图像分辨率: 512,512 */
				resolution: string;
				subsets: {
					/** 触发词 */
					class_tokens: string;
					/** 数据集目录 */
					image_dir: string;
					/** 每个图像重复训练次数 */
					num_repeats: number;
				};
			}
		];
		general: {
			/** Tag 文件扩展名 */
			caption_extension: string;
			/** 在随机打乱 tokens 时，保留前 N 个不变 */
			keep_tokens: number;
			/** 训练时随机打乱 tokens */
			shuffle_caption: boolean;
		};
	};
}

/**
 * 缺少 "pretrained_model_name_or_path"
 * ae
 * clip_l
 * t5xxl
 * tagger_model
 * t5xxl_max_token_length
 * min_snr_gamma
 * scale_weight_norms
 * caption_dropout_rate
 * caption_dropout_every_n_epochs
 * caption_tag_dropout_rate
 * clip_skip
 * vae_batch_size
 * ddp_timeout
 *
 */
