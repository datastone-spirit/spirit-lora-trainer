<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 08:58:25
 * @LastEditTime: 2025-04-08 11:45:29
 * @LastEditors: mulingyuer
 * @Description: wan模型训练页面
 * @FilePath: \frontend\src\views\lora\wan-video\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="wan-page">
		<TwoSplit direction="horizontal" :sizes="[50, 50]" :minSize="[550, 380]">
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
					<Collapse v-model="openStep3" title="第4步：采样与验证选项">
						<SampleValidator v-model:form="ruleForm" />
					</Collapse>
					<SimpleCollapse v-show="isExpert" v-model="openStep4" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="wanDatasetPath" />
			</template>
		</TwoSplit>
		<TeleportFooterBarContent
			v-model:merge-data="ruleForm"
			:reset-data="defaultForm"
			:submit-loading="submitLoading"
			@reset-data="onResetData"
			@submit="onSubmit"
		>
			<template #monitor-progress-bar>
				<WanTrainingMonitor />
			</template>
			<template #right-btn-group>
				<el-button v-if="monitorWanLoraData.data.showSampling" size="large" @click="onViewSampling">
					查看采样
				</el-button>
			</template>
		</TeleportFooterBarContent>
	</div>
</template>

<script setup lang="ts">
import type { StartWanVideoTrainingData } from "@/api/lora";
import { startWanVideoTraining } from "@/api/lora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useWanLora } from "@/hooks/useWanLora";
import { useSettingsStore, useModalManagerStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { checkDirectory, recoveryTaskFormData } from "@/utils/lora.helper";
import { tomlStringify } from "@/utils/toml";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo.vue";
import SampleValidator from "./components/SampleValidator.vue";
import TrainingData from "./components/TrainingData.vue";
import WanDataSet from "./components/WanDataSet/index.vue";
import type { RuleForm, TargetFrames } from "./types";
import { WanHelper } from "./wan.helper";
import { WanValidate } from "./wan.validate";
import { generateUUID } from "@/utils/tools";

const settingsStore = useSettingsStore();
const modalManagerStore = useModalManagerStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const {
	startQueryWanTask,
	pauseQueryWanTask,
	resumeQueryWanTask,
	stopQueryWanTask,
	monitorWanLoraData,
	queryWanTaskInfo
} = useWanLora();

const env = getEnv();
/** 是否开启小白校验 */
const isWhiteCheck = import.meta.env.VITE_APP_WHITE_CHECK === "true";
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_wan_form`;
const defaultForm: RuleForm = {
	config: {
		task: "i2v-14B",
		output_name: "",
		i2v_dit: "./models/wan/wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors",
		t2v_dit: "./models/wan/wan2.1_t2v_14B_fp8_e4m3fn.safetensors",
		clip: "./models/clip/models_clip_open-clip-xlm-roberta-large-vit-huge-14.pth",
		t5: "./models/clip/models_t5_umt5-xxl-enc-bf16.pth",
		fp8_t5: false,
		vae: "./models/vae/wan_2.1_vae.safetensors",
		vae_cache_cpu: false,
		vae_dtype: "float16",
		output_dir: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		max_train_epochs: 10,
		max_train_steps: undefined,
		seed: undefined,
		mixed_precision: "bf16",
		persistent_data_loader_workers: false,
		max_data_loader_n_workers: 8,
		optimizer_type: "adamw8bit",
		optimizer_args: "",
		learning_rate: "2e-4",
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
		network_module: "",
		network_weights: "",
		dim_from_weights: false,
		blocks_to_swap: 36,
		fp8_base: true,
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
		max_grad_norm: 1,
		ddp_gradient_as_bucket_view: false,
		ddp_static_graph: false,
		ddp_timeout: undefined,
		sample_at_first: false,
		sample_every_n_epochs: undefined,
		sample_every_n_steps: undefined,
		sample_prompts: "",
		guidance_scale: undefined,
		show_timesteps: "",
		gradient_accumulation_steps: 1,
		gradient_checkpointing: true,
		img_in_txt_in_offloading: false,
		flash3: false,
		flash_attn: false,
		sage_attn: false,
		sdpa: true,
		split_attn: false,
		xformers: false,
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
			resolution: [960, 544],
			batch_size: 1,
			enable_bucket: true,
			bucket_no_upscale: false,
			caption_extension: ".txt",
			num_repeats: 1
		},
		datasets: [
			{
				image_directory: "/root",
				video_directory: "/root",
				frame_extraction: "head",
				target_frames: [
					{ key: generateUUID(), value: 1 },
					{ key: generateUUID(), value: 13 },
					{ key: generateUUID(), value: 25 }
				],
				frame_stride: 10,
				frame_sample: 1
			}
		]
	},
	tagConfig: {
		tag_model: "joy-caption-alpha-two",
		joy_caption_prompt_type: "Training Prompt",
		tag_advanced_settings: false,
		tag_global_prompt: "",
		tag_is_append: false
	}
};
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(toRaw(defaultForm)));
const rules = reactive<FormRules<RuleForm>>({
	"config.output_name": [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	"config.output_dir": [
		{ required: true, message: "请选择LoRA保存路径", trigger: "blur" },
		{
			asyncValidator: async (
				_rule: any,
				value: string,
				callback: (error?: string | Error) => void
			) => {
				try {
					const isExists = await checkDirectory(value);
					if (!isExists) {
						callback(new Error("LoRA保存目录不存在"));
						return;
					}
					return callback();
				} catch (error) {
					return callback(new Error((error as Error).message));
				}
			}
		},
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (value.startsWith(env.VITE_APP_LORA_OUTPUT_PARENT_PATH)) return callback();
				callback(new Error(`LoRA保存目录必须以${env.VITE_APP_LORA_OUTPUT_PARENT_PATH}开头`));
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
				callback();
			},
			trigger: "change"
		}
	],
	"config.sample_prompts": [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const { sample_at_first, sample_every_n_epochs, sample_every_n_steps } =
					ruleForm.value.config;
				// 如果配置了采样选项，则提示必须输入采样提示
				const isLength = value.trim().length > 0;
				const isValidLength =
					sample_at_first ||
					(sample_every_n_epochs && sample_every_n_epochs > 0) ||
					(sample_every_n_steps && sample_every_n_steps > 0);
				if (isValidLength && !isLength) {
					return callback(new Error("请输入采样提示"));
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
				checkDirectory(value).then((exists) => {
					if (!exists) {
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
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				checkDirectory(value).then((exists) => {
					if (!exists) {
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
							const prev = value[index - 1].value ?? 0;
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

/** toml */
const toml = ref("");
const generateToml = useDebounceFn(() => {
	toml.value = tomlStringify(ruleForm.value);
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });

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
		const valid = await new WanValidate().validate({
			form: ruleFormRef.value,
			formData: ruleForm.value
		});
		if (!valid) {
			submitLoading.value = false;
			return;
		}

		// 开始训练
		const data: StartWanVideoTrainingData = wanHelper.formatData(ruleForm.value);
		const { task_id } = await startWanVideoTraining(data);
		// // 监听训练数据
		startQueryWanTask(task_id);

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		stopQueryWanTask();

		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

/** 查看采样 */
function onViewSampling() {
	modalManagerStore.setViewSamplingDrawerModal({
		open: true,
		filePath: monitorWanLoraData.value.data.samplingPath
	});
}

// 组件生命周期
onMounted(() => {
	resumeQueryWanTask();
	// 恢复表单数据
	recoveryTaskFormData({
		enableTrainingTaskDataRecovery: settingsStore.trainerSettings.enableTrainingTaskDataRecovery,
		isListen: monitorWanLoraData.value.isListen,
		taskId: queryWanTaskInfo.value.taskId,
		formData: ruleForm.value
	});
});
onUnmounted(() => {
	pauseQueryWanTask();
});
</script>

<style lang="scss" scoped>
.wan-page {
	height: $zl-view-footer-bar-height;
}
</style>
