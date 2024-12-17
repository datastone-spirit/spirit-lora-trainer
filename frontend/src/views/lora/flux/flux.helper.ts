/*
 * @Author: mulingyuer
 * @Date: 2024-12-17 17:02:12
 * @LastEditTime: 2024-12-17 18:19:05
 * @LastEditors: mulingyuer
 * @Description: flux helper
 * @FilePath: \frontend\src\views\lora\flux\flux.helper.ts
 * 怎么可能会有bug！！！
 */
import type { TrainLoraData } from "@/api/lora/types";
import type { RuleForm } from "./types";

type ScientificToNumberKeys = ["unet_lr", "text_encoder_lr", "network_alpha"];
type ConfigKeys = (keyof TrainLoraData["config"])[];
type OtherKeys = Exclude<ConfigKeys, ScientificToNumberKeys>;

/** 表单数据格式化 - config对象 */
function formatConfig(form: RuleForm): TrainLoraData["config"] {
	const config: TrainLoraData["config"] = {
		pretrained_model_name_or_path: "",
		enable_base_weight: false,
		enable_bucket: false,
		bucket_no_upscale: false,
		bucket_reso_steps: 0,
		cache_latents: false,
		cache_latents_to_disk: false,
		cache_text_encoder_outputs: false,
		cache_text_encoder_outputs_to_disk: false,
		caption_extension: "",
		color_aug: false,
		ddp_gradient_as_bucket_view: false,
		discrete_flow_shift: 0,
		enable_preview: false,
		flip_aug: false,
		fp8_base: false,
		fp8_base_unet: false,
		full_fp16: false,
		full_bf16: false,
		gradient_accumulation_steps: 0,
		gradient_checkpointing: false,
		guidance_scale: 0,
		keep_tokens_separator: "",
		learning_rate: 0,
		log_prefix: "",
		log_tracker_name: "",
		log_with: "",
		logging_dir: "",
		loss_type: "",
		lowram: false,
		lr_scheduler: "",
		lr_scheduler_num_cycles: 0,
		lr_warmup_steps: 0,
		max_bucket_reso: 0,
		max_data_loader_n_workers: 0,
		max_train_epochs: 0,
		min_bucket_reso: 0,
		mixed_precision: "",
		model_prediction_type: "",
		network_alpha: undefined,
		network_args: "",
		network_dim: 0,
		network_dropout: 0,
		network_module: "",
		network_train_text_encoder_only: false,
		network_train_unet_only: false,
		network_weights: "",
		no_half_vae: false,
		num_repeats: 0,
		optimizer_args: "",
		optimizer_type: "",
		output_dir: "",
		output_name: "",
		persistent_data_loader_workers: false,
		random_crop: false,
		resume: "",
		save_every_n_epochs: 0,
		save_model_as: "",
		save_precision: "",
		save_state: false,
		sdpa: false,
		seed: 0,
		shuffle_caption: false,
		sigmoid_scale: 0,
		text_encoder_lr: undefined,
		timestep_sampling: "",
		train_batch_size: 0,
		unet_lr: undefined,
		weighted_captions: false,
		ae: "",
		clip_l: "",
		t5xxl: "",
		tagger_model: "",
		t5xxl_max_token_length: undefined,
		min_snr_gamma: undefined,
		scale_weight_norms: undefined,
		caption_dropout_rate: undefined,
		caption_dropout_every_n_epochs: undefined,
		caption_tag_dropout_rate: undefined,
		clip_skip: 0,
		vae_batch_size: undefined,
		ddp_timeout: undefined
	};
	// 需要将科学计数法转换为number的对象key数组
	const scientificToNumberKeys: ScientificToNumberKeys = [
		"unet_lr",
		"text_encoder_lr",
		"network_alpha"
	];
	scientificToNumberKeys.forEach((key) => {
		const formValue = form[key];
		if (typeof formValue === "string" && formValue.trim() !== "") {
			config[key] = Number(formValue);
		} else {
			config[key] = undefined;
		}
	});

	// 其他对象key
	// @ts-expect-error 去除ts类型检查
	const otherKeys: OtherKeys = Object.keys(config).filter(
		// @ts-expect-error 去除ts类型检查
		(key) => !scientificToNumberKeys.includes(key)
	);
	otherKeys.forEach((key) => {
		// @ts-expect-error 去除ts类型检查
		config[key] = form[key];
	});

	return config;
}

/** 格式化dataset */
function formatDataset(form: RuleForm): TrainLoraData["dataset"] {
	const resolution = [form.resolution_width, form.resolution_height].join(",");
	return {
		datasets: [
			{
				batch_size: form.train_batch_size,
				keep_tokens: form.keep_tokens,
				resolution: resolution,
				subsets: {
					class_tokens: form.class_tokens,
					image_dir: form.image_dir,
					num_repeats: form.num_repeats
				}
			}
		],
		general: {
			caption_extension: form.caption_extension,
			keep_tokens: form.keep_tokens,
			shuffle_caption: form.shuffle_caption
		}
	};
}

/** 表单数据格式化 */
export function formatFormData(form: RuleForm): TrainLoraData {
	const data: TrainLoraData = {
		config: formatConfig(form),
		dataset: formatDataset(form)
	};

	// 利用JSON的解析去除value值为undefined的key
	return JSON.parse(JSON.stringify(data));
}

/** 将我们定义的toml数据对象数据合并到表单上 */
export function mergeDataToForm(toml: TrainLoraData, form: RuleForm) {
	// 判断是否是我们定义的toml数据对象
	const isToml = "config" in toml && "dataset" in toml;
	if (!isToml) throw new Error("当前导入的toml数据存在异常，无法合并到表单上");

	const { config, dataset } = toml;
	const datasets = dataset.datasets[0];
	const general = dataset.general;

	// 需要将数字转换为科学计数法的对象key
	const scientificToNumberKeys: ScientificToNumberKeys = [
		"unet_lr",
		"text_encoder_lr",
		"network_alpha"
	];
	scientificToNumberKeys.forEach((key) => {
		form[key] = config[key]?.toExponential();
	});

	// datasets
	const datasetKeys = [
		"train_batch_size",
		"keep_tokens",
		"class_tokens",
		"image_dir",
		"num_repeats",
		"caption_extension",
		"keep_tokens",
		"shuffle_caption"
	];
	// datasets 图片宽高
	const resolution = datasets.resolution.split(",");
	form.resolution_width = Number(resolution[0]);
	form.resolution_height = Number(resolution[1]);
	form.train_batch_size = datasets.batch_size;
	form.keep_tokens = datasets.keep_tokens;
	form.class_tokens = datasets.subsets.class_tokens;
	form.image_dir = datasets.subsets.image_dir;
	form.num_repeats = datasets.subsets.num_repeats;
	form.caption_extension = general.caption_extension;
	form.keep_tokens = general.keep_tokens;
	form.shuffle_caption = general.shuffle_caption;

	// 其他
	const otherKeys = Object.keys(config).filter((key) => !datasetKeys.includes(key));
	otherKeys.forEach((key) => {
		// @ts-expect-error 去除ts类型检查
		form[key] = config[key];
	});
}
