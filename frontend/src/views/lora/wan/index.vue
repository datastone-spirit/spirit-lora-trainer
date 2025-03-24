<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 08:58:25
 * @LastEditTime: 2025-03-24 16:24:52
 * @LastEditors: mulingyuer
 * @Description: wan模型训练页面
 * @FilePath: \frontend\src\views\lora\wan\index.vue
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
					<Collapse v-model="openStep2" title="第2步：训练用的数据">
						<Dataset
							v-if="!isT2V"
							v-model:dataset-path="ruleForm.image_dir"
							dataset-path-prop="image_dir"
							dataset-path-popover-content="image_dir"
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
							v-if="!isT2V"
							:tagger-model="ruleForm.tagger_model"
							v-model:advanced="ruleForm.tagger_advanced_settings"
							v-model:tagger-prompt="ruleForm.tagger_global_prompt"
							tagger-prompt-prop="tagger_global_prompt"
							tagger-prompt-popover-content="tagger_global_prompt"
							v-model:tagger-append-file="ruleForm.tagger_is_append"
							tagger-append-file-prop="tagger_is_append"
							tagger-append-file-popover-content="tagger_is_append"
						/>
						<T2VOptions v-if="isT2V" v-model:form="ruleForm" />
						<TrainingData v-model:form="ruleForm" />
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
				<SplitRightPanel :toml="toml" :dir="ruleForm.image_dir" />
			</template>
		</TwoSplit>
		<FooterButtonGroup
			left-to="#footer-bar-left"
			:getExportConfig="onExportConfig"
			export-config-prefix="wan"
			@load-config="onLoadConfig"
			@reset-data="onResetData"
			right-to="#footer-bar-center"
			:submit-loading="submitLoading"
			@submit="onSubmit"
		>
			<!-- <template #right-btn-group>
				<el-button
					v-if="monitorFluxLoraData.data.showSampling"
					size="large"
					@click="onViewSampling"
				>
					查看采样
				</el-button>
			</template> -->
		</FooterButtonGroup>
		<SavePathWarningDialog v-model="openSavePathWarningDialog" />
	</div>
</template>

<script setup lang="ts">
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import type { RuleForm } from "./types";
import type { FormInstance, FormRules } from "element-plus";
import { tomlStringify } from "@/utils/toml";
import { useSettingsStore, useTrainingStore } from "@/stores";
import BasicInfo from "./components/BasicInfo.vue";
import { useTag } from "@/hooks/useTag/index";
const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { monitorTagData, tag, startQueryTagTask, stopQueryTagTask } = useTag();
import TrainingData from "./components/TrainingData.vue";
import T2VOptions from "./components/T2VOptions.vue";
import ModelParameters from "./components/ModelParameters.vue";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import { checkDirectory, checkHYData } from "@/utils/lora.helper";
import { getEnv } from "@/utils/env";

const env = getEnv();
/** 是否开启小白校验 */
const isWhiteCheck = import.meta.env.VITE_APP_WHITE_CHECK === "true";
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_wan_form`;
const defaultForm = readonly<RuleForm>({
	output_name: "",
	class_tokens: "",
	// -----
	image_dir: "/root",
	tagger_model: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	output_trigger_words: true,
	tagger_advanced_settings: false,
	tagger_global_prompt: "",
	tagger_is_append: false,
	task: "i2v_14B",
	dit: "",
	sdpa: true,
	mixed_precision: "bf16",
	fp8_base: true,
	fp8_scaled: false,
	t5_model: "",
	fp8_t5: false,
	t5_checkpoint: "",
	t5_tokenizer: "google/umt5-xxl",
	vae: "",
	vae_checkpoint: "",
	vae_stride: "(4, 8, 8)",
	optimizer_type: "adamw8bit",
	learning_rate: "2e-4",
	gradient_checkpointing: true,
	network_dim: 32,
	save_merged_model: "",
	discrete_flow_shift: 3,
	text_len: 512,
	epoch: 1,
	save_every_n_epochs: 16,
	guidance_scale: 1,
	timestep_sampling: "shift",
	sigmoid_scale: 1,
	weighting_scheme: "none",
	logit_mean: 0,
	logit_std: 1,
	mode_scale: 1.29,
	min_timestep: 0,
	max_timestep: 1000,
	output_dir: "",
	save_state: true,
	resume: "",
	num_train_timesteps: 1000,
	sample_fps: 16,
	sample_neg_prompt:
		"色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走",
	clip: "",
	clip_checkpoint: "",
	clip_tokenizer: "xlm-roberta-large",
	patch_size: "1, 2, 2",
	dim: 5120,
	ffn_dim: 13824,
	num_heads: 40,
	num_layers: 40,
	window_size: "-1, -1",
	qk_norm: true,
	cross_attn_norm: true,
	resolution_width: 720,
	resolution_height: 1280,
	batch_size: 1,
	enable_bucket: true,
	bucket_no_upscale: false,
	cache_directory: "",
	target_frames: "[1]",
	frame_extraction: "head",
	num_repeats: 2,
	image_jsonl_file_image_path: "",
	image_jsonl_file_caption: ""
});
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(toRaw(defaultForm)));
const rules = reactive<FormRules<RuleForm>>({
	class_tokens: [{ required: true, message: "请输入触发词", trigger: "blur" }],
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
	image_dir: [
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
	]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** 是否已经恢复训练配置 */
const isRestored = ref(false);
/** lora保存警告弹窗 */
const openSavePathWarningDialog = ref(false);
/** 是否是T2V训练 */
const isT2V = computed(() => ruleForm.value.task === "t2v_14B");

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

/** 导入配置 */
function onLoadConfig(toml: RuleForm) {
	try {
		// mergeDataToForm(toml, ruleForm.value);
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

/** 打标 */
const taggerBtnLoading = ref(false);
async function onTaggerClick() {
	try {
		taggerBtnLoading.value = true;

		const tagResult = await tag({
			tagDir: ruleForm.value.image_dir,
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

		console.log("打标任务创建失败", error);
	}
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

/** 提交表单 */
const submitLoading = ref(false);
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		// const valid = await validateForm({
		// 	formRef: ruleFormRef,
		// 	formData: ruleForm,
		// 	trainingStore: trainingStore,
		// 	openSavePathWarningDialog: openSavePathWarningDialog
		// });
		// if (!valid) {
		// 	submitLoading.value = false;
		// 	return;
		// }

		// // 开始训练
		// const data: StartFluxTrainingData = formatFormData(ruleForm.value);
		// const { task_id } = await startFluxTraining(data);
		// // 监听训练数据
		// startFluxLoraListen(task_id);

		submitLoading.value = false;
		// isRestored.value = true;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		// stopFluxLoraListen(true);
		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}
</script>

<style lang="scss" scoped>
.wan-page {
	height: $zl-view-footer-bar-height;
}
</style>
