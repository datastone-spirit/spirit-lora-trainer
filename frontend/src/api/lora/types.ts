/*
 * @Author: mulingyuer
 * @Date: 2024-12-17 10:28:36
 * @LastEditTime: 2025-08-26 16:15:46
 * @LastEditors: mulingyuer
 * @Description: lora api类型
 * @FilePath: \frontend\src\api\lora\types.ts
 * 怎么可能会有bug！！！
 */

import type { MultiGpuConfig } from "../types";

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
		/** 每隔几步进行采样 */
		sample_every_n_steps: number | undefined;
		/**  采样提示词 */
		sample_prompts: string | undefined;
		/** 指定要交换的网络块数量，用于调整LoRA模型结构 */
		blocks_to_swap: number | undefined;
		/** 设置模型输出的logit均值，用于调整分布 */
		logit_mean: number;
		/** 设置模型输出的logit标准差，控制输出的离散程度 */
		logit_std: number;
		/** 模型模式的缩放因子，影响模型行为 */
		mode_scale: number;
		/** 是否禁用内存映射加载Safetensors文件，默认不禁用以节省内存 */
		disable_mmap_load_safetensors: boolean;
		/** 验证阶段的最大步数，限制验证时间 */
		max_validation_steps: number | undefined;
		/** 每隔多少个epoch进行一次验证 */
		validate_every_n_epochs: number | undefined;
		/** 每隔多少步进行一次验证 */
		validate_every_n_steps: number | undefined;
		/** 验证阶段的随机种子，确保验证可重复 */
		validation_seed: number | undefined;
		/** 数据集中用于验证的比例 */
		validation_split: number | undefined;
		/** 权重分配方案，控制训练中各部分的权重分布 */
		weighting_scheme: string;
		/** 是否启用分割模式，可能用于模型或数据的特殊处理 */
		split_mode: boolean;
		/** 文本编码器的批次大小，影响文本处理效率 */
		text_encoder_batch_size: number | undefined;
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
	/** 训练器的训练配置 */
	frontend_config: string;
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
		directory: Array<{
			path: string;
			num_repeats: number;
			resolutions: number[];
			// ar_buckets?: number;
			frame_buckets: number[];
		}>;
	};
	/** 训练器的训练配置 */
	frontend_config: string;
}

/** 启动混元视频训练结果 */
export interface StartHyVideoTrainingResult {
	msg: string;
	success: boolean;
	/** 任务id */
	task_id: string;
}

