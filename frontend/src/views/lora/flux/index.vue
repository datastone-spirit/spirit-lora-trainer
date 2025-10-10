<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:07
 * @LastEditTime: 2025-10-10 09:24:20
 * @LastEditors: mulingyuer
 * @Description: flux 模型训练页面
 * @FilePath: \frontend\src\views\lora\flux\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="lora-flux-page">
		<TwoSplit2>
			<template #left>
				<div class="lora-flux-content">
					<el-form
						ref="ruleFormRef"
						:model="ruleForm"
						:rules="rules"
						label-width="auto"
						label-position="top"
						size="large"
					>
						<FieldTooltipGuide />
						<Collapse v-model="openStep1" title="第1步：LoRA 基本信息">
							<BasicInfo v-model:form="ruleForm" />
						</Collapse>
						<Collapse v-model="openStep2" title="第2步：AI数据集">
							<FluxDataset v-model:form="ruleForm" />
						</Collapse>
						<Collapse v-model="openStep3" title="第3步：训练数据配置">
							<TrainingData v-model:form="ruleForm" />
						</Collapse>
						<Collapse v-model="openStep4" title="第4步：模型参数调教">
							<ModelParameters v-model:form="ruleForm" />
						</Collapse>
						<Collapse v-model="openStep5" title="第5步：训练采样">
							<TrainingSamples v-model:form="ruleForm" />
						</Collapse>
						<SimpleCollapse v-show="isExpert" v-model="openStep6" title="其它：高级设置">
							<AdvancedSettings v-model:form="ruleForm" />
						</SimpleCollapse>
					</el-form>
				</div>
			</template>
			<template #right>
				<SplitRightPanel :form-data="ruleForm" :dir="ruleForm.aiTagRuleForm.image_path" />
			</template>
		</TwoSplit2>
		<TeleportFooterBarContent
			v-model:merge-data="ruleForm"
			:reset-data="defaultForm"
			:form-instance="ruleFormRef"
			:submit-loading="submitLoading"
			@reset-data="onResetData"
			@submit="onSubmit"
		>
			<template #monitor-progress-bar>
				<FluxLoRATrainingMonitor />
			</template>
			<template #right-btn-group>
				<el-button
					v-if="trainingStore.trainingFluxLoRAData.data.showSampling"
					size="large"
					@click="onViewSampling"
				>
					查看采样
				</el-button>
			</template>
		</TeleportFooterBarContent>
	</div>
</template>

<script setup lang="ts">
import { startFluxTraining } from "@/api/lora";
import type { StartFluxTrainingData } from "@/api/lora/types";
import { useFluxLora } from "@/hooks/task/useFluxLora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { DatasetValidator, LoRAValidator } from "@/utils/lora/validator";
import { ViewSamplingDrawerModal } from "@/utils/modal-manager";
import { joinPrefixKey } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import FieldTooltipGuide from "./components/FieldTooltipGuide/index.vue";
import FluxDataset from "./components/FluxDataset/index.vue";
import FluxLoRATrainingMonitor from "./components/FluxLoRATrainingMonitor/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import TrainingSamples from "./components/TrainingSamples/index.vue";
import { formatFormData } from "./flux.helper";
import { validate } from "./flux.validate";
import type { RuleForm } from "./types";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { fluxLoraMonitor } = useFluxLora();
const { useEnhancedLocalStorage } = useEnhancedStorage();

