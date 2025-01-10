<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 09:23:30
 * @LastEditTime: 2025-01-10 10:29:23
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
	</div>
</template>

<script setup lang="ts">
import { startHyVideoTraining, type StartHyVideoTrainingData } from "@/api/lora";
import { batchTag } from "@/api/tag";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useTag } from "@/hooks/useTag";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { checkData, checkDirectory } from "@/utils/lora.helper";
import { tomlStringify } from "@/utils/toml";
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
const { startTagListen, stopTagListen, monitorTagData } = useTag();

const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_hunyuan_video_form`;
const defaultForm = readonly<RuleForm>({
	output_name: "",
	class_tokens: "",
	model_transformer_path: "",
	model_vae_path: "",
	model_llm_path: "",
	model_clip_path: "",
	model_dtype: "bfloat16",
	model_transformer_dtype: "float8",
	model_timestep_sample_method: "logit_normal",
	output_dir: "/root",
	directory_path: "/root",
	directory_num_repeats: 10,
	tagger_model: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	output_trigger_words: true,
	resolution_width: 512,
	resolution_height: 512,
	enable_ar_bucket: true,
	min_ar: 0.5,
	max_ar: 2.0,
	num_ar_buckets: 7,
	frame_buckets: "1, 33, 65",
	epochs: 1000,
	micro_batch_size_per_gpu: 1,
	pipeline_stages: 1,
	gradient_accumulation_steps: 4,
	gradient_clipping: 1.0,
	warmup_steps: 100,
	eval_every_n_epochs: 1,
	eval_before_first_step: true,
	eval_micro_batch_size_per_gpu: 1,
	eval_gradient_accumulation_steps: 1,
	save_every_n_epochs: 2,
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
	output_name: [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	class_tokens: [{ required: true, message: "请输入触发词", trigger: "blur" }],
	output_dir: [
		{ required: true, message: "请选择LoRA保存路径", trigger: "blur" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				checkDirectory(value).then((exists) => {
					if (!exists) {
						callback(new Error("目录不存在"));
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
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				checkDirectory(value).then((exists) => {
					if (!exists) {
						callback(new Error("目录不存在"));
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
		const { directory_path, tagger_model, output_trigger_words, class_tokens } = ruleForm.value;
		// 校验
		const validations = [
			{
				condition: () => trainingStore.useGPU,
				message: "GPU已经被占用，请等待对应任务完成再执行打标"
			},
			{
				condition: () => typeof directory_path !== "string" || directory_path.trim() === "",
				message: "请先选择训练用的数据集目录"
			},
			{
				condition: async () => !(await checkDirectory(directory_path)),
				message: "数据集目录不存在"
			},
			{
				condition: () => typeof tagger_model !== "string" || tagger_model.trim() === "",
				message: "请先选择打标模型"
			},
			{
				condition: () => output_trigger_words && class_tokens.trim() === "",
				message: "请填写触发词"
			}
		];

		for (const validation of validations) {
			if (await validation.condition()) {
				taggerBtnLoading.value = false;
				ElMessage({
					message: validation.message,
					type: "error"
				});
				return;
			}
		}

		// api
		const result = await batchTag({
			image_path: directory_path,
			model_name: tagger_model,
			class_token: output_trigger_words ? class_tokens : undefined,
			prompt_type: ruleForm.value.prompt_type
		});
		startTagListen(result.task_id);
		taggerBtnLoading.value = false;

		ElMessage({
			message: "正在打标...",
			type: "success"
		});
	} catch (error) {
		taggerBtnLoading.value = false;
		stopTagListen(true);
		console.error("打标任务创建失败", error);
	}
}

/** 提交表单 */
const submitLoading = ref(false);
function validateForm() {
	return new Promise((resolve) => {
		if (!ruleFormRef.value) return resolve(false);
		ruleFormRef.value.validate(async (valid) => {
			if (!valid) {
				ElMessage.warning("请填写必填项");
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
				ElMessage.error("数据集目录下没有数据");
				return resolve(false);
			}

			return resolve(true);
		});
	});
}
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		const valid = await validateForm();
		if (!valid) {
			submitLoading.value = false;
			return;
		}

		// // 开始训练
		const data: StartHyVideoTrainingData = formatFormData(ruleForm.value);
		const { task_id } = await startHyVideoTraining(data);
		console.log("🚀 ~ onSubmit ~ task_id:", task_id);
		// // 监听训练数据
		// startLoraListen(task_id);

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		// stopLoraListen();

		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

onMounted(() => {
	// 组件挂载时，开始监听
	// if (!isLoraTaskEnd()) {
	// 	startLoraListen();
	// }
});
onUnmounted(() => {
	// 组件销毁时，停止监听
	// stopLoraListen();
});
</script>

<style lang="scss" scoped>
.hunyuan-video {
	height: $zl-view-footer-bar-height;
}
</style>