/** 启动wan视频训练参数 */
export interface StartWanVideoTrainingData {
	config: {
		// -------	LoRA 基本信息	-------
		/** 任务类型，i2v-14B|t2v-14B|t2v-A14B|i2v-A14B， 默认："i2v-14B" */
		task: string;
		/** 模型文件名，默认："" */
		output_name: string;
		/** wan2模型地址 */
		dit: string;
		/** wna2.2 high模型地址 */
		dit_high_noise: string;
		/** CLIP模型路径 */
		clip: string;
		/** T5模型路径，默认："" */
		t5: string;
		/** T5使用FP8模式，默认：false */
		fp8_t5: boolean;
		/** VAE模型路径，默认："" */
		vae: string;
		/** 将VAE缓存保留在CPU内存中（减少显存占用，但可能影响推理速度），默认：false */
		vae_cache_cpu: boolean;
		/** VAE模型的计算精度（默认float16），可选值如fp16/bf16/fp32等，默认："" */
		vae_dtype: string;
		/** 模型保存目录，默认："" */
		output_dir: string;
		// -------	数据集配置	-------
		/** 总训练轮数，默认：1 */
		max_train_epochs: number;
		/** 总训练步数，默认：undefined 【不展示】 */
		// max_train_steps: number | undefined;
		/** 随机种子，用于复现训练结果 */
		seed: number;
		/** 混合精度训练模式，"no", "fp16", "bf16"，默认："bf16" */
		mixed_precision: string;
		/** 保留加载训练集的worker，减少每个 epoch 之间的停顿，默认：false */
		persistent_data_loader_workers: boolean;
		/** 控制数据加载并行进程数，4-16（根据CPU核心数调整），默认：8 */
		max_data_loader_n_workers: number;
		/** 每N epoch保存模型，默认：undefined */
		save_every_n_epochs: number | undefined;
		// -------	优化器与学习率	-------
		/** 训练使用的优化器类型，默认："" */
		optimizer_type: string;
		/** 优化器的额外参数键值对，weight_decay=0.01 betas=0.9,0.999，默认："" */
		optimizer_args: string;
		/** 学习率，默认：2e-4 */
		learning_rate: number;
		/** 学习率衰减步数，0-总训练步数，默认：0 */
		lr_decay_steps: number;
		/** 学习率调度器类型选择，"cosine", "linear"，默认："constant" */
		lr_scheduler: string;
		/** 自定义调度器参数，默认："" */
		lr_scheduler_args: string;
		/** 最小学习率比例，0.01-0.1 */
		lr_scheduler_min_lr_ratio: number | undefined;
		/** 余弦重启次数，默认：1 */
		lr_scheduler_num_cycles: number;
		/** 多项式衰减强度，1.0-5.0，默认：1 */
		lr_scheduler_power: number;
		/** 逆平方根调度时间系数，默认：undefined */
		lr_scheduler_timescale: number | undefined;
		/** 自定义调度器模块，默认："" */
		lr_scheduler_type: string;
		/** 学习率预热步数，0 - 1000,默认：0 */
		lr_warmup_steps: number;
		// -------	模型结构相关	-------
		/** LoRA权重缩放因子，8-128（推荐等于dim），默认：1 */
		network_alpha: number;
		/** 自定义网络参数，"conv_dim=4 conv_alpha=1"，默认："" */
		network_args: string;
		/** LoRA的秩（rank），8-128，默认：64 */
		network_dim: number | undefined;
		/** 训练时随机失活比例，0.1-0.3，默认：undefined */
		network_dropout: number | undefined;
		/** 预训练权重文件路径，默认：""，空字符的情况下不要传递该属性 */
		network_weights: string;
		/** 用于自动从预训练权重中推断网络维度（rank）,必须与 --network_weights 配合使用，默认：false */
		dim_from_weights: boolean;
		/** 指定要交换的网络块数量，用于调整LoRA模型结构，默认36 */
		blocks_to_swap: number | undefined;
		/** wan2.2使用，需清理blocks_to_swap为0，默认值：I2V：0.9,T2V: 0.875 */
		timestep_boundary: number;
		/** 启用基础FP8模式，目前云端必须开启，默认：true */
		fp8_base: boolean;
		/** 启用FP8缩放模式，云端不支持，默认：false */
		fp8_scaled: boolean;
		// -------	训练过程控制	-------
		/** 每N步保存模型，默认：undefined */
		save_every_n_steps: number | undefined;
		/** 保留最近N个epoch的检查点，默认：undefined */
		save_last_n_epochs: number | undefined;
		/** 保留最近N步训练状态，默认：undefined */
		save_last_n_epochs_state: number | undefined;
		/** 保留最近N步的检查点，默认：undefined */
		save_last_n_steps: number | undefined;
		/** 专门控制state步数保留（覆盖save_last_n_steps），默认：undefined */
		save_last_n_steps_state: number | undefined;
		/** 保存训练状态 配合 resume 参数可以继续从某个状态训练，默认：true */
		save_state: boolean;
		/** 训练结束时强制保存state（即使未启用save_state），默认：false */
		save_state_on_train_end: boolean;
		/** 从某个 save_state 保存的中断状态继续训练，默认："" */
		resume: string;
		/** 权重标准化防梯度爆炸，默认：undefined */
		scale_weight_norms: number | undefined;
		/** 梯度裁剪阈值（防止梯度爆炸），0.5-2.0（0表示禁用），默认：1.0 */
		max_grad_norm: number;
		// -------	分布式训练	-------
		/** 启用梯度桶视图优化，默认：false */
		ddp_gradient_as_bucket_view: boolean;
		/** 固定结构模型加速, 默认：false */
		ddp_static_graph: boolean;
		/** 设置DDP进程间通信的超时时间 */
		ddp_timeout: number | undefined;
		// -------	采样与验证	-------
		/** 训练前生成初始样本，默认：false */
		sample_at_first: boolean;
		/** 每N个epoch生成样本，默认：undefined */
		sample_every_n_epochs: number | undefined;
		/** 每N步生成样本，默认：undefined */
		sample_every_n_steps: number | undefined;
		/** 采样使用的提示词，json格式：'{"image_path":"xx","prompt":"xxx"}' */
		sample_prompts: string | undefined;
		/** 文本控制强度，数值越大生成结果越遵循文本提示，默认：undefined */
		guidance_scale: number | undefined;
		// -------	高级显存优化	-------
		/** 显存优化技术，通过累积多个小批次的梯度来等效大batch_size训练，默认：1 */
		gradient_accumulation_steps: number;
		/** 显存优化技术，通过时间换空间策略，减少约30%显存占用，开启会增加训练时间，默认：true */
		gradient_checkpointing: boolean;
		/** 显存优化技术，将图像输入（img_in）和文本输入（txt_in）张量保留在CPU内存中，减少显存占用，默认：false */
		img_in_txt_in_offloading: boolean;
		/** 启用FlashAttention 3，默认：false */
		flash3: boolean;
		/** 启用FlashAttention优化CrossAttention计算，默认：false */
		flash_attn: boolean;
		/**  是否使用SageAttention优化节省显存，默认：false */
		sage_attn: boolean;
		/** 使用PyTorch原生注意力，默认：true */
		sdpa: boolean;
		/** 是否使用split attention优化（需要XFORMERS），默认：true */
		split_attn: boolean;
		/** 启用xformers优化库（需要安装xformers），用于CrossAttention层的显存优化，默认：true */
		xformers: boolean;
		/** wan2.2使用，将不活跃的 DiT 模型卸载到 CPU，节省显存，仅在未指定blocks_to_swap时生效，默认：false */
		offload_inactive_dit: boolean;
		// -------	扩散模型参数	-------
		/** 用于控制Euler离散调度器的时间步偏移量，主要影响视频生成的噪声调度过程，默认：3.0 */
		discrete_flow_shift: number;
		/** 最小扩散时间步长，0-999（控制起始噪声水平），默认：undefined */
		min_timestep: number | undefined;
		/** 最大扩散时间步长，1-1000（控制噪声水平），默认：undefined */
		max_timestep: number | undefined;
		/** 时间步权重分布集中度，1.0-2.0（值越大越集中），默认：1.29 */
		mode_scale: number;
		/** logit_normal权重均值，默认：0.0 */
		logit_mean: number;
		/** logit_normal权重标准差，默认：1.0 */
		logit_std: number;
		/** 时间步采样方法，uniform|sigmoid|shift|sigma，默认："shift" */
		timestep_sampling: string;
		/** 时间步采样sigmoid缩放系数（仅当timestep_sampling为sigmoid/shift时生效），默认：1.0 */
		sigmoid_scale: number;
		/** 时间步权重分配方案，可选值：logit_normal|mode|uniform|none，默认："none" */
		weighting_scheme: string;
		// // -------	日志与元数据	-------
		// /** 记录训练配置，默认：false */
		// log_config?: boolean;
		// /** 日志目录前缀，前端不需要展示出表单和传递给后端 */
		// log_prefix?: string;
		// /** 跟踪器配置文件路径 */
		// log_tracker_config?: string;
		// /** 自定义跟踪器名称 */
		// log_tracker_name?: string;
		// /** 指定日志工具 */
		// log_with?: string;
		// /** 日志存储目录，前端不需要展示出表单和传递给后端 */
		// logging_dir?: string;
		// /** 禁用元数据保存，默认：false */
		// no_metadata?: boolean;
		// /** 作者/开发者信息，默认："" */
		// metadata_author?: string;
		// /** 模型功能描述，默认："" */
		// metadata_description?: string;
		// /** 使用许可协议，默认："" */
		// metadata_license?: string;
		// /** 模型特征标签，英文逗号分隔，默认："" */
		// metadata_tags?: string;
		// /** 模型显示名称，默认："" */
		// metadata_title?: string;
		// /** 存储在模型元数据中的任意注释文本，默认："" */
		// training_comment?: string;
		// /** WandB服务的API密钥，用于训练前登录，前端不需要展示出表单和传递给后端 */
		// wandb_api_key?: string;
		// /** 指定WandB运行会话名称（显示在WandB日志中的实验名称），前端不需要展示出表单和传递给后端 */
		// wandb_run_name?: string;
		// // -------	HuggingFace集成	-------
		// /** 异步上传模型到huggingface，与huggingface_repo_id配合使用 */
		// async_upload?: boolean;
		// /** 指定仓库内存储路径 */
		// huggingface_path_in_repo?: string;
		// /** 指定HuggingFace仓库名称 */
		// huggingface_repo_id?: string;
		// /** 指定仓库类型 */
		// huggingface_repo_type?: string;
		// /** 控制仓库可见性：public/private */
		// huggingface_repo_visibility?: string;
		// /** API访问令牌（用于私有仓库操作） */
		// huggingface_token?: string;
		// /** 将state同步上传到HuggingFace仓库，默认：false */
		// save_state_to_huggingface: boolean;
		// /** 启用从HuggingFace模型仓库恢复训练状态的能力，默认：false */
		// resume_from_huggingface: boolean;
		// // -------	其他不需要的	-------
		// /** 指定在训练前需要合并到基础模型的预训练网络权重文件 */
		// base_weights?: string;
		// /** 用于指定预训练权重文件的融合比例，需要与 `base_weights` 配合使用 */
		// base_weights_multiplier?: number;
		// /** 训练配置文件的路径 */
		// config_file?: string;
		// /** 数据集配置 */
		// dataset_config?: string;
	};
	dataset: {
		general: {
			/** 图片尺寸，默认：[720, 480] */
			resolution: [number, number];
			/** 批次大小，默认：1 */
			batch_size: number;
			/** 启用动态分辨率，启用 arb 桶以允许非固定宽高比的图片，默认：true */
			enable_bucket: boolean;
			/** 允许小图放大，arb 桶不放大图片，默认：false */
			bucket_no_upscale: boolean;
			/** 描述文件扩展名，默认：".txt" */
			caption_extension: string;
			/** 数据集重复次数，默认：1 */
			num_repeats: number;
		};
		datasets: Array<StartWanVideoTrainingImageDataset | StartWanVideoTrainingVideoDataset>;
	};
	/** wan2.2 模型类型：high、low、both。默认low  */
	dit_model_type: string;
	/** 跳过图像潜空间缓存阶段，默认：false */
	skip_cache_latent: boolean;
	/** 跳过Text 编码潜空间缓存阶段，默认：false */
	skip_cache_text_encoder_latent: boolean;
	/** 训练器的训练配置 */
	frontend_config: string;
}

