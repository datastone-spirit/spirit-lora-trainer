<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 11:51:19
 * @LastEditTime: 2025-08-04 09:36:55
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
						<DataSet v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：LoRA 保存配置">
						<SaveConfig v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep4" title="第4步：训练配置">
						<TrainingConfig v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep5" title="第5步：采样配置">
						<SampleConfig v-model:form="ruleForm" :form-instance="ruleFormRef" />
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
			@import-config="onImportConfig"
		>
			<template #monitor-progress-bar>
				<FluxKontextLoRATrainingMonitor />
			</template>
			<template #right-btn-group>
				<el-button
					v-if="trainingStore.trainingFluxKontextLoRAData.data.showSampling"
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
import { startFluxKontextTraining, type StartFluxKontextTrainingData } from "@/api/lora";
import { useFluxKontextLora } from "@/hooks/task/useFluxKontextLora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import { ViewSamplingDrawerModal } from "@/utils/modal-manager";
import { tomlStringify } from "@/utils/toml";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import DataSet from "./components/DataSet/index.vue";
import FluxKontextLoRATrainingMonitor from "./components/FluxKontextLoRATrainingMonitor/index.vue";
import SampleConfig from "./components/SampleConfig/index.vue";
import SaveConfig from "./components/SaveConfig/index.vue";
import TrainingConfig from "./components/TrainingConfig/index.vue";
import { formatFormData, generateDefaultDataset } from "./flex-kontext.helper";
import { validate } from "./flux-kontext.validate";
import type { RuleForm } from "./types";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { fluxKontextLoraMonitor } = useFluxKontextLora();

const env = getEnv();
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}flux_kontext_form`;
const defaultForm: RuleForm = {
	type: "sd_trainer",
	training_folder: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
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
		disable_sampling: true,
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
	activeDatasetId: "",
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
const rules = reactive<FormRules<RuleForm>>({
	name: [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	trigger_word: [{ required: true, message: "请输入触发词", trigger: "blur" }],
	training_folder: [
		{ required: true, message: "请选择LoRA保存路径", trigger: "blur" },
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
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
	"sample.prompts": [
		{
			validator: (_rule: any, value: string[], callback: (error?: string | Error) => void) => {
				const disable = ruleForm.value.train.disable_sampling;

				if (!disable && value.length === 0) {
					callback(new Error("请至少添加一个采样提示"));
					return;
				}

				callback();
			}
		}
	]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
const dir = computed(() => {
	const datasets = ruleForm.value.datasets;
	const activeDatasetId = ruleForm.value.activeDatasetId;
	const findItem = datasets.find((item) => item.id === activeDatasetId);
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

// 导入配置
function onImportConfig() {
	const datasets = ruleForm.value.datasets;
	if (datasets.length > 0) {
		ruleForm.value.activeDatasetId = datasets[0].id;
	} else {
		ruleForm.value.activeDatasetId = "";
	}
}

// 重置表单
function onResetData() {
	if (ruleFormRef.value) ruleFormRef.value.resetFields();
	ruleForm.value = structuredClone(defaultForm);
	ruleForm.value.activeDatasetId = ruleForm.value.datasets[0]?.id ?? "";
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
		const data: StartFluxKontextTrainingData = formatFormData(toRaw(ruleForm.value));
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
	ViewSamplingDrawerModal.show({
		filePath: trainingStore.trainingFluxKontextLoRAData.data.samplingPath
	});
}

// 组件生命周期
onMounted(() => {
	// 监听如果成功恢复，任务信息会被更新
	fluxKontextLoraMonitor.resume();
	// 恢复表单数据（前提是任务信息存在）
	LoRAHelper.recoveryTaskFormData({ formData: ruleForm.value });
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
