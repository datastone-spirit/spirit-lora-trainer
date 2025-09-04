/*
 * @Author: mulingyuer
 * @Date: 2025-01-07 10:00:01
 * @LastEditTime: 2025-09-04 09:25:24
 * @LastEditors: mulingyuer
 * @Description: 换源视频训练帮助
 * @FilePath: \frontend\src\views\lora\hunyuan-video\hunyuan.helper.ts
 * 怎么可能会有bug！！！
 */
import type { StartHyVideoTrainingData } from "@/api/lora";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { SerializeUndefined } from "@/utils/tools";
import type { RuleForm } from "./types";

/** 表单数据格式化 */
export function formatFormData(form: RuleForm): StartHyVideoTrainingData {
	const deepCloneForm = structuredClone(toRaw(form));
	const { config, dataset, aiTagRuleForm } = deepCloneForm;
	const frame_buckets = dataset.directory[0].frame_buckets
		.map((item) => item.value)
		.filter((item) => typeof item === "number");

	const data: StartHyVideoTrainingData = {
		config: {
			output_dir: config.output_dir,
			epochs: config.epochs,
			micro_batch_size_per_gpu: config.micro_batch_size_per_gpu,
			pipeline_stages: config.pipeline_stages,
			gradient_accumulation_steps: config.gradient_accumulation_steps,
			gradient_clipping: config.gradient_clipping,
			warmup_steps: config.warmup_steps,
			eval_every_n_epochs: config.eval_every_n_epochs,
			eval_before_first_step: config.eval_before_first_step,
			eval_micro_batch_size_per_gpu: config.eval_micro_batch_size_per_gpu,
			eval_gradient_accumulation_steps: config.eval_gradient_accumulation_steps,
			save_every_n_epochs: config.save_every_n_epochs,
			checkpoint_every_n_minutes: config.checkpoint_every_n_minutes,
			activation_checkpointing: config.activation_checkpointing,
			partition_method: config.partition_method,
			save_dtype: config.save_dtype,
			caching_batch_size: config.caching_batch_size,
			steps_per_print: config.steps_per_print,
			video_clip_mode: config.video_clip_mode,
			model: {
				type: config.model.type,
				transformer_path: config.model.transformer_path,
				vae_path: config.model.vae_path,
				llm_path: config.model.llm_path,
				clip_path: config.model.clip_path,
				dtype: config.model.dtype,
				transformer_dtype: config.model.transformer_dtype,
				timestep_sample_method: config.model.timestep_sample_method
			},
			adapter: {
				type: config.adapter.type,
				rank: config.adapter.rank,
				dtype: config.adapter.dtype,
				init_from_existing: config.adapter.init_from_existing
			},
			optimizer: {
				type: config.optimizer.type,
				lr: config.optimizer.lr,
				betas: config.optimizer.betas,
				weight_decay: config.optimizer.weight_decay,
				eps: config.optimizer.eps
			}
		},
		dataset: {
			resolutions: dataset.directory[0].resolutions,
			frame_buckets: frame_buckets,
			enable_ar_bucket: dataset.enable_ar_bucket,
			min_ar: dataset.min_ar,
			max_ar: dataset.max_ar,
			num_ar_buckets: dataset.num_ar_buckets,
			directory: [
				{
					path: aiTagRuleForm.image_path,
					num_repeats: dataset.directory[0].num_repeats,
					resolutions: dataset.directory[0].resolutions,
					frame_buckets: frame_buckets
				}
			]
		},
		frontend_config: JSON.stringify(SerializeUndefined.serialize(deepCloneForm))
	};

	return LoRAHelper.removeEmptyFields(data);
}