/** 启动wan视频训练参数-图片训练数据集 */
export interface StartWanVideoTrainingImageDataset {
	/** 数据目录 */
	image_directory: string;
	// /** 缓存目录，永远为空，后端自动生成 */
	// cache_directory?: string;
	// /** 后端生成的描述文件路径 */
	// image_jsonl_file?: string;
}

/** 启动wan视频训练参数-视频训练数据集 */
export interface StartWanVideoTrainingVideoDataset {
	/** 视频目录 */
	video_directory: string;
	/** 提取帧的方式，head|chunk|slide|uniform，默认："head" */
	frame_extraction: string;
	/** 是一个列表，指定了从视频中提取的帧的数量，例：[1,13,25] */
	target_frames: Array<number>;
	/** 是一个整数，仅在 frame_extraction 为 slide 时有效。它定义了提取帧时的步长，例：10，表示每隔 10 帧提取一次 */
	frame_stride: number;
	/** 指定从视频中均匀提取的样本数量，仅frame_extraction为uniform时有效，默认：1 */
	frame_sample: number;
	/** 视频描述文件路径，前端不需要展示和传递给后端 */
	// video_jsonl_file: string;
	/** 视频帧最大数量，前端不需要展示和传递给后端，默认最大129帧 */
	max_frames: number;
}

