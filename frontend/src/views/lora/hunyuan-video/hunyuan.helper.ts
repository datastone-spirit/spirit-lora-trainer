/*
 * @Author: mulingyuer
 * @Date: 2025-01-07 10:00:01
 * @LastEditTime: 2025-01-08 11:56:52
 * @LastEditors: mulingyuer
 * @Description: 换源视频训练帮助
 * @FilePath: \frontend\src\views\lora\hunyuan-video\hunyuan.helper.ts
 * 怎么可能会有bug！！！
 */
import type { StartHyVideoTrainingData } from "@/api/lora";
import type { RuleForm } from "./types";

type Config = StartHyVideoTrainingData["config"];
type Dataset = StartHyVideoTrainingData["dataset"];

/** 格式化配置对象 */
function formatConfig(form: RuleForm): Config {
	const config: Config = {
		output_dir: "",
		dataset: "",
		epochs: 0,
		micro_batch_size_per_gpu: 0,
		pipeline_stages: 0,
		gradient_accumulation_steps: 0,
		gradient_clipping: 0,
		warmup_steps: 0,
		eval_every_n_epochs: 0,
		eval_before_first_step: false,
		eval_micro_batch_size_per_gpu: 0,
		eval_gradient_accumulation_steps: 0,
		save_every_n_epochs: 0,
		checkpoint_every_n_minutes: 0,
		activation_checkpointing: false,
		partition_method: "",
		save_dtype: "",
		caching_batch_size: 0,
		steps_per_print: 0,
		video_clip_mode: "",
		model: {
			type: "",
			transformer_path: "",
			vae_path: "",
			llm_path: "",
			clip_path: "",
			dtype: "",
			transformer_dtype: "",
			timestep_sample_method: ""
		},
		adapter: {
			type: "",
			rank: 0,
			dtype: "",
			init_from_existing: ""
		},
		optimizer: {
			type: "",
			lr: 0,
			betas: [],
			weight_decay: 0,
			eps: 0
		}
	};

	// model
	const configModel = config.model;
	configModel.type = "hunyuan-video";
	configModel.transformer_path = form.model_transformer_path;
	configModel.vae_path = form.model_vae_path;
	configModel.llm_path = form.model_llm_path;
	configModel.clip_path = form.model_clip_path;
	configModel.dtype = form.model_dtype;
	configModel.transformer_dtype = form.model_transformer_dtype;
	configModel.timestep_sample_method = form.model_timestep_sample_method;

	// adapter
	const configAdapter = config.adapter;
	configAdapter.type = form.adapter_type;
	configAdapter.rank = form.adapter_rank;
	configAdapter.dtype = form.adapter_dtype;
	configAdapter.init_from_existing = form.adapter_init_from_existing;

	// optimizer
	const configOptimizer = config.optimizer;
	configOptimizer.type = form.optimizer_type;
	configOptimizer.lr = Number(form.optimizer_lr);
	configOptimizer.betas = form.optimizer_betas;
	configOptimizer.weight_decay = form.optimizer_weight_decay;
	configOptimizer.eps = Number(form.optimizer_eps);

	// 其他
	const excludeKeys = ["model", "adapter", "optimizer"];
	const flatKeys = Object.keys(config).filter((key) => {
		return !excludeKeys.includes(key) && Object.hasOwn(form, key);
	});
	flatKeys.forEach((key) => {
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
	const resolutions = [form.resolution_width, form.resolution_height];
	const frame_buckets = form.frame_buckets.split(",").map(Number);

	return {
		resolutions: resolutions,
		enable_ar_bucket: form.enable_ar_bucket,
		min_ar: form.min_ar,
		max_ar: form.max_ar,
		num_ar_buckets: form.num_ar_buckets,
		frame_buckets: frame_buckets,
		directories: [
			{
				path: form.directory_path,
				num_repeats: form.directory_num_repeats,
				resolutions: resolutions,
				frame_buckets: frame_buckets
			}
		]
	};
}

/** 表单数据格式化 */
export function formatFormData(form: RuleForm): StartHyVideoTrainingData {
	const deepCloneForm = structuredClone(toRaw(form));

	return {
		config: formatConfig(deepCloneForm),
		dataset: formatDataset(deepCloneForm)
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