const env = getEnv();
/** 是否开启小白校验 */
const isWhiteCheck = settingsStore.whiteCheck;
const ruleFormRef = ref<FormInstance>();
const localStorageKey = joinPrefixKey("lora_flux_form");
const defaultForm: RuleForm = {
	config: {
		pretrained_model_name_or_path: "./models/unet/flux1-dev.safetensors",
		enable_base_weight: false,
		base_weights: "",
		base_weights_multiplier: undefined,
		enable_bucket: false,
		bucket_no_upscale: false,
		bucket_reso_steps: 64,
		cache_latents: true,
		cache_latents_to_disk: true,
		cache_text_encoder_outputs: true,
		cache_text_encoder_outputs_to_disk: true,
		caption_extension: ".txt",
		color_aug: false,
		ddp_gradient_as_bucket_view: false,
		discrete_flow_shift: 3.1582,
		enable_preview: false,
		flip_aug: false,
		fp8_base: true,
		fp8_base_unet: false,
		full_fp16: false,
		full_bf16: true,
		gradient_accumulation_steps: 1,
		gradient_checkpointing: true,
		guidance_scale: 1,
		keep_tokens_separator: "",
		learning_rate: 0.0008,
		logging_dir: "./logs",
		loss_type: "l2",
		lowram: false,
		lr_scheduler: "constant",
		lr_scheduler_num_cycles: 0,
		lr_warmup_steps: 0,
		max_bucket_reso: 1024,
		max_data_loader_n_workers: 2,
		max_train_epochs: 24,
		min_bucket_reso: 256,
		mixed_precision: "bf16",
		model_prediction_type: "raw",
		network_alpha: 1,
		network_args: "",
		network_dim: 64,
		network_dropout: 0,
		network_module: "networks.lora_flux",
		network_train_text_encoder_only: false,
		network_train_unet_only: false,
		network_weights: "",
		no_half_vae: false,
		num_repeats: 16,
		optimizer_args: "",
		optimizer_type: "adamw8bit",
		output_dir: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		output_name: "",
		persistent_data_loader_workers: true,
		random_crop: false,
		resume: "",
		save_every_n_epochs: 4,
		save_model_as: "safetensors",
		save_precision: "bf16",
		save_state: true,
		sdpa: true,
		seed: 42,
		shuffle_caption: false,
		sigmoid_scale: 1,
		text_encoder_lr: 0.0001,
		timestep_sampling: "shift",
		train_batch_size: 1,
		unet_lr: undefined,
		weighted_captions: false,
		ae: "./models/vae/ae.safetensors",
		clip_l: "./models/clip/clip_l.safetensors",
		t5xxl: "./models/clip/t5xxl_fp16.safetensors",
		t5xxl_max_token_length: undefined,
		highvram: true,
		min_snr_gamma: undefined,
		scale_weight_norms: undefined,
		caption_dropout_rate: undefined,
		caption_dropout_every_n_epochs: undefined,
		caption_tag_dropout_rate: 0,
		clip_skip: 0,
		vae_batch_size: undefined,
		ddp_timeout: undefined,
		resolution: [1024, 1024],
		output_config: true,
		sample_every_n_steps: undefined,
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
		validation_split: 0,
		weighting_scheme: "uniform",
		split_mode: false,
		text_encoder_batch_size: undefined
	},
	aiTagRuleForm: {
		image_path: isWhiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		model_name: "joy-caption-alpha-two",
		prompt_type: "Training Prompt",
		class_token: "",
		global_prompt: "",
		is_append: false,
		advanced_setting: ""
	},
	dataset: {
		keep_tokens: 0,
		class_tokens: ""
	}
};
const ruleForm = useEnhancedLocalStorage<RuleForm>({
	localKey: localStorageKey,
	defaultValue: structuredClone(toRaw(defaultForm) as RuleForm),
	version: "1.0.1"
});
const rules = reactive<FormRules<RuleForm>>({
	"config.output_name": [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	"dataset.class_tokens": [{ required: true, message: "请输入触发词", trigger: "blur" }],
	"config.output_dir": [
		{ required: true, message: "请选择LoRA保存路径", trigger: "blur" },
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				DatasetValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("LoRA保存目录不存在"));
						return;
					}

					callback();
				});
			}
		},
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				LoRAValidator.validateLoRASaveDir({ path: value }).then(({ valid, message }) => {
					if (!valid) {
						callback(new Error(message));
						return;
					}

					callback();
				});
			}
		}
	],
	"aiTagRuleForm.image_path": [
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				DatasetValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("数据集目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	],
	"config.resolution.0": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (value < 64) {
					callback(new Error("图片宽度不能小于64"));
					return;
				}
				if (value % 64 !== 0) {
					callback(new Error("图片宽度必须是64的整数倍"));
					return;
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.resolution.1": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (value < 64) {
					callback(new Error("图片高度不能小于64"));
					return;
				}
				if (value % 64 !== 0) {
					callback(new Error("图片高度必须是64的整数倍"));
					return;
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.lr_scheduler": [
		{
			validator: (_rule: any, _value: string, callback: (error?: string | Error) => void) => {
				// 联动校验
				ruleFormRef.value?.validateField("lr_warmup_steps");
				callback();
			},
			trigger: "change"
		}
	],
	"config.lr_warmup_steps": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (ruleForm.value.config.lr_scheduler === "constant_with_warmup") {
					// 学习调度器为该值时lr_warmup_steps预热步数必须大于0
					if (value <= 0) {
						callback(new Error("学习率预热步数必须大于0"));
						return;
					}
					callback();
				} else {
					// 其他情况lr_warmup_steps预热步数必须等于0
					if (value !== 0) {
						callback(new Error("学习率预热步数必须等于0"));
						return;
					}
					callback();
				}
			},
			trigger: "change"
		}
	],
	"config.sample_every_n_steps": [
		{
			validator: (
				_rule: any,
				value: number | undefined,
				callback: (error?: string | Error) => void
			) => {
				// 联动校验
				ruleFormRef.value?.validateField("sample_prompts");
				if (typeof value !== "number") {
					callback();
					return;
				}
				// 采样步数必须大于等于10
				if ((value ?? 0) < 10) {
					callback(new Error("采样步数必须大于等于10"));
					return;
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_prompts": [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const sampleSteps = ruleForm.value.config.sample_every_n_steps ?? 0;
				const hasPrompt = value.trim().length > 0;

				if (sampleSteps >= 10 && !hasPrompt) {
					callback(new Error("请填写采样提示词"));
				} else if (sampleSteps < 10 && hasPrompt) {
					callback(new Error("未配置采样步数或采样步数小于10，请清空采样提示词"));
				} else {
					callback();
				}
			},
			trigger: "change"
		}
	],
	"config.highvram": [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (value && ruleForm.value.config.train_batch_size >= 2) {
					return callback(new Error("批量大小（train_batch_size）大于或等于2时，请关闭高显存模式"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.blocks_to_swap": [
		{
			validator: (
				_rule: any,
				value: number | undefined,
				callback: (error?: string | Error) => void
			) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.config.train_batch_size > 2 && value !== 32) {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，请选择32个block进行交换")
					);
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.fp8_base": [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.config.train_batch_size > 2 && !value) {
					return callback(new Error("批量大小（train_batch_size）大于2时，请开启 fp8_base"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.lowram": [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.config.train_batch_size > 2 && !value) {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，请开启低内存模式（lowram）")
					);
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.optimizer_type": [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.config.train_batch_size > 2 && value !== "adamw8bit") {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，优化器设置必须设置为 AdamW8bit")
					);
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.network_train_unet_only": [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.config.train_batch_size > 2 && !value) {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，仅训练 U-Net 开关请开启")
					);
				}
				callback();
			},
			trigger: "change"
		}
	]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
