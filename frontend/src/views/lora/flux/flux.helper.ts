/*
 * @Author: mulingyuer
 * @Date: 2024-12-17 17:02:12
 * @LastEditTime: 2025-08-21 14:45:47
 * @LastEditors: mulingyuer
 * @Description: flux helper
 * @FilePath: \frontend\src\views\lora\flux\flux.helper.ts
 * 怎么可能会有bug！！！
 */
import type { StartFluxTrainingData } from "@/api/lora/types";
import type { RuleForm } from "./types";
import { tomlStringify } from "@/utils/toml";
import { removeNullDeep } from "@/utils/tools";

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
function _convertNumberToScientific(config: Config, form: RuleForm) {
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
		cache_text_encoder_outputs: true,
		cache_text_encoder_outputs_to_disk: true,
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
		gradient_checkpointing: true,
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
		max_train_epochs: 10,
		min_bucket_reso: 0,
		mixed_precision: "",
		model_prediction_type: "",
		network_alpha: undefined,
		network_args: null,
		network_dim: 64,
		network_dropout: 0,
		network_module: "",
		network_train_text_encoder_only: false,
		network_train_unet_only: false,
		network_weights: "",
		no_half_vae: false,
		num_repeats: 0,
		optimizer_args: null,
		optimizer_type: "adamw8bit",
		output_dir: "",
		output_name: "",
		persistent_data_loader_workers: false,
		random_crop: false,
		resume: "",
		save_every_n_epochs: 4,
		save_model_as: "",
		save_precision: "",
		save_state: true,
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
		highvram: true,
		min_snr_gamma: undefined,
		scale_weight_norms: undefined,
		caption_dropout_rate: undefined,
		caption_dropout_every_n_epochs: undefined,
		caption_tag_dropout_rate: undefined,
		clip_skip: 0,
		vae_batch_size: undefined,
		ddp_timeout: undefined,
		resolution: "",
		output_config: true,
		sample_every_n_steps: 0,
		sample_prompts: "",
		blocks_to_swap: undefined,
		logit_mean: 0,
		logit_std: 1,
		mode_scale: 1.29,
		disable_mmap_load_safetensors: false,
		max_validation_steps: undefined,
		validate_every_n_epochs: undefined,
		validate_every_n_steps: undefined,
		validation_seed: undefined,
		validation_split: undefined,
		weighting_scheme: "uniform",
		split_mode: false,
		text_encoder_batch_size: undefined
	};

	convertScientificToNumber(form, config);
	config.resolution = convertResolutionToString(form);

	// 其他
	const excludeKeys = [...scientificToNumberKeys, "resolution"];
	const keys = Object.keys(config).filter((key) => {
		return !excludeKeys.includes(key) && Object.hasOwn(form, key);
	});
	keys.forEach((key) => {
		// @ts-expect-error 去除ts类型检查
		config[key] = form[key];
	});

	return removeNullDeep(config);
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

/** 格式化表单数据
 * 注意传递进来的form必须是原始对象，不能是Proxy对象，可以用toRaw方法转换
 */
export function formatFormData(form: RuleForm): StartFluxTrainingData {
	const deepCloneForm = structuredClone(form);

	return {
		config: formatConfig(deepCloneForm),
		dataset: formatDataset(deepCloneForm),
		frontend_config: tomlStringify(deepCloneForm)
	};
}

/** 将我们定义的toml数据对象数据合并到表单上 */
export function mergeDataToForm(toml: RuleForm, form: RuleForm) {
	const formKeys = Object.keys(form) as (keyof RuleForm)[];
	formKeys
		.filter((key) => Object.hasOwn(toml, key))
		.forEach((key) => {
			// @ts-expect-error 去除ts类型检查
			form[key] = toml[key];
		});

	return form;
}
