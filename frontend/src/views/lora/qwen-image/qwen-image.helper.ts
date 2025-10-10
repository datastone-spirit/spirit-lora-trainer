/*
 * @Author: mulingyuer
 * @Date: 2025-08-12 17:01:22
 * @LastEditTime: 2025-10-09 15:25:10
 * @LastEditors: mulingyuer
 * @Description: qwen-image 帮助函数
 * @FilePath: \frontend\src\views\lora\qwen-image\qwen-image.helper.ts
 * 怎么可能会有bug！！！
 */
import type { StartQwenImageTrainingData } from "@/api/lora";
import { useSettingsStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { generateUUID, SerializeUndefined } from "@/utils/tools";
import type { Dataset, DatasetGeneral, DatasetItem, RuleForm } from "./types";

/** 依赖注入的key */
export const QwenImageRuleFormRef = Symbol("QwenImageRuleFormRef");

/** 生成默认的数据集配置 */
export function generateDefaultDatasetGeneral(): DatasetGeneral {
	return {
		resolution: [960, 544],
		caption_extension: ".txt",
		batch_size: 1,
		enable_bucket: true,
		bucket_no_upscale: false
	};
}

/** 生成默认数据集对象 */
export function generateDefaultDataset(data: {
	general?: DatasetGeneral;
	index?: number;
}): DatasetItem {
	const index = data?.index ?? 0;
	const general = data?.general
		? structuredClone(toRaw(data.general))
		: generateDefaultDatasetGeneral();

	const env = getEnv();
	const settingsStore = useSettingsStore();
	return {
		...general,
		id: generateUUID(),
		name: `数据集${index + 1}`,
		index: index,
		image_directory: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		control_directory: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		preview: "image_directory",
		qwen_image_edit_no_resize_control: false,
		qwen_image_edit_control_resolution: [null, null],
		num_repeats: 1
	};
}

/** 格式化表单数据
 * 注意传递进来的form必须是原始对象，不能是Proxy对象，可以用toRaw方法转换
 */
export function formatFormData(form: RuleForm): StartQwenImageTrainingData {
	const deepCloneForm = structuredClone(form);
	const { config, dataset, multi_gpu_config } = deepCloneForm;

	const data: StartQwenImageTrainingData = {
		config: {
			output_name: config.output_name,
			lora_type: config.lora_type,
			dit: config.dit,
			vae: config.vae,
			vae_dtype: config.vae_dtype,
			text_encoder: config.text_encoder,
			output_dir: config.output_dir,
			seed: config.seed,
			max_train_steps: config.max_train_steps,
			max_train_epochs: config.max_train_epochs,
			mixed_precision: config.mixed_precision,
			save_state: config.save_state,
			save_every_n_steps: config.save_every_n_steps,
			save_every_n_epochs: config.save_every_n_epochs,
			save_last_n_epochs: config.save_last_n_epochs,
			save_last_n_epochs_state: config.save_last_n_epochs_state,
			save_last_n_steps: config.save_last_n_steps,
			save_last_n_steps_state: config.save_last_n_steps_state,
			save_state_on_train_end: config.save_state_on_train_end,
			resume: config.resume,
			optimizer_type: config.optimizer_type,
			optimizer_args: config.optimizer_args,
			learning_rate: config.learning_rate,
			lr_scheduler: config.lr_scheduler,
			lr_warmup_steps: config.lr_warmup_steps,
			lr_decay_steps: config.lr_decay_steps,
			lr_scheduler_args: config.lr_scheduler_args,
			lr_scheduler_min_lr_ratio: config.lr_scheduler_min_lr_ratio,
			lr_scheduler_num_cycles: config.lr_scheduler_num_cycles,
			lr_scheduler_power: config.lr_scheduler_power,
			lr_scheduler_timescale: config.lr_scheduler_timescale,
			lr_scheduler_type: config.lr_scheduler_type,
			sample_at_first: config.sample_at_first,
			sample_every_n_epochs: config.sample_every_n_epochs,
			sample_every_n_steps: config.sample_every_n_steps,
			sample_prompts: config.sample_prompts,
			guidance_scale: config.guidance_scale,
			network_dim: config.network_dim,
			network_alpha: config.network_alpha,
			network_dropout: config.network_dropout,
			network_args: config.network_args,
			base_weights: config.base_weights,
			base_weights_multiplier: config.base_weights_multiplier,
			timestep_sampling: config.timestep_sampling,
			sigmoid_scale: config.sigmoid_scale,
			min_timestep: config.min_timestep,
			max_timestep: config.max_timestep,
			mode_scale: config.mode_scale,
			discrete_flow_shift: config.discrete_flow_shift,
			weighting_scheme: config.weighting_scheme,
			scale_weight_norms: config.scale_weight_norms,
			max_grad_norm: config.max_grad_norm,
			gradient_checkpointing: config.gradient_checkpointing,
			sdpa: config.sdpa,
			sage_attn: config.sage_attn,
			xformers: config.xformers,
			split_attn: config.split_attn,
			flash3: config.flash3,
			flash_attn: config.flash_attn,
			fp8_base: config.fp8_base,
			fp8_scaled: config.fp8_scaled,
			fp8_vl: config.fp8_vl,
			max_data_loader_n_workers: config.max_data_loader_n_workers,
			persistent_data_loader_workers: config.persistent_data_loader_workers,
			blocks_to_swap: config.blocks_to_swap,
			img_in_txt_in_offloading: config.img_in_txt_in_offloading,
			ddp_gradient_as_bucket_view: config.ddp_gradient_as_bucket_view,
			ddp_static_graph: config.ddp_static_graph,
			ddp_timeout: config.ddp_timeout
		},
		dataset: {
			general: dataset.general,
			datasets: dataset.datasets.map((item) => {
				const newItem: Dataset["datasets"][number] = {
					image_directory: item.image_directory,
					control_directory: item.control_directory,
					qwen_image_edit_no_resize_control: item.qwen_image_edit_no_resize_control,
					qwen_image_edit_control_resolution: [null, null],
					num_repeats: item.num_repeats,
					resolution: item.resolution,
					caption_extension: item.caption_extension,
					batch_size: item.batch_size,
					enable_bucket: item.enable_bucket,
					bucket_no_upscale: item.bucket_no_upscale
				};

				// 如果没有开启edit训练，就移除相关字段
				if (deepCloneForm.config.lora_type === "qwen_image") {
					Reflect.deleteProperty(newItem, "control_directory");
					Reflect.deleteProperty(newItem, "qwen_image_edit_control_resolution");
				} else {
					// 没有设置qwen_image_edit_control_resolution，就删除该字段
					const findNoneIndex = item.qwen_image_edit_control_resolution.findIndex(
						(v) => typeof v !== "number"
					);
					if (findNoneIndex !== -1 || item.qwen_image_edit_control_resolution.length <= 0) {
						Reflect.deleteProperty(newItem, "qwen_image_edit_control_resolution");
					} else {
						newItem.qwen_image_edit_control_resolution = item.qwen_image_edit_control_resolution;
					}
				}

				return newItem;
			})
		},
		multi_gpu_config: {
			multi_gpu_enabled: multi_gpu_config.multi_gpu_enabled,
			num_gpus: multi_gpu_config.num_gpus,
			gpu_ids: multi_gpu_config.gpu_ids,
			distributed_backend: multi_gpu_config.distributed_backend,
			auto_gpu_selection: multi_gpu_config.auto_gpu_selection,
			memory_requirement_mb: multi_gpu_config.memory_requirement_mb,
			gradient_accumulation_steps: multi_gpu_config.gradient_accumulation_steps,
			gradient_sync_every_n_steps: multi_gpu_config.gradient_sync_every_n_steps
		},
		skip_cache_latent: deepCloneForm.skip_cache_latent,
		skip_cache_text_encoder_latent: deepCloneForm.skip_cache_text_encoder_latent,
		frontend_config: JSON.stringify(SerializeUndefined.serialize(deepCloneForm))
	};
	if (typeof config.network_weights === "string" && config.network_weights.trim() !== "") {
		data.config.network_weights = config.network_weights;
	}

	return LoRAHelper.removeEmptyFields(data);
}