const openStep5 = ref(true);
const openStep6 = ref(true);

/** 重置表单 */
function onResetData() {
	if (ruleFormRef.value) ruleFormRef.value.resetFields();
}

/** 提交表单 */
const submitLoading = ref(false);
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		const { valid } = await validate({
			ruleForm: ruleForm.value,
			formInstance: ruleFormRef.value
		});
		if (!valid) {
			submitLoading.value = false;
			return;
		}

		// 开始训练
		const data: StartFluxTrainingData = formatFormData(toRaw(ruleForm.value));
		const { task_id } = await startFluxTraining(data);
		// 监听训练数据
		fluxLoraMonitor.setTaskId(task_id).start();

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		fluxLoraMonitor.stop();
		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

/** 查看采样 */
function onViewSampling() {
	ViewSamplingDrawerModal.show({ filePath: trainingStore.trainingFluxLoRAData.data.samplingPath });
}

// 组件生命周期
onMounted(() => {
	// 恢复表单数据（前提是任务信息存在）
	LoRAHelper.recoveryTaskFormData({ formData: ruleForm.value });
});
</script>

<style lang="scss" scoped>
.lora-flux-page {
	height: $zl-view-footer-bar-height;
}
.flux-footer-bar {
	width: 100%;
	height: 100%;
	justify-content: flex-end;
}
</style>
