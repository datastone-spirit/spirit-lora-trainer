<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 08:58:25
 * @LastEditTime: 2025-09-04 10:19:02
 * @LastEditors: mulingyuer
 * @Description: wan模型训练页面
 * @FilePath: \frontend\src\views\lora\wan-video\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="wan-page">
		<TwoSplit2>
			<template #left>
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
						<WanDataSet v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：训练数据配置">
						<TrainingData v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep4" title="第4步：采样与验证选项">
						<SampleValidator v-model:form="ruleForm" />
					</Collapse>
					<SimpleCollapse v-show="isExpert" v-model="openStep5" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :form-data="ruleForm" :dir="wanDatasetPath" />
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
				<WanTrainingLoRAMonitor />
			</template>
			<template #right-btn-group>
				<el-button
					v-if="trainingStore.trainingWanLoRAData.data.showSampling"
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
import type { StartWanVideoTrainingData } from "@/api/lora";
import { startWanVideoTraining } from "@/api/lora";
import { useWanLora } from "@/hooks/task/useWanLora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import { ViewSamplingDrawerModal } from "@/utils/modal-manager";
import { generateUUID, isImageFile, joinPrefixKey } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo.vue";
import FieldTooltipGuide from "./components/FieldTooltipGuide/index.vue";
import SampleValidator from "./components/SampleValidator.vue";
import TrainingData from "./components/TrainingData.vue";
import WanDataSet from "./components/WanDataSet/index.vue";
import WanTrainingLoRAMonitor from "./components/WanTrainingLoRAMonitor/index.vue";
import type { RuleForm, TargetFrames } from "./types";
import { WanHelper } from "./wan.helper";
import { validate } from "./wan.validate";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { wanLoraMonitor } = useWanLora();

/** wan帮助类 */
const wanHelper = new WanHelper();

