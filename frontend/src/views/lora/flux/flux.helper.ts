/*
 * @Author: mulingyuer
 * @Date: 2024-12-17 17:02:12
 * @LastEditTime: 2025-09-03 15:37:04
 * @LastEditors: mulingyuer
 * @Description: flux helper
 * @FilePath: \frontend\src\views\lora\flux\flux.helper.ts
 * 怎么可能会有bug！！！
 */
import type { StartFluxTrainingData } from "@/api/lora/types";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { SerializeUndefined } from "@/utils/tools";
import type { RuleForm } from "./types";

/** 格式化表单数据
 * 注意传递进来的form必须是原始对象，不能是Proxy对象，可以用toRaw方法转换
 */
export function formatFormData(form: RuleForm): StartFluxTrainingData {
	const deepCloneForm = structuredClone(form);
	const { config, aiTagRuleForm, dataset } = deepCloneForm;

	const data: StartFluxTrainingData = {
		config: {
			pretrained_model_name_or_path: config.pretrained_model_name_or_path,
			enable_base_weight: config.enable_base_weight,
			base_weights: config.base_weights,
			base_weights_multiplier: config.base_weights_multiplier,
			enable_bucket: config.enable_bucket,
			bucket_no_upscale: config.bucket_no_upscale,
			bucket_reso_steps: config.bucket_reso_steps,
			cache_latents: config.cache_latents,
			cache_latents_to_disk: config.cache_latents_to_disk,
			cache_text_encoder_outputs: config.cache_text_encoder_outputs,
			cache_text_encoder_outputs_to_disk: config.cache_text_encoder_outputs_to_disk,
			caption_extension: config.caption_extension,
			color_aug: config.color_aug,
			ddp_gradient_as_bucket_view: config.ddp_gradient_as_bucket_view,
			discrete_flow_shift: config.discrete_flow_shift,
			enable_preview: config.enable_preview,
			flip_aug: config.flip_aug,
			fp8_base: config.fp8_base,
			fp8_base_unet: config.fp8_base_unet,
			full_fp16: config.full_fp16,
			full_bf16: config.full_bf16,
			gradient_accumulation_steps: config.gradient_accumulation_steps,
			gradient_checkpointing: config.gradient_checkpointing,
			guidance_scale: config.guidance_scale,
			keep_tokens_separator: config.keep_tokens_separator,
			learning_rate: config.learning_rate,
			logging_dir: config.logging_dir,
			loss_type: config.loss_type,
			lowram: config.lowram,
			lr_scheduler: config.lr_scheduler,
			lr_scheduler_num_cycles: config.lr_scheduler_num_cycles,
			lr_warmup_steps: config.lr_warmup_steps,
			max_bucket_reso: config.max_bucket_reso,
			max_data_loader_n_workers: config.max_data_loader_n_workers,
			max_train_epochs: config.max_train_epochs,
			min_bucket_reso: config.min_bucket_reso,
			mixed_precision: config.mixed_precision,
			model_prediction_type: config.model_prediction_type,
			network_alpha: config.network_alpha,
			network_args: config.network_args,
			network_dim: config.network_dim,
			network_dropout: config.network_dropout,
			network_module: config.network_module,
			network_train_text_encoder_only: config.network_train_text_encoder_only,
			network_train_unet_only: config.network_train_unet_only,
			network_weights: config.network_weights,
			no_half_vae: config.no_half_vae,
			num_repeats: config.num_repeats,
			optimizer_args: config.optimizer_args,
			optimizer_type: config.optimizer_type,
			output_dir: config.output_dir,
			output_name: config.output_name,
			persistent_data_loader_workers: config.persistent_data_loader_workers,
			random_crop: config.random_crop,
			resume: config.resume,
			save_every_n_epochs: config.save_every_n_epochs,
			save_model_as: config.save_model_as,
			save_precision: config.save_precision,
			save_state: config.save_state,
			sdpa: config.sdpa,
			seed: config.seed,
			shuffle_caption: config.shuffle_caption,
			sigmoid_scale: config.sigmoid_scale,
			text_encoder_lr: config.text_encoder_lr,
			timestep_sampling: config.timestep_sampling,
			train_batch_size: config.train_batch_size,
			unet_lr: config.unet_lr,
			weighted_captions: config.weighted_captions,
			ae: config.ae,
			clip_l: config.clip_l,
			t5xxl: config.t5xxl,
			t5xxl_max_token_length: config.t5xxl_max_token_length,
			highvram: config.highvram,
			min_snr_gamma: config.min_snr_gamma,
			scale_weight_norms: config.scale_weight_norms,
			caption_dropout_rate: config.caption_dropout_rate,
			caption_dropout_every_n_epochs: config.caption_dropout_every_n_epochs,
			caption_tag_dropout_rate: config.caption_tag_dropout_rate,
			clip_skip: config.clip_skip,
			vae_batch_size: config.vae_batch_size,
			ddp_timeout: config.ddp_timeout,
			resolution: config.resolution.join(","),
			output_config: config.output_config,
			sample_every_n_steps: config.sample_every_n_steps,
			sample_prompts: config.sample_prompts,
			blocks_to_swap: config.blocks_to_swap,
			logit_mean: config.logit_mean,
			logit_std: config.logit_std,
			mode_scale: config.mode_scale,
			disable_mmap_load_safetensors: config.disable_mmap_load_safetensors,
			max_validation_steps: config.max_validation_steps,
			validate_every_n_epochs: config.validate_every_n_epochs,
			validate_every_n_steps: config.validate_every_n_steps,
			validation_seed: config.validation_seed,
			validation_split: config.validation_split,
			weighting_scheme: config.weighting_scheme,
			split_mode: config.split_mode,
			text_encoder_batch_size: config.text_encoder_batch_size
		},
		dataset: {
			datasets: [
				{
					batch_size: config.train_batch_size,
					keep_tokens: dataset.keep_tokens,
					resolution: config.resolution.join(","),
					subsets: [
						{
							class_tokens: dataset.class_tokens,
							image_dir: aiTagRuleForm.image_path,
							num_repeats: config.num_repeats
						}
					]
				}
			],
			general: {
				caption_extension: config.caption_extension,
				keep_tokens: dataset.keep_tokens,
				shuffle_caption: config.shuffle_caption
			}
		},
		frontend_config: JSON.stringify(SerializeUndefined.serialize(deepCloneForm))
	};

	return LoRAHelper.removeEmptyFields(data);
}
