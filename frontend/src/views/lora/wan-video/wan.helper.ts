/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:01:31
 * @LastEditTime: 2025-08-21 17:29:45
 * @LastEditors: mulingyuer
 * @Description: wan helper
 * @FilePath: \frontend\src\views\lora\wan-video\wan.helper.ts
 * 怎么可能会有bug！！！
 */
import type { StartWanVideoTrainingData, WanVideoVideoDatasetEstimateData } from "@/api/lora";
import { tomlStringify } from "@/utils/toml";
import type { RuleForm } from "./types";
import { LoRAHelper } from "@/utils/lora/lora.helper";

export class WanHelper {
	/** 数据格式化 */
	public formatData(data: RuleForm): StartWanVideoTrainingData {
		const deepCloneForm = structuredClone(toRaw(data));
		const { config } = deepCloneForm;

		const newData: StartWanVideoTrainingData = {
			config: {
				task: config.task,
				output_name: config.output_name,
				dit: config.dit,
				dit_high_noise: config.dit_high_noise,
				clip: config.clip,
				t5: config.t5,
				fp8_t5: config.fp8_t5,
				vae: config.vae,
				vae_cache_cpu: config.vae_cache_cpu,
				vae_dtype: config.vae_dtype,
				output_dir: config.output_dir,
				max_train_epochs: config.max_train_epochs,
				seed: config.seed,
				mixed_precision: config.mixed_precision,
				persistent_data_loader_workers: config.persistent_data_loader_workers,
				max_data_loader_n_workers: config.max_data_loader_n_workers,
				save_every_n_epochs: config.save_every_n_epochs,
				optimizer_type: config.optimizer_type,
				optimizer_args: config.optimizer_args,
				learning_rate: config.learning_rate,
				lr_decay_steps: config.lr_decay_steps,
				lr_scheduler: config.lr_scheduler,
				lr_scheduler_args: config.lr_scheduler_args,
				lr_scheduler_min_lr_ratio: config.lr_scheduler_min_lr_ratio,
				lr_scheduler_num_cycles: config.lr_scheduler_num_cycles,
				lr_scheduler_power: config.lr_scheduler_power,
				lr_scheduler_timescale: config.lr_scheduler_timescale,
				lr_scheduler_type: config.lr_scheduler_type,
				lr_warmup_steps: config.lr_warmup_steps,
				network_alpha: config.network_alpha,
				network_args: config.network_args,
				network_dim: config.network_dim,
				network_dropout: config.network_dropout,
				network_weights: config.network_weights,
				dim_from_weights: config.dim_from_weights,
				blocks_to_swap: config.blocks_to_swap,
				timestep_boundary: Math.floor(config.timestep_boundary * 1000),
				fp8_base: config.fp8_base,
				fp8_scaled: config.fp8_scaled,
				save_every_n_steps: config.save_every_n_steps,
				save_last_n_epochs: config.save_last_n_epochs,
				save_last_n_epochs_state: config.save_last_n_epochs_state,
				save_last_n_steps: config.save_last_n_steps,
				save_last_n_steps_state: config.save_last_n_steps_state,
				save_state: config.save_state,
				save_state_on_train_end: config.save_state_on_train_end,
				resume: config.resume,
				scale_weight_norms: config.scale_weight_norms,
				max_grad_norm: config.max_grad_norm,
				ddp_gradient_as_bucket_view: config.ddp_gradient_as_bucket_view,
				ddp_static_graph: config.ddp_static_graph,
				ddp_timeout: config.ddp_timeout,
				sample_at_first: config.sample_at_first,
				sample_every_n_epochs: config.sample_every_n_epochs,
				sample_every_n_steps: config.sample_every_n_steps,
				sample_prompts: undefined,
				guidance_scale: config.guidance_scale,
				gradient_accumulation_steps: config.gradient_accumulation_steps,
				gradient_checkpointing: config.gradient_checkpointing,
				img_in_txt_in_offloading: config.img_in_txt_in_offloading,
				flash3: config.flash3,
				flash_attn: config.flash_attn,
				sage_attn: config.sage_attn,
				sdpa: config.sdpa,
				split_attn: config.split_attn,
				xformers: config.xformers,
				offload_inactive_dit: config.offload_inactive_dit,
				discrete_flow_shift: config.discrete_flow_shift,
				min_timestep: config.min_timestep,
				max_timestep: config.max_timestep,
				mode_scale: config.mode_scale,
				logit_mean: config.logit_mean,
				logit_std: config.logit_std,
				timestep_sampling: config.timestep_sampling,
				sigmoid_scale: config.sigmoid_scale,
				weighting_scheme: config.weighting_scheme
			},
			dataset: this.formatDataset(deepCloneForm),
			dit_model_type: deepCloneForm.dit_model_type,
			skip_cache_latent: deepCloneForm.skip_cache_latent,
			skip_cache_text_encoder_latent: deepCloneForm.skip_cache_text_encoder_latent,
			frontend_config: tomlStringify(deepCloneForm)
		};

		// 采样
		const {
			sample_at_first,
			sample_every_n_epochs,
			sample_every_n_steps,
			i2v_sample_image_path,
			sample_prompts
		} = deepCloneForm.config;
		const isSample =
			sample_at_first || Boolean(sample_every_n_epochs) || Boolean(sample_every_n_steps);
		if (isSample) {
			newData.config.sample_prompts = JSON.stringify([
				{
					image_path: i2v_sample_image_path,
					prompt: sample_prompts
				}
			]);
		}

		return LoRAHelper.removeEmptyFields(newData);
	}

	/** 计算视频预估图片数量数据格式化 */
	public formatImagesCountEstimate(data: RuleForm): WanVideoVideoDatasetEstimateData {
		return this.formatDataset(data);
	}

	/** 格式化dataset数据 */
	private formatDataset(data: RuleForm): StartWanVideoTrainingData["dataset"] {
		const { data_mode, dataset } = data;
		return {
			general: {
				resolution: [dataset.general.resolution[0], dataset.general.resolution[1]],
				batch_size: dataset.general.batch_size,
				enable_bucket: dataset.general.enable_bucket,
				bucket_no_upscale: dataset.general.bucket_no_upscale,
				caption_extension: dataset.general.caption_extension,
				num_repeats: dataset.general.num_repeats
			},
			datasets: dataset.datasets.map((item) => {
				switch (data_mode) {
					case "image":
						return {
							image_directory: item.image_directory
						};
					case "video":
						return {
							video_directory: item.video_directory,
							frame_extraction: item.frame_extraction,
							target_frames: item.target_frames
								.filter((frame) => typeof frame.value === "number")
								.map((frame) => frame.value!),
							frame_stride: item.frame_stride,
							frame_sample: item.frame_sample,
							max_frames: item.max_frames
						};
				}
			})
		};
	}
}