const env = getEnv();
/** 是否开启小白校验 */
const isWhiteCheck = settingsStore.whiteCheck;
const ruleFormRef = ref<FormInstance>();
const localStorageKey = joinPrefixKey("lora_wan_form");
const defaultForm: RuleForm = {
	config: {
		task: "i2v-14B",
		output_name: "",
		dit: "",
		dit_high_noise: "",
		clip: "",
		t5: "",
		fp8_t5: false,
		vae: "",
		vae_cache_cpu: false,
		vae_dtype: "float16",
		output_dir: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		max_train_epochs: 10,
		seed: 42,
		mixed_precision: "bf16",
		persistent_data_loader_workers: false,
		max_data_loader_n_workers: 8,
		save_every_n_epochs: 4,
		optimizer_type: "adamw8bit",
		optimizer_args: "",
		learning_rate: 0.0002,
		lr_decay_steps: 0,
		lr_scheduler: "constant",
		lr_scheduler_args: "",
		lr_scheduler_min_lr_ratio: undefined,
		lr_scheduler_num_cycles: 1,
		lr_scheduler_power: 1,
		lr_scheduler_timescale: undefined,
		lr_scheduler_type: "",
		lr_warmup_steps: 0,
		network_alpha: 1,
		network_args: "",
		network_dim: 64,
		network_dropout: undefined,
		network_weights: "",
		dim_from_weights: false,
		blocks_to_swap: 36,
		timestep_boundary: undefined,
		fp8_base: true,
		fp8_scaled: false,
		save_every_n_steps: undefined,
		save_last_n_epochs: undefined,
		save_last_n_epochs_state: undefined,
		save_last_n_steps: undefined,
		save_last_n_steps_state: undefined,
		save_state: true,
		save_state_on_train_end: false,
		resume: "",
		scale_weight_norms: undefined,
		max_grad_norm: 1,
		ddp_gradient_as_bucket_view: false,
		ddp_static_graph: false,
		ddp_timeout: undefined,
		sample_at_first: false,
		sample_every_n_epochs: undefined,
		sample_every_n_steps: undefined,
		i2v_sample_image_path: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		sample_prompts: "",
		guidance_scale: undefined,
		gradient_accumulation_steps: 1,
		gradient_checkpointing: true,
		img_in_txt_in_offloading: false,
		flash3: false,
		flash_attn: false,
		sage_attn: false,
		sdpa: true,
		split_attn: true,
		xformers: true,
		offload_inactive_dit: false,
		discrete_flow_shift: 1,
		min_timestep: undefined,
		max_timestep: undefined,
		mode_scale: 1.29,
		logit_mean: 0,
		logit_std: 1,
		timestep_sampling: "shift",
		sigmoid_scale: 1,
		weighting_scheme: "none"
	},
	data_mode: "image",
	dataset: {
		general: {
			resolution: [720, 480],
			batch_size: 1,
			enable_bucket: true,
			bucket_no_upscale: false,
			caption_extension: ".txt",
			num_repeats: 1
		},
		datasets: [
			{
				image_directory: "", // 使用打标的image_path
				video_directory: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
				frame_extraction: "head",
				target_frames: [
					{ key: generateUUID(), value: 1 },
					{ key: generateUUID(), value: 13 },
					{ key: generateUUID(), value: 25 }
				],
				frame_stride: 10,
				frame_sample: 1,
				max_frames: 129
			}
		]
	},
	aiTagRuleForm: {
		image_path: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		model_name: "joy-caption-alpha-two",
		prompt_type: "Training Prompt",
		class_token: "",
		global_prompt: "",
		is_append: false,
		advanced_setting: ""
	},
	dit_model_type: "low",
	skip_cache_latent: false,
	skip_cache_text_encoder_latent: false
};
const ruleForm = useEnhancedLocalStorage({
	localKey: localStorageKey,
	defaultValue: structuredClone(toRaw(defaultForm)),
	version: "1.0.0"
});
const isWan22 = computed(() => wanHelper.isWan2(ruleForm.value.config.task));
const rules = reactive<FormRules<RuleForm>>({
	"config.output_name": [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	dit_model_type: [
		{
			validator: (_rule, value, callback) => {
				if (!isWan22.value) {
					return callback();
				}

				if (value === "both" && settingsStore.whiteCheck) {
					return callback(
						new Error("智灵平台暂时不支持 both 同时训练低噪声模型和高噪声模型（显存不足）。")
					);
				}

				callback();
			},
			trigger: "change"
		}
	],
	"config.output_dir": [
		{ required: true, message: "请选择LoRA保存路径", trigger: "blur" },
		{
			validator: async (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				LoRAValidator.validateDirectory({ path: value }).then(({ valid }) => {
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
	"config.max_train_epochs": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				// 轮数必须大于或等于保存轮数
				const { save_every_n_epochs } = ruleForm.value.config;

				if (value <= 0) {
					return callback(new Error("总训练轮数必须是一个正整数"));
				}
				if (typeof save_every_n_epochs === "number" && value < save_every_n_epochs) {
					return callback(new Error("总训练轮数 必须大于或等于save_every_n_epochs"));
				}

				callback();
			},
			trigger: "change"
		}
	],
	"config.fp8_base": [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (isWhiteCheck && !value) {
					return callback(new Error("fp8_base必须开启"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.optimizer_type": [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (isWhiteCheck && value !== "adamw8bit") {
					return callback(new Error("优化器类型必须为adamw8bit"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_at_first": [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				// 联动校验
				ruleFormRef.value?.validateField("config.sample_prompts");
				ruleFormRef.value?.validateField("config.i2v_sample_image_path");
				if (!value) return callback();
				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_every_n_epochs": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				// 联动校验
				ruleFormRef.value?.validateField("config.sample_prompts");
				ruleFormRef.value?.validateField("config.i2v_sample_image_path");
				if (typeof value !== "number" || value <= 0) return callback();
				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_every_n_steps": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				// 联动校验
				ruleFormRef.value?.validateField("config.sample_prompts");
				ruleFormRef.value?.validateField("config.i2v_sample_image_path");
				if (typeof value !== "number" || value <= 0) return callback();
				callback();
			},
			trigger: "change"
		}
	],
	"config.i2v_sample_image_path": [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const { task, sample_at_first, sample_every_n_epochs, sample_every_n_steps } =
					ruleForm.value.config;
				const isValidSample =
					sample_at_first || Boolean(sample_every_n_epochs) || Boolean(sample_every_n_steps);
				if (["i2v-A14B", "i2v-14B"].includes(task) && isValidSample) {
					if (typeof value !== "string" || value.trim().length === 0) {
						return callback(new Error("请选择一张图片进行采样"));
					}

					if (isWhiteCheck && !value.startsWith(env.VITE_APP_LORA_OUTPUT_PARENT_PATH)) {
						return callback(
							new Error(`采样图片路径必须以${env.VITE_APP_LORA_OUTPUT_PARENT_PATH}开头`)
						);
					}

					if (!isImageFile(value)) {
						return callback(new Error("请选择一张图片底图进行采样生成"));
					}
				}

				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_prompts": [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const { sample_every_n_epochs, sample_every_n_steps, sample_at_first } =
					ruleForm.value.config;
				// 如果配置了采样选项，则提示必须输入采样提示
				const isLength = value.trim().length > 0;
				const isValidLength = Boolean(sample_every_n_epochs) || Boolean(sample_every_n_steps);
				if (isValidLength && !isLength) {
					return callback(new Error("请输入采样提示词"));
				}
				if (sample_at_first && !isLength && !isValidLength) {
					return callback(new Error("请配置采样步数和采样提示词"));
				}
				if (isLength && !isValidLength) {
					return callback(new Error("配置了采样提示词，请配置采样步数"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.blocks_to_swap": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				const isValue = typeof value === "number" && value !== 0;
				if (isWan22.value && ruleForm.value.config.offload_inactive_dit && isValue) {
					return callback(
						new Error(
							"Wan2.2任务，检测到开启了offload_inactive_dit选项，请将本选项blocks_to_swap设置为0"
						)
					);
				}

				if (typeof value !== "number" || value < 36) {
					return callback(new Error("视频训练时，blocks_to_swap必须大于或等于36"));
				}

				callback();
			},
			trigger: "change"
		}
	],
	"aiTagRuleForm.image_path": [
		{
			trigger: "change",
			validator: (_rule, value, callback) => {
				const { data_mode } = ruleForm.value;
				if (data_mode !== "image") return callback();

				if (typeof value !== "string" || value.trim().length === 0) {
					callback(new Error("请选择训练用的数据集目录"));
					return;
				}

				LoRAValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("数据集目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	],
	"dataset.datasets.0.video_directory": [
		{
			trigger: "change",
			validator: (_rule, value, callback) => {
				const { data_mode } = ruleForm.value;
				if (data_mode !== "video") return callback();

				if (typeof value !== "string" || value.trim().length === 0) {
					callback(new Error("请选择训练用的数据集目录"));
					return;
				}

				LoRAValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("数据集目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	],
	"dataset.general.batch_size": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (isWhiteCheck && value !== 1) {
					return callback(new Error("批量大小必须为1"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	"dataset.datasets.0.frame_extraction": [
		{
			validator: (_rule: any, _value: string, callback: (error?: string | Error) => void) => {
				// 联动校验
				ruleFormRef.value?.validateField("dataset.datasets.0.target_frames");
				callback();
			},
			trigger: "change"
		}
	],
	"dataset.datasets.0.target_frames": [
		{
			validator: (_rule: any, value: TargetFrames, callback: (error?: string | Error) => void) => {
				if (!Array.isArray(value)) {
					callback(new Error("target_frames参数格式错误，请重置表单恢复"));
					return;
				}
				if (ruleForm.value.dataset.datasets[0].frame_extraction === "chunk") {
					const findIndex = value.findIndex((item) => item.value === 1);
					if (findIndex !== -1) {
						callback(new Error("chunk模式下，target_frames参数中不能包含1"));
						return;
					}
					// 数组的值后一个必须大于前一个
					if (value.length > 1) {
						const isSorted = value.every((item, index) => {
							if (index === 0) return true;
							const current = item.value ?? 0;
							const prev = value[index - 1]?.value ?? 0;
							return current > prev;
						});
						if (!isSorted) {
							return callback(new Error("后一个值必须大于前一个值"));
						}
					}
				}

				callback();
			},
			trigger: ["blur", "change"]
		}
	],
	"dataset.datasets.0.max_frames": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (isWhiteCheck && value > Number(env.VITE_APP_WAN_VIDEO_MAX_FRAMES)) {
					return callback(new Error(`最大帧数不能超过${env.VITE_APP_WAN_VIDEO_MAX_FRAMES}`));
				}
				callback();
			},
			trigger: "change"
		}
	],
	"config.mixed_precision": [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const { dit } = ruleForm.value.config;
				const emptyDit = typeof dit !== "string" || dit.trim() === "";
				const isCheck = isWan22.value && settingsStore.whiteCheck && emptyDit && value !== "fp16";

				if (isCheck) {
					return callback(new Error("Wan2.2任务，mixed_precision必须为fp16"));
				}

				callback();
			}
		}
	],
	"config.offload_inactive_dit": [
		{
			validator: (_rule, value, callback) => {
				if (!isWan22.value || !value || ruleForm.value.dit_model_type !== "both") {
					return callback();
				}

				const { blocks_to_swap } = ruleForm.value.config;
				if (value && typeof blocks_to_swap === "number" && blocks_to_swap > 0) {
					return callback(
						new Error(
							"Wan2.2任务，开启了offload_inactive_dit选项，请前往blocks_to_swap选项将其设置为0"
						)
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
/** AI数据集path */
const wanDatasetPath = computed(() => {
	if (ruleForm.value.data_mode === "image") {
		return ruleForm.value.aiTagRuleForm.image_path;
	}
	return ruleForm.value.dataset.datasets[0].video_directory;
});

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
const openStep5 = ref(true);

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

		// 校验
		const { valid } = await validate({
			ruleForm: ruleForm.value,
			formInstance: ruleFormRef.value
		});
		if (!valid) {
			submitLoading.value = false;
			return;
		}

		// 开始训练
		const data: StartWanVideoTrainingData = wanHelper.formatData(ruleForm.value);
		const { task_id } = await startWanVideoTraining(data);
		// 监听训练数据
		wanLoraMonitor.setTaskId(task_id).start();

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		wanLoraMonitor.stop();

		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

/** 查看采样 */
function onViewSampling() {
	ViewSamplingDrawerModal.show({ filePath: trainingStore.trainingWanLoRAData.data.samplingPath });
}

// 组件生命周期
onMounted(() => {
	// 恢复表单数据（前提是任务信息存在）
	LoRAHelper.recoveryTaskFormData({ formData: ruleForm.value });
});
</script>

<style lang="scss" scoped>
.wan-page {
	height: $zl-view-footer-bar-height;
}
</style>
