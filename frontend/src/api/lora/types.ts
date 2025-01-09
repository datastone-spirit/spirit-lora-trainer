/*
 * @Author: mulingyuer
 * @Date: 2024-12-17 10:28:36
 * @LastEditTime: 2025-01-09 15:50:24
 * @LastEditors: mulingyuer
 * @Description: lora api类型
 * @FilePath: \frontend\src\api\lora\types.ts
 * 怎么可能会有bug！！！
 */

/** 启动flux训练参数 */
export interface StartFluxTrainingData extends Record<string, any> {
	config: {
		/** 底模 */
		pretrained_model_name_or_path: string;
		/** 启用基础权重（差异炼丹） */
		enable_base_weight: boolean;
		/** 基础权重-合并入底模的 LoRA  */
		base_weights: string;
		/** 基础权重-合并入底模的 LoRA 权重，与 base_weights 对应 */
		base_weights_multiplier: number | undefined;
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
		/** 保留 tokens 时使用的分隔符 */
		keep_tokens_separator: string;
		/** 总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效。格式化成数字 */
		learning_rate: number | undefined;
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
		network_alpha: number | undefined;
		/** 自定义 network_args
		 * 示例："context_attn_dim=2" "context_mlp_dim=3" "context_mod_dim=4"
		 */
		network_args: string | null;
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
		/** 每个图像重复训练次数（优先级高） */
		num_repeats: number;
		/** 每个图像重复训练次数  */
		// dataset_repeats: number | undefined;
		/**
		 * 自定义优化器选项参数，可以key=value的格式指定多个值，以空格分隔。
		 * 示例：weight_decay=0.01 betas=.9,.999
		 */
		optimizer_args: string | null;
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
		/** 从某个 save_state 保存的中断状态继续训练，选择文件路径 */
		resume: string;
		/** 每 N epoch（轮）自动保存一次模型 */
		save_every_n_epochs: number;
		/** 模型保存格式 */
		save_model_as: string;
		/** 模型保存精度 */
		save_precision: string;
		/** 保存训练状态 配合 resume 参数可以继续从某个状态训练 */
		save_state: boolean;
		/** 启用 sdpa */
		sdpa: boolean;
		/** 随机种子 */
		seed: number;
		/** 训练时随机打乱 tokens */
		shuffle_caption: boolean;
		/** sigmoid 缩放 */
		sigmoid_scale: number;
		/** 文本编码器学习率，转成数字 */
		text_encoder_lr: number | undefined;
		/** flux 时间步采样 */
		timestep_sampling: string;
		/** 批量大小, 越高显存占用越高 */
		train_batch_size: number;
		/** U-Net 学习率，转成数字 */
		unet_lr: number | undefined;
		/** 使用带权重的 token，不推荐与 shuffle_caption 一同开启 */
		weighted_captions: boolean;
		/** AE 模型文件路径 */
		ae: string;
		/** CLIP-L 模型文件路径 */
		clip_l: string;
		/** t5xxl 模型文件路径 */
		t5xxl: string;
		/** 打标模型 */
		tagger_model: string;
		/** T5XXL 最大 token 长度（不填写使用自动），默认情况下，开发模式为 512，快速模式为 256 */
		t5xxl_max_token_length: number | undefined;
		/** 高显存模式 */
		highvram: boolean;
		/** 最小信噪比伽马值, 如果启用推荐为 5 */
		min_snr_gamma: number | undefined;
		/** 最大范数正则化。如果使用，推荐为 1 */
		scale_weight_norms: number | undefined;
		/** 丢弃全部标签的概率，对一个图片概率不使用 caption 或 class token */
		caption_dropout_rate: number | undefined;
		/** 每 N 个 epoch 丢弃全部标签 */
		caption_dropout_every_n_epochs: number | undefined;
		/** 按逗号分隔的标签来随机丢弃 tag 的概率 */
		caption_tag_dropout_rate: number | undefined;
		/** CLIP 跳过层数 玄学 */
		clip_skip: number;
		/** vae 编码批量大小 */
		vae_batch_size: number | undefined;
		/** 分布式训练超时时间（分钟） */
		ddp_timeout: number | undefined;
		/** 图像分辨率: 512,512 */
		resolution: string;
		/** 输出训练配置 */
		output_config: boolean;
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
				subsets: [
					{
						/** 触发词 */
						class_tokens: string;
						/** 数据集目录 */
						image_dir: string;
						/** 每个图像重复训练次数 */
						num_repeats: number;
					}
				];
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

/** 启动flux训练结果 */
export interface StartFluxTrainingResult {
	msg: string;
	success: boolean;
	/** 任务id */
	task_id: string;
}

/** 启动混元视频训练参数 */
export interface StartHyVideoTrainingData {
	config: {
		output_dir: string;
		epochs: number;
		micro_batch_size_per_gpu: number;
		pipeline_stages: number;
		gradient_accumulation_steps: number;
		gradient_clipping: number;
		warmup_steps: number;
		eval_every_n_epochs: number;
		eval_before_first_step: boolean;
		eval_micro_batch_size_per_gpu: number;
		eval_gradient_accumulation_steps: number;
		save_every_n_epochs: number;
		checkpoint_every_n_minutes: number;
		activation_checkpointing: boolean;
		partition_method: string;
		save_dtype: string;
		caching_batch_size: number;
		steps_per_print: number;
		video_clip_mode: string;
		model: {
			type: string;
			transformer_path: string;
			vae_path: string;
			llm_path: string;
			clip_path: string;
			dtype: string;
			transformer_dtype: string;
			timestep_sample_method: string;
		};
		adapter: {
			type: string;
			rank: number;
			dtype: string;
			init_from_existing: string;
		};
		optimizer: {
			type: string;
			lr: number;
			betas: number[];
			weight_decay: number;
			eps: number;
		};
	};
	dataset: {
		resolutions: number[];
		enable_ar_bucket: boolean;
		min_ar: number;
		max_ar: number;
		num_ar_buckets: number;
		// ar_buckets?: number[];
		frame_buckets: number[];
		directories: Array<{
			path: string;
			num_repeats: number;
			resolutions: number[];
			// ar_buckets?: number;
			frame_buckets: number[];
		}>;
	};
}

/** 启动混元视频训练结果 */
export interface StartHyVideoTrainingResult {
	msg: string;
	success: boolean;
	/** 任务id */
	task_id: string;
}
