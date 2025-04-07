/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:01:31
 * @LastEditTime: 2025-04-07 10:34:40
 * @LastEditors: mulingyuer
 * @Description: wan helper
 * @FilePath: \frontend\src\views\lora\wan-video\wan.helper.ts
 * 怎么可能会有bug！！！
 */
import type {
	StartWanVideoTrainingData,
	StartWanVideoTrainingVideoDataset,
	WanVideoVideoDatasetEstimateData
} from "@/api/lora";
import { filterAndConvertKeysToNumber } from "@/utils/lora.helper";
import { tomlStringify } from "@/utils/toml";
import type { RuleForm, TargetFrames } from "./types";

export class WanHelper {
	/** 数据格式化 */
	public formatData(data: RuleForm): StartWanVideoTrainingData {
		const deepCloneForm = structuredClone(toRaw(data));

		return {
			config: this.formatConfig(deepCloneForm),
			dataset: this.formatDataset(deepCloneForm),
			frontend_config: tomlStringify(deepCloneForm)
		};
	}

	/** 计算视频预估图片数量数据格式化 */
	public formatImagesCountEstimate(data: RuleForm): WanVideoVideoDatasetEstimateData {
		return this.formatDataset(data);
	}

	/** 格式化config数据 */
	private formatConfig(data: RuleForm): StartWanVideoTrainingData["config"] {
		const config: StartWanVideoTrainingData["config"] = {
			task: "",
			output_name: "",
			dit: "",
			clip: "",
			t5: "",
			fp8_t5: false,
			vae: "",
			vae_cache_cpu: false,
			vae_dtype: "",
			output_dir: "",
			max_train_epochs: 0,
			max_train_steps: undefined,
			seed: undefined,
			mixed_precision: "",
			persistent_data_loader_workers: false,
			max_data_loader_n_workers: 0,
			optimizer_type: "",
			optimizer_args: "",
			learning_rate: 0,
			lr_decay_steps: 0,
			lr_scheduler: "",
			lr_scheduler_args: "",
			lr_scheduler_min_lr_ratio: undefined,
			lr_scheduler_num_cycles: 0,
			lr_scheduler_power: 0,
			lr_scheduler_timescale: undefined,
			lr_scheduler_type: "",
			lr_warmup_steps: 0,
			network_alpha: 0,
			network_args: "",
			network_dim: undefined,
			network_dropout: undefined,
			network_module: "",
			network_weights: "",
			dim_from_weights: false,
			blocks_to_swap: undefined,
			fp8_base: false,
			fp8_scaled: false,
			save_every_n_epochs: undefined,
			save_every_n_steps: undefined,
			save_last_n_epochs: undefined,
			save_last_n_epochs_state: undefined,
			save_last_n_steps: undefined,
			save_last_n_steps_state: undefined,
			save_state: false,
			save_state_on_train_end: false,
			resume: "",
			scale_weight_norms: undefined,
			max_grad_norm: 0,
			ddp_gradient_as_bucket_view: false,
			ddp_static_graph: false,
			ddp_timeout: undefined,
			sample_at_first: false,
			sample_every_n_epochs: undefined,
			sample_every_n_steps: undefined,
			sample_prompts: "",
			guidance_scale: undefined,
			show_timesteps: "",
			gradient_accumulation_steps: 0,
			gradient_checkpointing: false,
			img_in_txt_in_offloading: false,
			flash3: false,
			flash_attn: false,
			sage_attn: false,
			sdpa: false,
			split_attn: false,
			xformers: false,
			discrete_flow_shift: 0,
			min_timestep: undefined,
			max_timestep: undefined,
			mode_scale: 0,
			logit_mean: 0,
			logit_std: 0,
			timestep_sampling: "",
			sigmoid_scale: 0,
			weighting_scheme: ""
		};

		// 将科学计数的string转成number
		const scientificNumberKeys = ["learning_rate"];
		const scientificObj = filterAndConvertKeysToNumber(data.config, scientificNumberKeys);
		Object.assign(config, scientificObj);

		// wan模型的配置项
		const wanDitKeys = ["dit", "i2v_dit", "t2v_dit"];
		config.dit = data.config.task === "i2v-14B" ? data.config.i2v_dit : data.config.t2v_dit;

		// 其它数据直接赋值
		const excludeKeys = [...scientificNumberKeys, ...wanDitKeys];
		const otherKeys = Object.keys(config).filter(
			(key) => !excludeKeys.includes(key) && Object.hasOwn(data.config, key)
		);
		otherKeys.forEach((key) => {
			// @ts-expect-error 去除ts类型检查
			config[key] = data.config[key];
		});

		// network_weights 如果为空就设置为null，最后会被移除
		if (typeof config.network_weights === "string" && config.network_weights.trim() === "") {
			// @ts-expect-error 去除ts类型检查
			config.network_weights = null;
		}

		return this.removeNullProperty(config);
	}

	/** 格式化dataset数据 */
	private formatDataset(data: RuleForm): StartWanVideoTrainingData["dataset"] {
		const { data_mode } = data;
		const { general, datasets } = data.dataset;

		const formatGeneral: StartWanVideoTrainingData["dataset"]["general"] = {
			resolution: [general.resolution[0], general.resolution[1]],
			batch_size: general.batch_size,
			enable_bucket: general.enable_bucket,
			bucket_no_upscale: general.bucket_no_upscale,
			caption_extension: general.caption_extension,
			num_repeats: general.num_repeats
		};
		let formatDatasets: StartWanVideoTrainingData["dataset"]["datasets"][number];

		switch (data_mode) {
			case "image":
				formatDatasets = {
					image_directory: datasets[0].image_directory
				};
				break;
			case "video":
				formatDatasets = {
					video_directory: datasets[0].video_directory,
					frame_extraction: datasets[0].frame_extraction,
					target_frames: this.formatTargetFrames(datasets[0].target_frames),
					frame_stride: datasets[0].frame_stride,
					frame_sample: datasets[0].frame_sample
				};
				break;
		}

		return {
			general: formatGeneral,
			datasets: [formatDatasets]
		};
	}

	/** 去除对象中值为null的属性 */
	private removeNullProperty<T extends Record<string, any>>(obj: T): T {
		const result = {} as T;

		// 使用 for...in 循环遍历对象的所有键
		for (const key in obj) {
			if (obj.hasOwnProperty(key) && obj[key] !== null) {
				// 确保键存在，并且值不为null
				result[key] = obj[key];
			}
		}

		return result;
	}

	/** 将对象合并到表单对象上 */
	public mergeToForm(data: Record<string, any>, form: RuleForm): RuleForm {
		const dataKeysSet = new Set(Object.keys(data));
		const formKeys = Object.keys(form) as (keyof RuleForm)[];
		// 求交集
		const keys = formKeys.filter((key) => dataKeysSet.has(key));

		keys.forEach((key) => {
			form[key] = data[key];
		});

		return form;
	}

	/** 将target_frames格式化成数组 */
	private formatTargetFrames(
		target_frames: TargetFrames
	): StartWanVideoTrainingVideoDataset["target_frames"] {
		target_frames = target_frames.filter((item) => item.value !== undefined);
		return target_frames.map(
			(item) => item.value
		) as StartWanVideoTrainingVideoDataset["target_frames"];
	}
}
