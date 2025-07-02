<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 09:23:30
 * @LastEditTime: 2025-07-02 17:21:17
 * @LastEditors: mulingyuer
 * @Description: 混元视频
 * @FilePath: \frontend\src\views\lora\hunyuan-video\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="hunyuan-video">
		<TwoSplit2 local-key-prefix="lora-hunyuan-video">
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
			:submit-loading="submitLoading"
			@reset-data="onResetData"
			@submit="onSubmit"
		>
			<template #monitor-progress-bar>
				<HYTrainingMonitor />
			</template>
		</TeleportFooterBarContent>
	</div>
</template>

<script setup lang="ts">
import { startHyVideoTraining, type StartHyVideoTrainingData } from "@/api/lora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useHYLora } from "@/hooks/task/useHYLora";
import { useModalManagerStore, useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { checkData, checkDirectory, checkHYData, recoveryTaskFormData } from "@/utils/lora.helper";
import { tomlStringify } from "@/utils/toml";
import { formatFormValidateMessage } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import { formatFormData } from "./hunyuan.helper";
import type { RuleForm } from "./types";
import HYDataset from "./components/HYDataset/index.vue";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const modelManagerStore = useModalManagerStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { monitorHYLoraData, hyLoraMonitor } = useHYLora();

const env = getEnv();
/** 是否开启小白校验 */
const isWhiteCheck = import.meta.env.VITE_APP_WHITE_CHECK === "true";
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_hunyuan_video_form`;
const defaultForm = readonly<RuleForm>({
	class_tokens: "",
	model_transformer_path: "",
	model_vae_path: "",
	model_llm_path: "",
	model_clip_path: "",
	model_dtype: "bfloat16",
	model_transformer_dtype: "float8",
	model_timestep_sample_method: "logit_normal",
	output_dir: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
	directory_path: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
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
const ruleForm = useEnhancedLocalStorage<RuleForm>(
	localStorageKey,
	structuredClone(toRaw(defaultForm) as RuleForm)
);
const rules = reactive<FormRules<RuleForm>>({
	class_tokens: [{ required: true, message: "请输入触发词", trigger: "blur" }],
	// model_transformer_path: [{ required: true, message: "请选择训练用的底模", trigger: "change" }],
	output_dir: [
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
					const isDataExists = await checkHYData(value);
					if (isDataExists) {
						callback(new Error("LoRA保存目录已存在数据，请提供空目录"));
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
	directory_path: [
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
function validateForm() {
	return new Promise((resolve) => {
		if (!ruleFormRef.value) return resolve(false);
		ruleFormRef.value.validate(async (valid, invalidFields) => {
			if (!valid) {
				let message = "请填写必填项";
				if (invalidFields) {
					message = formatFormValidateMessage(invalidFields);
				}
				ElMessage({
					type: "warning",
					customClass: "break-line-message",
					message
				});
				return resolve(false);
			}

			// gpu被占用
			if (trainingStore.useGPU) {
				ElMessage.warning("GPU已经被占用，请等待对应任务完成再执行训练");
				return resolve(false);
			}

			// 校验数据集是否有数据
			const isHasData = await checkData(ruleForm.value.directory_path);
			if (!isHasData) {
				ElMessage.error("数据集目录下没有数据，请上传训练用的素材");
				return resolve(false);
			}

			// 检测lora保存目录是否是/root下的
			if (isWhiteCheck) {
				const isCheckLoRASaveDir = confirmLoRASaveDir();
				if (!isCheckLoRASaveDir) return resolve(false);
			}

			return resolve(true);
		});
	});
}
// 训练轮数epochs二次确认弹窗
function onEpochsConfirm() {
	return new Promise((resolve) => {
		const { epochs, save_every_n_epochs } = ruleForm.value;
		if (epochs % save_every_n_epochs !== 0) {
			ElMessageBox.confirm(
				"当前epochs训练轮数不是save_every_n_epochs的整数倍，会有训练轮次不会保存训练结果！是否继续训练?",
				"提示",
				{
					confirmButtonText: "继续训练",
					cancelButtonText: "取消",
					type: "warning"
				}
			)
				.then(() => {
					return resolve(true);
				})
				.catch(() => {
					return resolve(false);
				});
		} else {
			return resolve(true);
		}
	});
}
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		const valid = await validateForm();
		const isConfirm = await onEpochsConfirm();

		if (!valid || !isConfirm) {
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

/** lora保存目录非/root确认弹窗 */
function confirmLoRASaveDir() {
	if (!isWhiteCheck) return true;
	if (ruleForm.value.output_dir.startsWith(env.VITE_APP_LORA_OUTPUT_PARENT_PATH)) return true;
	// 展示警告弹窗
	modelManagerStore.setLoraSavePathWarningModal(true);
	return false;
}

// 组件生命周期
onMounted(() => {
	hyLoraMonitor.resume();
	// 恢复表单数据
	recoveryTaskFormData({
		enableTrainingTaskDataRecovery: settingsStore.trainerSettings.enableTrainingTaskDataRecovery,
		isListen: monitorHYLoraData.value.isListen,
		taskId: hyLoraMonitor.getTaskId(),
		formData: ruleForm.value
	});
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
