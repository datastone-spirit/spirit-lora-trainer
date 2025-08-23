<!--
 * @Author: mulingyuer
 * @Date: 2025-08-12 15:51:13
 * @LastEditTime: 2025-08-22 14:31:16
 * @LastEditors: mulingyuer
 * @Description: qwen-image 模型训练页面
 * @FilePath: \frontend\src\views\lora\qwen-image\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="qwen-image-page">
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
						<DataSet v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：训练流程控制">
						<TrainingConfig v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep4" title="第4步：优化器和学习率配置">
						<OptimizerLearning v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep5" title="第5步：采样和推理配置">
						<SampleConfig v-model:form="ruleForm" />
					</Collapse>
					<MultiGpuConfig v-model:open="openStep6" v-model:form="ruleForm" />
					<SimpleCollapse v-show="isExpert" v-model="openStep7" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="dir" />
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
				<QwenImageTrainingLoRAMonitor />
			</template>
			<template #right-btn-group>
				<el-button
					v-if="trainingStore.trainingQwenImageLoRAData.data.showSampling"
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
import { startQwenImageTraining, type StartQwenImageTrainingData } from "@/api/lora";
import { useQwenImageLora } from "@/hooks/task/useQwenImage";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import { ViewSamplingDrawerModal } from "@/utils/modal-manager";
import { tomlStringify } from "@/utils/toml";
import { joinPrefixKey } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import DataSet from "./components/DataSet/index.vue";
import MultiGpuConfig from "./components/MultiGpuConfig/index.vue";
import OptimizerLearning from "./components/OptimizerLearning/index.vue";
import QwenImageTrainingLoRAMonitor from "./components/QwenImageTrainingLoRAMonitor/index.vue";
import SampleConfig from "./components/SampleConfig/index.vue";
import TrainingConfig from "./components/TrainingConfig/index.vue";
import {
	formatFormData,
	generateDefaultDataset,
	generateDefaultDatasetGeneral
} from "./qwen-image.helper";
import { validate } from "./qwen-image.validate";
import type { DatasetItem, RuleForm } from "./types";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { qwenImageLoraMonitor } = useQwenImageLora();

