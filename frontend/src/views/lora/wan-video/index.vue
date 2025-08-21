<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 08:58:25
 * @LastEditTime: 2025-08-21 15:31:24
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
				<SplitRightPanel :toml="toml" :dir="wanDatasetPath" />
			</template>
		</TwoSplit2>
		<TeleportFooterBarContent
			v-model:merge-data="ruleForm"
			:reset-data="defaultForm"
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
import { tomlStringify } from "@/utils/toml";
import { generateSeed, generateUUID, isImageFile } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo.vue";
import SampleValidator from "./components/SampleValidator.vue";
import TrainingData from "./components/TrainingData.vue";
import WanDataSet from "./components/WanDataSet/index.vue";
import WanTrainingLoRAMonitor from "./components/WanTrainingLoRAMonitor/index.vue";
import type { RuleForm, TargetFrames } from "./types";
import { WanHelper } from "./wan.helper";
import { validate } from "./wan.validate";
import { joinPrefixKey } from "@/utils/tools";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { wanLoraMonitor } = useWanLora();

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
		seed: generateSeed(),
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
		timestep_boundary: 0,
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
		sample_every_n_epochs: 0,
		sample_every_n_steps: 0,
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
		discrete_flow_shift: 3,
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
				image_directory: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
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
	tagConfig: {
		tag_model: "joy-caption-alpha-two",
		joy_caption_prompt_type: "Training Prompt",
		is_add_global_prompt: false,
		global_prompt: "",
		tag_advanced_settings: false,
		tag_global_prompt: "",
		tag_is_append: false
	},
	dit_model_type: "low",
	skip_cache_latent: false,
	skip_cache_text_encoder_latent: false
};
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(toRaw(defaultForm)));
const isWan22 = computed(() => ["t2v-A14B", "i2v-A14B"].includes(ruleForm.value.config.task));
const rules = reactive<FormRules<RuleForm>>({
	"config.output_name": [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
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
				if (!value) return callback();
				// 联动校验
				ruleFormRef.value?.validateField("config.sample_prompts");
				ruleFormRef.value?.validateField("config.i2v_sample_image_path");
				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_every_n_epochs": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (typeof value !== "number" || value <= 0) return callback();
				// 联动校验
				ruleFormRef.value?.validateField("config.sample_prompts");
				ruleFormRef.value?.validateField("config.i2v_sample_image_path");
				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_every_n_steps": [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (typeof value !== "number" || value <= 0) return callback();
				// 联动校验
				ruleFormRef.value?.validateField("config.sample_prompts");
				ruleFormRef.value?.validateField("config.i2v_sample_image_path");
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
				const { sample_every_n_epochs, sample_every_n_steps } = ruleForm.value.config;
				// 如果配置了采样选项，则提示必须输入采样提示
				const isLength = value.trim().length > 0;
				const isValidLength = Boolean(sample_every_n_epochs) || Boolean(sample_every_n_steps);
				if (isValidLength && !isLength) {
					return callback(new Error("请输入采样提示词"));
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
				if (ruleForm.value.data_mode !== "video") return callback();
				if (isWan22.value && ruleForm.value.config.offload_inactive_dit && value !== 0) {
					return callback(
						new Error("Wan2.2任务，且开启了offload_inactive_dit，blocks_to_swap必须为0")
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
	"dataset.datasets.0.image_directory": [
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
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
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
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
				if (isWan22.value && settingsStore.whiteCheck && value !== "fp16") {
					return callback(new Error("Wan2.2任务，mixed_precision必须为fp16"));
				}

				callback();
			}
		}
	]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** wan帮助类 */
const wanHelper = new WanHelper();
/** AI数据集path */
const wanDatasetPath = computed(() => {
	if (ruleForm.value.data_mode === "image") {
		return ruleForm.value.dataset.datasets[0].image_directory;
	}
	return ruleForm.value.dataset.datasets[0].video_directory;
});

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
const openStep5 = ref(true);

/** toml */
const toml = ref("");
const generateToml = useDebounceFn(() => {
	toml.value = tomlStringify(ruleForm.value);
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });

/** 监听表单的一些配置项进行默认值设置 */
watch([() => ruleForm.value.config.task, () => ruleForm.value.dit_model_type], onDefaultChange);
const TASK_CONFIGS = {
	"i2v-14B": { timestep_boundary: 0, discrete_flow_shift: 3 },
	"t2v-14B": { timestep_boundary: 0, discrete_flow_shift: 3 },
	"t2v-A14B": { timestep_boundary: 0.875, discrete_flow_shift: 12 },
	"i2v-A14B": { timestep_boundary: 0.9, discrete_flow_shift: 5 }
} as const;
const DIT_MODEL_RANGES = {
	"t2v-A14B": {
		low: { min_timestep: 0, max_timestep: 875 },
		high: { min_timestep: 875, max_timestep: 1000 },
		both: { min_timestep: 0, max_timestep: 1000 }
	},
	"i2v-A14B": {
		low: { min_timestep: 0, max_timestep: 900 },
		high: { min_timestep: 900, max_timestep: 1000 },
		both: { min_timestep: 0, max_timestep: 1000 }
	}
} as const;
const DIT_MODEL_CONFIGS = {
	low: { offload_inactive_dit: false, blocks_to_swap: 36 },
	high: { offload_inactive_dit: false, blocks_to_swap: 36 },
	both: { offload_inactive_dit: true, blocks_to_swap: 0 }
} as const;
function onDefaultChange() {
	const { task } = ruleForm.value.config;
	const { dit_model_type } = ruleForm.value;

	// 应用任务配置
	// @ts-expect-error fuck ts type check
	const taskConfig = TASK_CONFIGS[task];
	if (!taskConfig) {
		console.warn(`未处理的任务类型: ${task}`);
		return;
	}
	Object.assign(ruleForm.value.config, taskConfig);

	// 应用特定任务的 timestep 范围配置
	// @ts-expect-error fuck ts type check
	const ditRanges = DIT_MODEL_RANGES[task]?.[dit_model_type];
	if (ditRanges) {
		Object.assign(ruleForm.value.config, ditRanges);
	}

	// 应用 dit model 配置
	// @ts-expect-error fuck ts type check
	const ditConfig = DIT_MODEL_CONFIGS[dit_model_type];
	if (ditConfig) {
		Object.assign(ruleForm.value.config, ditConfig);
	}

	if (isWan22.value && settingsStore.whiteCheck) {
		ruleForm.value.config.mixed_precision = "fp16";
	}

	ElMessage.success("检测到任务类型变化，已应用对应的默认配置");
}

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
	// 监听如果成功恢复，任务信息会被更新
	wanLoraMonitor.resume();
	// 恢复表单数据（前提是任务信息存在）
	LoRAHelper.recoveryTaskFormData({ formData: ruleForm.value });
});
onUnmounted(() => {
	wanLoraMonitor.pause();
});
</script>

<style lang="scss" scoped>
.wan-page {
	height: $zl-view-footer-bar-height;
}
</style>
