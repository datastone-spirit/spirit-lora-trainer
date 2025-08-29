<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 09:23:30
 * @LastEditTime: 2025-08-29 11:36:05
 * @LastEditors: mulingyuer
 * @Description: 混元视频
 * @FilePath: \frontend\src\views\lora\hunyuan-video\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="hunyuan-video">
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
						<BasicInfo :form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep2" title="第2步：AI数据集">
						<HYDataset v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：训练数据配置">
						<TrainingData :form="ruleForm" />
					</Collapse>
					<Collapse v-show="isExpert" v-model="openStep4" title="模型参数调教">
						<ModelParameters v-model:form="ruleForm" />
					</Collapse>
					<SimpleCollapse v-show="isExpert" v-model="openStep5" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="ruleForm.directory_path" />
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
				<HYTrainingLoRAMonitor />
			</template>
		</TeleportFooterBarContent>
	</div>
</template>

<script setup lang="ts">
import { startHyVideoTraining, type StartHyVideoTrainingData } from "@/api/lora";
import { useHYLora } from "@/hooks/task/useHYLora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useSettingsStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import { tomlStringify } from "@/utils/toml";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import HYDataset from "./components/HYDataset/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import { formatFormData } from "./hunyuan.helper";
import { isDirectoryEmpty, validate } from "./hunyuan.validate";
import type { RuleForm } from "./types";
import HYTrainingLoRAMonitor from "./components/HYTrainingLoRAMonitor/index.vue";
import FieldTooltipGuide from "./components/FieldTooltipGuide/index.vue";
import { joinPrefixKey } from "@/utils/tools";

const settingsStore = useSettingsStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { hyLoraMonitor } = useHYLora();

const env = getEnv();
const ruleFormRef = ref<FormInstance>();
const localStorageKey = joinPrefixKey("lora_hunyuan_video_form");
const defaultForm = readonly<RuleForm>({
	class_tokens: "",
	model_transformer_path: "",
	model_vae_path: "",
	model_llm_path: "",
	model_clip_path: "",
	model_dtype: "bfloat16",
	model_transformer_dtype: "float8",
	model_timestep_sample_method: "logit_normal",
	output_dir: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
	directory_path: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
	directory_num_repeats: 10,
	tagger_model: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	output_trigger_words: true,
	tagger_advanced_settings: false,
	tagger_global_prompt: "",
	tagger_is_append: false,
	resolution_width: 512,
	resolution_height: 512,
	enable_ar_bucket: true,
	min_ar: 0.5,
	max_ar: 2.0,
	num_ar_buckets: 7,
	frame_buckets: "1, 33, 65",
	epochs: 128,
	micro_batch_size_per_gpu: 1,
	pipeline_stages: 1,
	gradient_accumulation_steps: 4,
	gradient_clipping: 1.0,
	warmup_steps: 100,
	eval_every_n_epochs: 1,
	eval_before_first_step: true,
	eval_micro_batch_size_per_gpu: 1,
	eval_gradient_accumulation_steps: 1,
	save_every_n_epochs: 16,
	checkpoint_every_n_minutes: 120,
	activation_checkpointing: true,
	partition_method: "parameters",
	save_dtype: "bfloat16",
	caching_batch_size: 1,
	steps_per_print: 1,
	video_clip_mode: "single_middle",
	adapter_type: "lora",
	adapter_rank: 32,
	adapter_dtype: "bfloat16",
	adapter_init_from_existing: "",
	optimizer_type: "adamw_optimi",
	optimizer_lr: "2e-5",
	optimizer_betas: [0.9, 0.99],
	optimizer_weight_decay: 0.01,
	optimizer_eps: "1e-8"
});
const ruleForm = useEnhancedLocalStorage<RuleForm>({
	localKey: localStorageKey,
	defaultValue: structuredClone(toRaw(defaultForm) as RuleForm),
	version: "1.0.0"
});
const rules = reactive<FormRules<RuleForm>>({
	class_tokens: [{ required: true, message: "请输入触发词", trigger: "blur" }],
	// model_transformer_path: [{ required: true, message: "请选择训练用的底模", trigger: "change" }],
	output_dir: [
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
				isDirectoryEmpty({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("LoRA保存目录已存在数据，请提供空目录"));
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
	directory_path: [
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
	epochs: [
		{
			validator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				// 轮数必须大于或等于保存轮数
				const { save_every_n_epochs } = ruleForm.value;

				if (value <= 0) {
					return callback(new Error("epochs轮数必须是一个正整数"));
				}
				if (value < save_every_n_epochs) {
					return callback(new Error("epochs轮数必须大于或等于save_every_n_epochs"));
				}

				callback();
			},
			trigger: "change"
		}
	]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

/** toml */
const toml = ref("");
const generateToml = useDebounceFn(() => {
	toml.value = tomlStringify(ruleForm.value);
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });

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

		const { valid } = await validate({
			ruleForm: ruleForm.value,
			formInstance: ruleFormRef.value
		});
		if (!valid) {
			submitLoading.value = false;
			return;
		}

		// 开始训练
		const data: StartHyVideoTrainingData = formatFormData(ruleForm.value);
		const { task_id } = await startHyVideoTraining(data);
		// 监听训练数据
		hyLoraMonitor.setTaskId(task_id).start();

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控训练数据
		hyLoraMonitor.stop();

		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

// 组件生命周期
onMounted(() => {
	// 监听如果成功恢复，任务信息会被更新
	hyLoraMonitor.resume();
	// 恢复表单数据（前提是任务信息存在）
	LoRAHelper.recoveryTaskFormData({ formData: ruleForm.value });
});
onUnmounted(() => {
	hyLoraMonitor.pause();
});
</script>

<style lang="scss" scoped>
.hunyuan-video {
	height: $zl-view-footer-bar-height;
}
</style>
