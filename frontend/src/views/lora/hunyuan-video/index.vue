<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 09:23:30
 * @LastEditTime: 2025-03-21 09:46:36
 * @LastEditors: mulingyuer
 * @Description: 混元视频
 * @FilePath: \frontend\src\views\lora\hunyuan-video\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="hunyuan-video">
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
						<BasicInfo :form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep2" title="第2步：训练用的数据">
						<Dataset
							v-model:dataset-path="ruleForm.directory_path"
							dataset-path-prop="directory_path"
							dataset-path-popover-content="directory_path"
							v-model:tagger-model="ruleForm.tagger_model"
							tagger-model-prop="tagger_model"
							tagger-model-popover-content="tagger_model"
							v-model:joy-caption-prompt-type="ruleForm.prompt_type"
							joy-caption-prop="prompt_type"
							joy-caption-popover-content="prompt_type"
							v-model:output-trigger-words="ruleForm.output_trigger_words"
							output-trigger-words-prop="output_trigger_words"
							output-trigger-words-popover-content="output_trigger_words"
							:tagger-btn-loading="taggerBtnLoading || monitorTagData.isListen"
							@tagger-click="onTaggerClick"
						/>
						<DatasetAdvanced
							:tagger-model="ruleForm.tagger_model"
							v-model:advanced="ruleForm.tagger_advanced_settings"
							v-model:tagger-prompt="ruleForm.tagger_global_prompt"
							tagger-prompt-prop="tagger_global_prompt"
							tagger-prompt-popover-content="tagger_global_prompt"
							v-model:tagger-append-file="ruleForm.tagger_is_append"
							tagger-append-file-prop="tagger_is_append"
							tagger-append-file-popover-content="tagger_is_append"
						/>
						<TrainingData :form="ruleForm" />
					</Collapse>
					<Collapse v-show="isExpert" v-model="openStep3" title="模型参数调教">
						<ModelParameters v-model:form="ruleForm" />
					</Collapse>
					<SimpleCollapse v-show="isExpert" v-model="openStep4" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="ruleForm.directory_path" />
			</template>
		</TwoSplit>
		<FooterButtonGroup
			left-to="#footer-bar-left"
			:getExportConfig="onExportConfig"
			export-config-prefix="hunyuan-video"
			@load-config="onLoadConfig"
			@reset-data="onResetData"
			right-to="#footer-bar-center"
			:submit-loading="submitLoading"
			@submit="onSubmit"
		></FooterButtonGroup>
		<SavePathWarningDialog v-model="openSavePathWarningDialog" />
	</div>
</template>

<script setup lang="ts">
import { startHyVideoTraining, type StartHyVideoTrainingData } from "@/api/lora";
import type { HyVideoTrainingInfoResult } from "@/api/monitor";
import SavePathWarningDialog from "@/components/Dialog/SavePathWarningDialog.vue";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useHYLora } from "@/hooks/useHYLora";
import { useTag } from "@/hooks/useTag";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { checkData, checkDirectory, checkHYData } from "@/utils/lora.helper";
import { tomlParse, tomlStringify } from "@/utils/toml";
import { formatFormValidateMessage } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import { formatFormData, mergeDataToForm } from "./hunyuan.helper";
import type { RuleForm } from "./types";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { monitorTagData, tag, startQueryTagTask, stopQueryTagTask } = useTag();
const { startHYLoraListen, stopHYLoraListen } = useHYLora({
	isFirstGetConfig: true,
	firstGetConfigCallback: firstResetFormConfig
});

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
	directory_path: "/root",
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
/** 是否已经恢复训练配置 */
const isRestored = ref(false);
/** lora保存警告弹窗 */
const openSavePathWarningDialog = ref(false);

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

/** 导入配置 */
function onLoadConfig(toml: RuleForm) {
	try {
		mergeDataToForm(toml, ruleForm.value);
		ElMessage.success("配置导入成功");
	} catch (error) {
		ElMessage.error((error as Error)?.message ?? "配置导入失败");
		console.error(error);
	}
}
/** 导出配置 */
function onExportConfig() {
	return ruleForm.value;
}

/** 重置表单 */
function onResetData() {
	// 重置数据
	ruleForm.value = structuredClone(toRaw(defaultForm) as RuleForm);
	// 重置表单
	if (ruleFormRef.value) {
		ruleFormRef.value.resetFields();
	}

	ElMessage.success("重置成功");
}

/** 打标 */
const taggerBtnLoading = ref(false);
async function onTaggerClick() {
	try {
		taggerBtnLoading.value = true;

		const tagResult = await tag({
			tagDir: ruleForm.value.directory_path,
			tagModel: ruleForm.value.tagger_model,
			joyCaptionPromptType: ruleForm.value.prompt_type,
			isAddGlobalPrompt: ruleForm.value.output_trigger_words,
			globalPrompt: ruleForm.value.class_tokens,
			tagPrompt: ruleForm.value.tagger_global_prompt,
			isAppend: ruleForm.value.tagger_is_append,
			showTaskStartPrompt: true
		});

		// 触发查询打标任务
		startQueryTagTask(tagResult.task_id);
		taggerBtnLoading.value = false;
	} catch (error) {
		taggerBtnLoading.value = false;
		stopQueryTagTask();

		console.error("打标任务创建失败", error);
	}
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
		startHYLoraListen(task_id);

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控训练数据
		stopHYLoraListen(true);

		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

/** 如果存在运行的任务，则在每次第一次更新任务时恢复表单配置为训练时的配置 */
function firstResetFormConfig(taskData: HyVideoTrainingInfoResult) {
	if (!taskData.frontend_config || isRestored.value) return;
	isRestored.value = true;
	const tomlData = tomlParse(taskData.frontend_config);
	mergeDataToForm(tomlData, ruleForm.value);
	ElMessage.success("训练配置已恢复");
}

/** lora保存目录非/root确认弹窗 */
function confirmLoRASaveDir() {
	if (!isWhiteCheck) return true;
	if (ruleForm.value.output_dir.startsWith(env.VITE_APP_LORA_OUTPUT_PARENT_PATH)) return true;
	openSavePathWarningDialog.value = true;
	return false;
}
</script>

<style lang="scss" scoped>
.hunyuan-video {
	height: $zl-view-footer-bar-height;
}
</style>
