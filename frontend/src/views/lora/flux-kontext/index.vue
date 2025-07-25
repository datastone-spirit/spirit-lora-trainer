<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 11:51:19
 * @LastEditTime: 2025-07-25 08:50:39
 * @LastEditors: mulingyuer
 * @Description: flux kontext 训练
 * @FilePath: \frontend\src\views\lora\flux-kontext\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="flux-kontext-page">
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
						<DataSet v-model:form="ruleForm" v-model:active-tab-name="activeTabName" />
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：LoRA 保存配置">
						<SaveConfig v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep4" title="第4步：训练配置">
						<TrainingConfig v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep5" title="第5步：采样配置">
						<SampleConfig v-model:form="ruleForm" />
					</Collapse>
					<SimpleCollapse v-show="isExpert" v-model="openStep6" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="dir" />
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
				<FluxKontextLoraTrainingMonitor />
			</template>
			<template #right-btn-group>
				<el-button
					v-if="monitorFluxKontextLoraData.data.showSampling"
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
import type { FormInstance, FormRules } from "element-plus";
import { startFluxKontextTraining, type StartFluxKontextTrainingData } from "@/api/lora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useModalManagerStore, useSettingsStore, useTrainingStore } from "@/stores";
import { tomlStringify } from "@/utils/toml";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import DataSet from "./components/DataSet/index.vue";
import SampleConfig from "./components/SampleConfig/index.vue";
import SaveConfig from "./components/SaveConfig/index.vue";
import TrainingConfig from "./components/TrainingConfig/index.vue";
import type { RuleForm } from "./types";
import { formatFormData, generateDefaultDataset } from "./flex-kontext.helper";
import { checkDirectory, recoveryTaskFormData } from "@/utils/lora.helper";
import { getEnv } from "@/utils/env";
import { validateForm } from "./flux-kontext.validate";
import { useFluxKontextLora } from "@/hooks/task/useFluxKontextLora";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const modalManagerStore = useModalManagerStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { monitorFluxKontextLoraData, fluxKontextLoraMonitor } = useFluxKontextLora();

const env = getEnv();
/** 是否开启小白校验 */
const isWhiteCheck = import.meta.env.VITE_APP_WHITE_CHECK === "true";
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}flux_kontext_form`;
const defaultForm: RuleForm = {
	type: "sd_trainer",
	training_folder: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
	trigger_word: "",
	device: "cuda:0",
	network: {
		type: "lora",
		linear: 32,
		linear_alpha: 32
	},
	save: {
		dtype: "fp16",
		save_every: 250,
		max_step_saves_to_keep: 4,
		push_to_hub: false
	},
	train: {
		batch_size: 1,
		steps: 3000,
		gradient_accumulation_steps: 1,
		train_unet: true,
		train_text_encoder: false,
		gradient_checkpointing: true,
		noise_scheduler: "flowmatch",
		optimizer: "adamw8bit",
		timestep_type: "weighted",
		content_or_style: "balanced",
		optimizer_params: {
			weight_decay: 0.0001
		},
		unload_text_encoder: false,
		lr: 0.0001,
		ema_config: {
			use_ema: false,
			ema_decay: 0.99
		},
		skip_first_sample: false,
		disable_sampling: false,
		diff_output_preservation: false,
		diff_output_preservation_multiplier: 1,
		diff_output_preservation_class: "person",
		dtype: "bf16"
	},
	model: {
		arch: "flux_kontext",
		name_or_path: "",
		quantize: true,
		quantize_te: true
	},
	sample: {
		sampler: "flowmatch",
		sample_every: 250,
		width: 1024,
		height: 1024,
		seed: 42,
		walk_seed: true,
		guidance_scale: 4,
		sample_steps: 25,
		neg: "",
		prompts: []
	},
	datasets: [generateDefaultDataset(0)],
	name: "",
	tagConfig: {
		tagger_model: "joy-caption-alpha-two",
		joy_caption_prompt_type: "Training Prompt",
		is_add_global_prompt: false,
		tagger_advanced_settings: false,
		tagger_global_prompt: "",
		tagger_is_append: false
	}
};
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(toRaw(defaultForm)));
// const ruleForm = ref(structuredClone(defaultForm));
const rules = reactive<FormRules<RuleForm>>({
	name: [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	trigger_word: [{ required: true, message: "请输入触发词", trigger: "blur" }],
	training_folder: [
		{ required: true, message: "请选择LoRA保存路径", trigger: "blur" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				checkDirectory(value).then((exists) => {
					if (!exists) {
						callback(new Error("LoRA保存目录不存在"));
						return;
					}
					callback();
				});
			}
		},
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (value.startsWith(env.VITE_APP_LORA_OUTPUT_PARENT_PATH)) return callback();
				callback(new Error(`LoRA保存目录必须以${env.VITE_APP_LORA_OUTPUT_PARENT_PATH}开头`));
			}
		}
	]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
const activeTabName = ref(ruleForm.value.datasets[0].id);
const dir = computed(() => {
	const findItem = ruleForm.value.datasets.find((item) => item.id === activeTabName.value);
	if (!findItem) return "";
	return findItem.preview === "folder_path" ? findItem.folder_path : findItem.control_path;
});

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
const openStep5 = ref(true);
const openStep6 = ref(true);

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
	activeTabName.value = ruleForm.value.datasets[0].id;
}

// 提交表单
const submitLoading = ref(false);
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		const valid = await validateForm({
			formRef: ruleFormRef,
			formData: ruleForm,
			trainingStore: trainingStore
		});
		if (!valid) {
			submitLoading.value = false;
			return;
		}

		// 开始训练
		const data: StartFluxKontextTrainingData = formatFormData(ruleForm.value);
		const { task_id } = await startFluxKontextTraining(data);
		// // 监听训练数据
		fluxKontextLoraMonitor.setTaskId(task_id).start();

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		fluxKontextLoraMonitor.stop();
		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

/** 查看采样 */
function onViewSampling() {
	modalManagerStore.setViewSamplingDrawerModal({
		open: true,
		filePath: monitorFluxKontextLoraData.value.data.samplingPath
	});
}

// 组件生命周期
onMounted(() => {
	fluxKontextLoraMonitor.resume();
	// 恢复表单数据
	recoveryTaskFormData({
		enableTrainingTaskDataRecovery: settingsStore.trainerSettings.enableTrainingTaskDataRecovery,
		isListen: monitorFluxKontextLoraData.value.isListen,
		taskId: fluxKontextLoraMonitor.getTaskId(),
		formData: ruleForm.value
	});
});
onUnmounted(() => {
	fluxKontextLoraMonitor.pause();
});
</script>

<style lang="scss" scoped>
.flux-kontext-page {
	height: $zl-view-footer-bar-height;
}
</style>