/** 视频训练结果 */
export interface StartWanVideoTrainingResult {
	msg: string;
	success: boolean;
	/** 任务id */
	task_id: string;
}

/** 获取wan视频素材训练集提取的图片帧数量参数 */
export type WanVideoVideoDatasetEstimateData = StartWanVideoTrainingData["dataset"];

/** 获取wan视频素材训练集提取的图片帧数量结果 */
export interface WanVideoVideoDatasetEstimateResult {
	/** 预估批次数量 */
	total_batches: number;
	/** 预估图片数量 */
	total_images: number;
}

/** 启动flux kontext 训练参数 */
export interface StartFluxKontextTrainingData {
	config: {
		/** lora名称 */
		name: string;
		process: [
			{
				/** 写死 */
				type: "sd_trainer";
				/** lora保存路径 */
				training_folder: string;
				/** lora触发词 */
				trigger_word: string;
				/** 写死 */
				device: "cuda:0";
				/** 目标配置 */
				network: {
					/** 写死 */
					type: "lora";
					/** LoRA 层的“秩”（rank），也称为 r 值，默认：32 */
					linear: number;
					/** 不需要UI展示，与linear值保持一致 */
					linear_alpha: number;
				};
				/** 保存配置 */
				save: {
					/** 保存lora的浮点精度，默认fp16 */
					dtype: string;
					/** 多少步骤（steps）保存一次模型，默认250 */
					save_every: number;
					/** 训练过程中最多保留多少个检查点，默认4 */
					max_step_saves_to_keep: number;
					/** 写死 */
					push_to_hub: false;
				};
				/** 训练配置 */
				train: {
					/** 批量大小，默认1 */
					batch_size: number;
					/** 训练步数，默认3000 */
					steps: number;
					/** 梯度累积，在job任务中使用的key为gradient_accumulation，默认1 */
					gradient_accumulation_steps: number;
					/** 写死，训练过程中是否更新 UNet 模型的权重，默认true */
					train_unet: true;
					/** 写死，训练过程中是否更新 Text Encoder 模型的权重，默认false */
					train_text_encoder: false;
					/** 写死，显存优化技术，启用梯度检查点，可以减少显存使用，但是增加训练时间，默认true */
					gradient_checkpointing: true;
					/** 噪声调度器，默认flowmatch */
					noise_scheduler: string;
					/** 优化器，默认adamw8bit */
					optimizer: string;
					/** 时间步类型，默认weighted */
					timestep_type: string;
					/** 时间步长偏差，默认balanced */
					content_or_style: string;
					optimizer_params: {
						/** 权重衰减，默认0.0001 */
						weight_decay: number;
					};
					/** 卸载文本编码器，默认false */
					unload_text_encoder: boolean;
					/** 学习率，默认0.0001 */
					lr: number;
					/** EMA */
					ema_config: {
						/** 是否使用EMA，默认false */
						use_ema: boolean;
						/** EMA 衰减，默认0.99 */
						ema_decay: number;
					};
					/** 跳过第一个样本，默认false */
					skip_first_sample: boolean;
					/** 禁用采样，默认true */
					disable_sampling: boolean;
					/** 差分输出保留，默认false */
					diff_output_preservation: boolean;
					/** DOP 损失乘数，默认1 */
					diff_output_preservation_multiplier: number;
					/** DOP 保护类，默认person */
					diff_output_preservation_class: string;
					/** 写死，默认bf16 */
					dtype: "bf16";
				};
				/** 模型配置 */
				model: {
					/** 写死 */
					arch: "flux_kontext";
					/** 底模目录路径 */
					name_or_path: string;
					/** 是否开启Transformer量化转换器，默认true */
					quantize: boolean;
					/** 是否开启Text Encoder量化转换器，默认使用model_quantize的值 */
					quantize_te: boolean;
				};
				/** 采样配置 */
				sample: {
					/** 采样器，默认flowmatch */
					sampler: string;
					/** 每隔多少步进行一次采样，默认250 */
					sample_every: number;
					/** 宽度，默认1024 */
					width: number;
					/** 高度，默认1024 */
					height: number;
					/** 种子，默认42 */
					seed: number;
					/** 是否在采样过程中逐步改变随机种子，默认true */
					walk_seed: boolean;
					/** 指导尺度，默认4 */
					guidance_scale: number;
					/** 采样步骤数，默认25 */
					sample_steps: number;
					/** 写死，flux不使用 */
					neg: "";
					/** 样本提示
					 *  - 例：`["make this person a big head --ctrl_img /home/ubuntu/zhaokun/kontext-dataset/dataset/test/01.jpg"]`
					 */
					prompts: string[];
				};
				/** 数据集 */
				datasets: Array<{
					/** 数据集目录，结果图片+打标文件 */
					folder_path: string;
					/** 原图目录，是生成结果图片的源文件，图片名必须与folder_path相同 */
					control_path: string;
					/** 标题 Dropout Rate，默认0.05 */
					caption_dropout_rate: number;
					/** 是否打乱标题顺序，以逗号分隔，默认false */
					shuffle_tokens: boolean;
					/** 是否将图像的潜在表示（latents）缓存到磁盘，默认true */
					cache_latents_to_disk: boolean;
					/** 是否正则化，默认false */
					is_reg: boolean;
					/** LoRA 权重，默认1 */
					network_weight: number;
					/** 写死 */
					caption_ext: "txt";
					/** 分辨率，默认[512, 768] */
					resolution: [512, 768];
				}>;
			}
		];
	};
	/** 写死的 */
	job: "extension";
	meta: {
		/** 写死的 */
		name: "";
		/** 写死的 */
		version: "";
	};
	/** 训练器的训练配置 */
	frontend_config: string;
}

