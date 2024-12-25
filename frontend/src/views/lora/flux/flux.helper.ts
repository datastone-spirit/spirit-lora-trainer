/*
 * @Author: mulingyuer
 * @Date: 2024-12-17 17:02:12
 * @LastEditTime: 2024-12-25 14:19:15
 * @LastEditors: mulingyuer
 * @Description: flux helper
 * @FilePath: \frontend\src\views\lora\flux\flux.helper.ts
 * 怎么可能会有bug！！！
 */
import type { StartFluxTrainingData } from "@/api/lora/types";
import type { RuleForm } from "./types";

type Config = StartFluxTrainingData["config"];
type Dataset = StartFluxTrainingData["dataset"];

/** 需要将数字转换为科学计数法的对象key */
const scientificToNumberKeys = [
	"unet_lr",
	"text_encoder_lr",
	"network_alpha",
	"learning_rate"
] as const;

/** 转换科学计数法到数值 */
function convertScientificToNumber(form: RuleForm, config: Config) {
	scientificToNumberKeys.forEach((key) => {
		const formValue = form[key];
		if (typeof formValue === "string" && formValue.trim() !== "" && Object.hasOwn(config, key)) {
			config[key] = Number(formValue);
		}
	});
}

/** 转换数值到科学计数法 */
function convertNumberToScientific(config: Config, form: RuleForm) {
	scientificToNumberKeys.forEach((key) => {
		const configValue = config[key];
		if (typeof configValue === "number" && Object.hasOwn(form, key)) {
			form[key] = configValue.toExponential();
		}
	});
}

/** 转换图片分辨率为数组字符串 */
function convertResolutionToString(form: RuleForm) {
	return [form.resolution_width, form.resolution_height].join(",");
}

/** 转换图片分辨率数组字符串到对象 */
function convertResolutionToObject(config: Config) {
	const resolution = config.resolution.split(",");
	return {
		resolution_width: Number(resolution[0]),
		resolution_height: Number(resolution[1])
	};
}

/** 格式化配置对象 */
function formatConfig(form: RuleForm): Config {
	const config: Config = {
		pretrained_model_name_or_path: "",
		enable_base_weight: false,
		base_weights: "",
		base_weights_multiplier: undefined,
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
		learning_rate: undefined,
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
		ddp_timeout: undefined,
		resolution: ""
	};

	convertScientificToNumber(form, config);
	config.resolution = convertResolutionToString(form);

	// 其他
	const excludeKeys = [...scientificToNumberKeys, "resolution"];
	const keys = Object.keys(form).filter((key) => {
		return !excludeKeys.includes(key) && Object.hasOwn(form, key);
	});
	keys.forEach((key) => {
		// @ts-expect-error 去除ts类型检查
		config[key] = form[key];
	});

	// 去除config中所有value为null的属性
	(Object.keys(config) as (keyof Config)[]).forEach((key) => {
		if (config[key] === null) {
			Reflect.deleteProperty(config, key);
		}
	});

	return config;
}

/** 格式化dataset */
function formatDataset(form: RuleForm): Dataset {
	const resolution = convertResolutionToString(form);

	return {
		datasets: [
			{
				batch_size: form.train_batch_size,
				keep_tokens: form.keep_tokens,
				resolution: resolution,
				subsets: [
					{
						class_tokens: form.class_tokens,
						image_dir: form.image_dir,
						num_repeats: form.num_repeats
					}
				]
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
export function formatFormData(form: RuleForm): StartFluxTrainingData {
	const deepCloneForm = structuredClone(toRaw(form));

	return {
		config: formatConfig(deepCloneForm),
		dataset: formatDataset(deepCloneForm)
	};
}

/** 将我们定义的toml数据对象数据合并到表单上 */
export function mergeDataToForm(toml: StartFluxTrainingData, form: RuleForm) {
	// 判断是否是我们定义的toml数据对象
	const isToml = "config" in toml && "dataset" in toml;
	if (!isToml) throw new Error("当前导入的toml数据存在异常，无法合并到表单上");

	const { config, dataset } = toml;
	const datasets = dataset.datasets[0];
	const general = dataset.general;

	// 科学计数法转换
	convertNumberToScientific(config, form);

	// 图片分辨率
	const resolution = convertResolutionToObject(config);
	form.resolution_width = resolution.resolution_width;
	form.resolution_height = resolution.resolution_height;

	// datasets
	form.train_batch_size = datasets.batch_size;
	form.keep_tokens = datasets.keep_tokens;
	form.class_tokens = datasets.subsets[0].class_tokens;
	form.image_dir = datasets.subsets[0].image_dir;
	form.num_repeats = datasets.subsets[0].num_repeats;
	form.caption_extension = general.caption_extension;
	form.keep_tokens = general.keep_tokens;
	form.shuffle_caption = general.shuffle_caption;

	// 其他
	const excludeKeys = [
		...scientificToNumberKeys,
		"train_batch_size",
		"keep_tokens",
		"class_tokens",
		"image_dir",
		"num_repeats",
		"caption_extension",
		"keep_tokens",
		"shuffle_caption",
		"resolution"
	];
	const keys = Object.keys(form).filter((key) => {
		return !excludeKeys.includes(key) && Object.hasOwn(config, key);
	});
	keys.forEach((key) => {
		// @ts-expect-error 去除ts类型检查
		form[key] = config[key];
	});

	return form;
}