const env = getEnv();
const ruleFormRef = ref<FormInstance>();
const localStorageKey = joinPrefixKey("qwen_image_form");
const defaultDatasetGeneral = generateDefaultDatasetGeneral();
const defaultDatasetItem: DatasetItem = generateDefaultDataset({ general: defaultDatasetGeneral });
const defaultForm: RuleForm = {
	config: {
		output_name: "",
		dit: "",
		vae: "",
		vae_dtype: "bfloat16",
		text_encoder: "",
		output_dir: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
		seed: 42,
		max_train_steps: 1600,
		max_train_epochs: 16,
		mixed_precision: "bf16",
		save_state: true,
		save_every_n_steps: undefined,
		save_every_n_epochs: 4,
		save_last_n_epochs: undefined,
		save_last_n_epochs_state: undefined,
		save_last_n_steps: undefined,
		save_last_n_steps_state: undefined,
		save_state_on_train_end: false,
		resume: "",
		optimizer_type: "adamw8bit",
		optimizer_args: "",
		learning_rate: 0.0001,
		lr_scheduler: "constant",
		lr_warmup_steps: 0,
		lr_decay_steps: 0,
		lr_scheduler_args: "",
		lr_scheduler_min_lr_ratio: undefined,
		lr_scheduler_num_cycles: 1,
		lr_scheduler_power: 1,
		lr_scheduler_timescale: undefined,
		lr_scheduler_type: "",
		network_dim: 32,
		network_alpha: 1,
		network_dropout: undefined,
		network_args: "",
		network_weights: "",
		base_weights: "",
		base_weights_multiplier: undefined,
		timestep_sampling: "shift",
		sigmoid_scale: 1,
		min_timestep: 0,
		max_timestep: undefined,
		mode_scale: 1.29,
		discrete_flow_shift: 3,
		weighting_scheme: "none",
		sample_at_first: false,
		sample_every_n_epochs: undefined,
		sample_every_n_steps: undefined,
		sample_prompts: "",
		guidance_scale: undefined,
		scale_weight_norms: undefined,
		max_grad_norm: 1,
		gradient_checkpointing: true,
		sdpa: true,
		sage_attn: false,
		xformers: true,
		split_attn: true,
		flash3: false,
		flash_attn: false,
		fp8_base: true,
		fp8_scaled: false,
		fp8_vl: true,
		max_data_loader_n_workers: 8,
		persistent_data_loader_workers: false,
		blocks_to_swap: 16,
		img_in_txt_in_offloading: false,
		ddp_gradient_as_bucket_view: false,
		ddp_static_graph: false,
		ddp_timeout: undefined
	},
	dataset: {
		general: defaultDatasetGeneral,
		datasets: [defaultDatasetItem]
	},
	activeDatasetId: defaultDatasetItem.id,
	multi_gpu_config: {
		multi_gpu_enabled: false,
		num_gpus: 0,
		gpu_ids: [],
		distributed_backend: "nccl",
		auto_gpu_selection: true,
		memory_requirement_mb: 23552,
		gradient_sync_every_n_steps: 1,
		gradient_accumulation_steps: 4
	},
	skip_cache_latent: false,
	skip_cache_text_encoder_latent: false,
	tagConfig: {
		tagger_model: "joy-caption-alpha-two",
		joy_caption_prompt_type: "Training Prompt",
		is_add_global_prompt: false,
		global_prompt: "",
		tagger_advanced_settings: false,
		tagger_global_prompt: "",
		tagger_is_append: false
	}
};
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(toRaw(defaultForm)));
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
				if (settingsStore.whiteCheck && !value) {
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
				if (settingsStore.whiteCheck && value !== "adamw8bit") {
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
				if (typeof value !== "number" || value <= 0) return callback();
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
				if ((isValidLength && !isLength) || sample_at_first) {
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
				if (settingsStore.whiteCheck && (typeof value !== "number" || value < 16)) {
					return callback(new Error("视频训练时，blocks_to_swap必须大于或等于16"));
				}
				callback();
			},
			trigger: "change"
		}
	]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
const dir = computed(() => {
	const datasets = ruleForm.value.dataset.datasets;
	const activeDatasetId = ruleForm.value.activeDatasetId;
	const findItem = datasets.find((item) => item.id === activeDatasetId);
	if (!findItem) return "";
	return findItem.image_directory;
});

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
const openStep5 = ref(true);
const openStep6 = ref(true);
const openStep7 = ref(true);

/** toml */
const toml = ref("");
const generateToml = useDebounceFn(() => {
	toml.value = tomlStringify(ruleForm.value);
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });

// 重置表单
function onResetData() {
	if (ruleFormRef.value) ruleFormRef.value.resetFields();
	ruleForm.value = structuredClone(defaultForm);
}

// 提交表单
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
		const data: StartQwenImageTrainingData = formatFormData(toRaw(ruleForm.value));
		const { task_id } = await startQwenImageTraining(data);
		// 监听训练数据
		qwenImageLoraMonitor.setTaskId(task_id).start();
		submitLoading.value = false;
		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		qwenImageLoraMonitor.stop();
		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

/** 查看采样 */
function onViewSampling() {
	ViewSamplingDrawerModal.show({
		filePath: trainingStore.trainingQwenImageLoRAData.data.samplingPath
	});
}

// 组件生命周期
onMounted(() => {
	// 监听如果成功恢复，任务信息会被更新
	qwenImageLoraMonitor.resume();
	// 恢复表单数据（前提是任务信息存在）
	LoRAHelper.recoveryTaskFormData({ formData: ruleForm.value });
});
onUnmounted(() => {
	qwenImageLoraMonitor.pause();
});
</script>

<style lang="scss" scoped>
.qwen-image-page {
	height: $zl-view-footer-bar-height;
}
</style>