/** 启动flux kontext 训练结果 */
export interface StartFluxKontextTrainingResult {
	msg: string;
	success: boolean;
	/** 任务id */
	task_id: string;
}

/** 启动Qwen Image 训练参数 */
export interface StartQwenImageTrainingData {
	config: {
		// -- 基本信息
		/** LoRA 模型的名称，默认："" */
		output_name: string;
		/** 是否训练Qwen Image Edit，默认：false */
		edit: boolean;
		/** 底模文件路径，默认："" */
		dit: string;
		/** VAE模型路径，默认："" */
		vae: string;
		/** VAE模型的计算精度（默认float16），可选值如fp16/bf16/fp32等，默认："" */
		vae_dtype: string;
		/** 文本编码器模型路径，默认："" */
		text_encoder: string;
		/** 模型保存目录，默认："" */
		output_dir: string;
		// -- 训练流程控制
		/** 随机种子，用于复现训练结果，默认：42 */
		seed: number;
		/** 最大训练步数，默认：1600 */
		max_train_steps: number;
		/** 最大训练轮数，默认：16 */
		max_train_epochs: number;
		/** 混合精度训练模式，"no", "fp16", "bf16"，默认："bf16" */
		mixed_precision: string;
		/** 保存训练状态 配合 resume 参数可以继续从某个状态训练，默认：true */
		save_state: boolean;
		/** 每N步保存模型，默认：undefined */
		save_every_n_steps: number | undefined;
		/** 每N epoch保存模型，默认：4 */
		save_every_n_epochs: number;
		/** 保留最近N个epoch的检查点，默认：undefined */
		save_last_n_epochs: number | undefined;
		/** 保留最近N步训练状态，默认：undefined */
		save_last_n_epochs_state: number | undefined;
		/** 保留最近N步的检查点，默认：undefined */
		save_last_n_steps: number | undefined;
		/** 专门控制state步数保留（覆盖save_last_n_steps），默认：undefined */
		save_last_n_steps_state: number | undefined;
		/** 训练结束时强制保存state（即使未启用save_state），默认：false */
		save_state_on_train_end: boolean;
		/** 恢复训练的state目录路径，默认："" */
		resume: string;
		// -- 优化器和学习率配置
		/** 优化器设置，默认：adamw8bit */
		optimizer_type: string;
		/**
		 * 自定义优化器选项参数，可以key=value的格式指定多个值，以空格分隔。
		 * 示例：weight_decay=0.01 betas=.9,.999
		 */
		optimizer_args: string;
		/** 学习率，默认：0.0001 */
		learning_rate: number;
		/** 学习率调度器设置，默认：constant */
		lr_scheduler: string;
		/** 学习率预热步数，默认：0 */
		lr_warmup_steps: number;
		/** 学习率衰减步数，0-总训练步数，默认：0 */
		lr_decay_steps: number;
		/** 自定义调度器参数，默认："" */
		lr_scheduler_args: string;
		/** 最小学习率比例，0.01-0.1，默认：undefined */
		lr_scheduler_min_lr_ratio: number | undefined;
		/** 余弦重启次数，默认：1 */
		lr_scheduler_num_cycles: number;
		/** 多项式衰减强度，1.0-5.0，默认：1 */
		lr_scheduler_power: number;
		/** 逆平方根调度时间系数，默认：undefined */
		lr_scheduler_timescale: number | undefined;
		/** 自定义调度器模块，默认："" */
		lr_scheduler_type: string;
		// -- 采样和推理配置
		/** 训练前生成初始样本，默认：false */
		sample_at_first: boolean;
		/** 每N个epoch生成样本，默认：undefined */
		sample_every_n_epochs: number | undefined;
		/** 每N步生成样本，默认：undefined */
		sample_every_n_steps: number | undefined;
		/** 采样使用的提示词，json格式：'{"image_path":"xx","prompt":"xxx"}' */
		sample_prompts: string;
		/** 文本控制强度，数值越大生成结果越遵循文本提示，默认：undefined */
		guidance_scale: number | undefined;
		// -- LoRA网络结构参数
		/** LoRA的秩（rank），8-128，默认：32 */
		network_dim: number;
		/** LoRA权重缩放因子，8-128（推荐等于dim），默认：1 */
		network_alpha: number;
		/** 训练时随机失活比例，0.1-0.3，默认：undefined */
		network_dropout: number | undefined;
		/** 自定义 network_args
		 * 示例："context_attn_dim=2" "context_mlp_dim=3" "context_mod_dim=4"
		 */
		network_args: string;
		/** 预训练权重文件路径，默认：""，空字符的情况下不要传递该属性 */
		network_weights?: string;
		/** 基础权重-合并入底模的 LoRA  */
		base_weights: string;
		/** 基础权重-合并入底模的 LoRA 权重，与 base_weights 对应 */
		base_weights_multiplier: number | undefined;
		// -- 扩散模型参数
		/** 时间步采样方法，uniform|sigmoid|shift|sigma，默认："shift" */
		timestep_sampling: string;
		/** 时间步采样sigmoid缩放系数（仅当timestep_sampling为sigmoid/shift时生效），默认：1.0 */
		sigmoid_scale: number;
		/** 最小扩散时间步长，0-999（控制起始噪声水平），默认：undefined */
		min_timestep: number | undefined;
		/** 最大扩散时间步长，1-1000（控制噪声水平），默认：undefined */
		max_timestep: number | undefined;
		/** 时间步权重分布集中度，1.0-2.0（值越大越集中），默认：1.29 */
		mode_scale: number;
		/** 用于控制Euler离散调度器的时间步偏移量，主要影响视频生成的噪声调度过程，默认：3.0 */
		discrete_flow_shift: number;
		/** 时间步权重分配方案，可选值：logit_normal|mode|uniform|none，默认："none" */
		weighting_scheme: string;
		// -- 性能优化
		/** 权重标准化防梯度爆炸，默认：undefined */
		scale_weight_norms: number | undefined;
		/** 梯度裁剪阈值（防止梯度爆炸），0.5-2.0（0表示禁用），默认：1.0 */
		max_grad_norm: number;
		/** 显存优化技术，通过时间换空间策略，减少约30%显存占用，开启会增加训练时间，默认：true */
		gradient_checkpointing: boolean;
		/** 使用PyTorch原生注意力，默认：true */
		sdpa: boolean;
		/**  是否使用SageAttention优化节省显存，默认：false */
		sage_attn: boolean;
		/** 启用xformers优化库（需要安装xformers），用于CrossAttention层的显存优化，默认：true */
		xformers: boolean;
		/** 是否使用split attention优化（需要XFORMERS），默认：true */
		split_attn: boolean;
		/** 启用FlashAttention 3，默认：false */
		flash3: boolean;
		/** 启用FlashAttention优化CrossAttention计算，默认：false */
		flash_attn: boolean;
		/** 对基础模型使用 FP8 精度，默认：true */
		fp8_base: boolean;
		/** 启用FP8缩放模式，云端不支持，默认：false */
		fp8_scaled: boolean;
		/** 文本编码器优化，显存小于16GB建议开启，默认：false */
		fp8_vl: boolean;
		// -- 系统资源配置
		/** 控制数据加载并行进程数，4-16（根据CPU核心数调整），默认：8 */
		max_data_loader_n_workers: number;
		/** 保留加载训练集的worker，减少每个 epoch 之间的停顿，默认：false */
		persistent_data_loader_workers: boolean;
		/** 指定要交换的网络块数量，用于调整LoRA模型结构，默认16 */
		blocks_to_swap: number;
		/** 让图像和文本的预处理任务在 CPU 上执行，默认：false */
		img_in_txt_in_offloading: boolean;
		// -- 分布式训练配置
		/** 为 DDP 启用 gradient_as_bucket_view，默认：false */
		ddp_gradient_as_bucket_view: boolean;
		/** 固定结构模型加速, 默认：false */
		ddp_static_graph: boolean;
		/** 设置DDP进程间通信的超时时间 */
		ddp_timeout: number | undefined;
	};
	dataset: {
		/** 数据集通用配置 */
		general: {
			/** 图片尺寸，默认：[960, 544] */
			resolution: [number, number];
			/** 描述文件扩展名，默认：".txt" */
			caption_extension: string;
			/** 批次大小，默认：1 */
			batch_size: number;
			/** 启用动态分辨率，启用 arb 桶以允许非固定宽高比的图片，默认：true */
			enable_bucket: boolean;
			/** 允许小图放大，arb 桶不放大图片，默认：false */
			bucket_no_upscale: boolean;
		};
		/** 数据集数组 */
		datasets: Array<{
			/** 数据集目录 */
			image_directory: string;
			/** 控制数据集，只有在开启 edit 模式时才生效 */
			control_directory: string;
			/** 禁用调整控件图像的大小，默认：false */
			qwen_image_edit_no_resize_control: boolean;
			/** 指定控制图像的尺寸，默认可不填，与qwen_image_edit_no_resize_control互斥 */
			qwen_image_edit_control_resolution: [number | null, number | null];
			/** 数据集重复次数，默认：1 */
			num_repeats: number;
			/** 图片尺寸，默认：[960, 544] */
			resolution: [number, number];
			/** 描述文件扩展名，默认：".txt" */
			caption_extension: string;
			/** 批次大小，默认：1 */
			batch_size: number;
			/** 启用动态分辨率，启用 arb 桶以允许非固定宽高比的图片，默认：true */
			enable_bucket: boolean;
			/** 允许小图放大，arb 桶不放大图片，默认：false */
			bucket_no_upscale: boolean;
		}>;
	};
	/** 多gpu训练配置 */
	multi_gpu_config: MultiGpuConfig;
	/** 跳过图像潜空间缓存阶段，默认：false */
	skip_cache_latent: boolean;
	/** 跳过Text 编码潜空间缓存阶段，默认：false */
	skip_cache_text_encoder_latent: boolean;
	/** 训练器的训练配置 */
	frontend_config: string;
}

/** 启动Qwen Image 训练结果 */
export interface StartQwenImageTrainingResult {
	msg: string;
	success: boolean;
	/** 任务id */
	task_id: string;
}
