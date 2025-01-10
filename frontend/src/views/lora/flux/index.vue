<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:07
 * @LastEditTime: 2025-01-10 11:10:21
 * @LastEditors: mulingyuer
 * @Description: flux 模型训练页面
 * @FilePath: \frontend\src\views\lora\flux\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="lora-flux-page">
		<TwoSplit direction="horizontal" :sizes="[50, 50]" :minSize="[550, 380]">
			<template #left>
				<div class="lora-flux-content">
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
							<TrainingData v-model:form="ruleForm" />
						</Collapse>
						<Collapse v-model="openStep3" title="第3步：模型参数调教">
							<ModelParameters v-model:form="ruleForm" />
						</Collapse>
						<SimpleCollapse v-show="isExpert" v-model="openStep4" title="其它：高级设置">
							<AdvancedSettings v-model:form="ruleForm" />
						</SimpleCollapse>
					</el-form>
				</div>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="ruleForm.image_dir" />
			</template>
		</TwoSplit>
		<FooterButtonGroup
			left-to="#footer-bar-left"
			:getExportConfig="onExportConfig"
			export-config-prefix="flux"
			@load-config="onLoadConfig"
			@reset-data="onResetData"
			right-to="#footer-bar-center"
			:submit-loading="submitLoading"
			@submit="onSubmit"
		></FooterButtonGroup>
	</div>
</template>

<script setup lang="ts">
import { startFluxTraining } from "@/api/lora";
import type { StartFluxTrainingData } from "@/api/lora/types";
import { batchTag } from "@/api/tag";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useFluxLora } from "@/hooks/useFluxLora";
import { useTag } from "@/hooks/useTag";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { checkData, checkDirectory } from "@/utils/lora.helper";
import { tomlStringify } from "@/utils/toml";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import { formatFormData, mergeDataToForm } from "./flux.helper";
import type { RuleForm } from "./types";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { startTagListen, stopTagListen, monitorTagData } = useTag();
const { startFluxLoraListen, stopFluxLoraListen } = useFluxLora();
const { useEnhancedLocalStorage } = useEnhancedStorage();

const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_flux_form`;
const defaultForm = readonly<RuleForm>({
	output_name: "",
	class_tokens: "",
	clip_skip: 0,
	pretrained_model_name_or_path: "./models/unet/flux1-dev.safetensors",
	ae: "./models/vae/ae.safetensors",
	clip_l: "./models/clip/clip_l.safetensors",
	t5xxl: "./models/clip/t5xxl_fp16.safetensors",
	resume: "",
	output_dir: "/root",
	save_model_as: "safetensors",
	save_precision: "bf16",
	save_state: false,
	// -----
	image_dir: "/root",
	tagger_model: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	output_trigger_words: true,
	num_repeats: 16,
	max_train_epochs: 24,
	train_batch_size: 1,
	resolution_width: 1024,
	resolution_height: 1024,
	enable_bucket: false,
	min_bucket_reso: 256,
	max_bucket_reso: 1024,
	bucket_reso_steps: 64,
	bucket_no_upscale: false,
	// -----
	seed: 42,
	max_data_loader_n_workers: 2,
	learning_rate: "8e-4",
	save_every_n_epochs: 4,
	guidance_scale: 1,
	timestep_sampling: "shift",
	network_dim: 64,
	// -----
	sigmoid_scale: 1,
	model_prediction_type: "raw",
	discrete_flow_shift: 3.1582,
	loss_type: "l2",
	t5xxl_max_token_length: undefined,
	highvram: true,
	// -----
	gradient_checkpointing: true,
	gradient_accumulation_steps: 1,
	network_train_unet_only: false,
	network_train_text_encoder_only: false,
	output_config: true,
	// -----
	unet_lr: null,
	text_encoder_lr: "1e-4",
	lr_scheduler: "constant",
	lr_warmup_steps: 0,
	lr_scheduler_num_cycles: 0,
	optimizer_type: "adamw8bit",
	min_snr_gamma: undefined,
	optimizer_args: null,
	// -----
	network_module: "networks.lora_flux",
	network_weights: "",
	network_alpha: "1",
	network_dropout: 0,
	scale_weight_norms: undefined,
	network_args: null,
	enable_base_weight: false,
	base_weights: "",
	base_weights_multiplier: undefined,
	// -----
	enable_preview: false,
	// -----
	logging_dir: "./logs",
	// -----
	caption_extension: ".txt",
	shuffle_caption: false,
	weighted_captions: false,
	keep_tokens: 0,
	keep_tokens_separator: "",
	caption_dropout_rate: undefined,
	caption_dropout_every_n_epochs: undefined,
	caption_tag_dropout_rate: 0,
	// -----
	color_aug: false,
	flip_aug: false,
	random_crop: false,
	// -----
	// -----
	mixed_precision: "bf16",
	full_fp16: false,
	full_bf16: true,
	fp8_base: true,
	fp8_base_unet: false,
	no_half_vae: false,
	sdpa: true,
	lowram: false,
	cache_latents: true,
	cache_latents_to_disk: true,
	cache_text_encoder_outputs: true,
	cache_text_encoder_outputs_to_disk: true,
	persistent_data_loader_workers: true,
	vae_batch_size: undefined,
	// -----
	ddp_timeout: undefined,
	ddp_gradient_as_bucket_view: false
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
	image_dir: [
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
		const { image_dir, tagger_model, output_trigger_words, class_tokens } = ruleForm.value;
		// 校验
		const validations = [
			{
				condition: () => trainingStore.useGPU,
				message: "GPU已经被占用，请等待对应任务完成再执行打标"
			},
			{
				condition: () => typeof image_dir !== "string" || image_dir.trim() === "",
				message: "请先选择训练用的数据集目录"
			},
			{
				condition: async () => !(await checkDirectory(image_dir)),
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
			image_path: image_dir,
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

		console.log("打标任务创建失败", error);
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
			const isHasData = await checkData(ruleForm.value.image_dir);
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

		// 开始训练
		const data: StartFluxTrainingData = formatFormData(ruleForm.value);
		const { task_id } = await startFluxTraining(data);
		// 监听训练数据
		startFluxLoraListen(task_id);

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		stopFluxLoraListen(true);

		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}
</script>

<style lang="scss" scoped>
.lora-flux-page {
	height: $zl-view-footer-bar-height;
}
.flux-footer-bar {
	width: 100%;
	height: 100%;
	justify-content: flex-end;
}
</style>
