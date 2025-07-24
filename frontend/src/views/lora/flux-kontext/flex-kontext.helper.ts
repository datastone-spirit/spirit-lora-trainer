/*
 * @Author: mulingyuer
 * @Date: 2025-07-23 17:50:46
 * @LastEditTime: 2025-07-24 10:56:41
 * @LastEditors: mulingyuer
 * @Description: flux-kontext 帮助方法
 * @FilePath: \frontend\src\views\lora\flux-kontext\flex-kontext.helper.ts
 * 怎么可能会有bug！！！
 */
import { generateUUID } from "@/utils/tools";
import type { Datasets, RuleForm, SamplePrompts } from "./types";
import { getEnv } from "@/utils/env";
import type { StartFluxKontextTrainingData } from "@/api/lora";
import { tomlStringify } from "@/utils/toml";

/** 生成默认样本提示对象 */
export function generateDefaultSamplePrompt(): SamplePrompts[number] {
	return {
		id: generateUUID(),
		prompt: "",
		ctrl_img: ""
	};
}

/** 生成默认数据集对象 */
export function generateDefaultDataset(index?: number): Datasets[number] {
	index = index ?? 0;
	const env = getEnv();

	return {
		id: generateUUID(),
		name: `数据集${index + 1}`,
		index: index,
		folder_path: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		control_path: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		caption_dropout_rate: 0.05,
		shuffle_tokens: false,
		cache_latents_to_disk: false,
		is_reg: false,
		network_weight: 1,
		resolution: [512, 768],
		caption_ext: "txt"
	};
}

/** 格式化表单数据 */
export function formatFormData(form: RuleForm): StartFluxKontextTrainingData {
	const deepCloneForm = structuredClone(toRaw(form));

	const data: StartFluxKontextTrainingData = {
		job: "extension",
		config: {
			name: deepCloneForm.name,
			process: [
				{
					type: "sd_trainer",
					training_folder: deepCloneForm.training_folder,
					trigger_word: deepCloneForm.trigger_word,
					device: "cuda:0",
					network: {
						type: "lora",
						linear: deepCloneForm.network.linear,
						linear_alpha: deepCloneForm.network.linear_alpha
					},
					save: {
						dtype: deepCloneForm.save.dtype,
						save_every: deepCloneForm.save.save_every,
						max_step_saves_to_keep: deepCloneForm.save.max_step_saves_to_keep,
						push_to_hub: false
					},
					train: {
						batch_size: deepCloneForm.train.batch_size,
						steps: deepCloneForm.train.steps,
						gradient_accumulation_steps: deepCloneForm.train.gradient_accumulation_steps,
						train_unet: true,
						train_text_encoder: false,
						gradient_checkpointing: true,
						noise_scheduler: deepCloneForm.train.noise_scheduler,
						optimizer: deepCloneForm.train.optimizer,
						timestep_type: deepCloneForm.train.timestep_type,
						content_or_style: deepCloneForm.train.content_or_style,
						optimizer_params: {
							weight_decay: deepCloneForm.train.optimizer_params.weight_decay
						},
						unload_text_encoder: deepCloneForm.train.unload_text_encoder,
						lr: deepCloneForm.train.lr,
						ema_config: {
							use_ema: deepCloneForm.train.ema_config.use_ema,
							ema_decay: deepCloneForm.train.ema_config.ema_decay
						},
						skip_first_sample: deepCloneForm.train.skip_first_sample,
						disable_sampling: deepCloneForm.train.disable_sampling,
						diff_output_preservation: deepCloneForm.train.diff_output_preservation,
						diff_output_preservation_multiplier:
							deepCloneForm.train.diff_output_preservation_multiplier,
						diff_output_preservation_class: deepCloneForm.train.diff_output_preservation_class,
						dtype: "bf16"
					},
					model: {
						arch: "flux_kontext",
						name_or_path: deepCloneForm.model.name_or_path,
						quantize: deepCloneForm.model.quantize,
						quantize_te: deepCloneForm.model.quantize_te
					},
					sample: {
						sampler: deepCloneForm.sample.sampler,
						sample_every: deepCloneForm.sample.sample_every,
						width: deepCloneForm.sample.width,
						height: deepCloneForm.sample.height,
						seed: deepCloneForm.sample.seed,
						walk_seed: deepCloneForm.sample.walk_seed,
						guidance_scale: deepCloneForm.sample.guidance_scale,
						sample_steps: deepCloneForm.sample.sample_steps,
						neg: "",
						prompts: deepCloneForm.sample.prompts.map((prompt) => {
							return `${prompt.prompt} --ctrl_img ${prompt.ctrl_img}`;
						})
					},
					datasets: deepCloneForm.datasets
				}
			]
		},
		meta: {
			name: "",
			version: ""
		},
		frontend_config: tomlStringify(deepCloneForm)
	};

	return data;
}
