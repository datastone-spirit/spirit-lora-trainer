<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:07
 * @LastEditTime: 2025-03-07 14:49:42
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
							<TrainingData v-model:form="ruleForm" />
						</Collapse>
						<Collapse v-model="openStep3" title="第3步：模型参数调教">
							<ModelParameters v-model:form="ruleForm" />
						</Collapse>
						<Collapse v-model="openStep3" title="第4步：训练采样">
							<TrainingSamples v-model:form="ruleForm" />
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
		>
			<template #right-btn-group>
				<el-button
					v-if="monitorFluxLoraData.data.showSampling"
					size="large"
					@click="onViewSampling"
				>
					查看采样
				</el-button>
			</template>
		</FooterButtonGroup>
		<ViewSampling v-model:open="openViewSampling" :sampling-path="samplingPath" />
		<SavePathWarningDialog v-model="openSavePathWarningDialog" />
	</div>
</template>

<script setup lang="ts">
import { startFluxTraining } from "@/api/lora";
import type { StartFluxTrainingData } from "@/api/lora/types";
import type { LoRATrainingInfoResult } from "@/api/monitor";
import { batchTag } from "@/api/tag";
import SavePathWarningDialog from "@/components/Dialog/SavePathWarningDialog.vue";
import ViewSampling from "@/components/ViewSampling/index.vue";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useFluxLora } from "@/hooks/useFluxLora";
import { useTag } from "@/hooks/useTag";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { checkDirectory } from "@/utils/lora.helper";
import { tomlParse, tomlStringify } from "@/utils/toml";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import TrainingSamples from "./components/TrainingSamples/index.vue";
import { formatFormData, mergeDataToForm } from "./flux.helper";
import { validateForm } from "./flux.validate";
import type { RuleForm } from "./types";
import { getEnv } from "@/utils/env";

const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { startTagListen, stopTagListen, monitorTagData } = useTag();
const { startFluxLoraListen, stopFluxLoraListen, monitorFluxLoraData } = useFluxLora({
	isFirstGetConfig: true,
	firstGetConfigCallback: firstResetFormConfig
});
const { useEnhancedLocalStorage } = useEnhancedStorage();

const env = getEnv();
/** 是否开启小白校验 */
const isWhiteCheck = import.meta.env.VITE_APP_WHITE_CHECK === "true";
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_flux_form`;
const defaultForm = readonly<RuleForm>({
	output_name: "",
	class_tokens: "",
	pretrained_model_name_or_path: "./models/unet/flux1-dev.safetensors",
	ae: "./models/vae/ae.safetensors",
	clip_l: "./models/clip/clip_l.safetensors",
	t5xxl: "./models/clip/t5xxl_fp16.safetensors",
	resume: "",
	output_dir: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
	save_model_as: "safetensors",
	save_precision: "bf16",
	save_state: false,
	blocks_to_swap: undefined,
	// -----
	image_dir: "/root",
	tagger_model: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	output_trigger_words: true,
	tagger_advanced_settings: false,
	tagger_global_prompt: "",
	tagger_is_append: false,
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
	logit_mean: 0.0,
	logit_std: 1.0,
	mode_scale: 1.29,
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
	disable_mmap_load_safetensors: false,
	max_validation_steps: undefined,
	validate_every_n_epochs: undefined,
	validate_every_n_steps: undefined,
	validation_seed: undefined,
	validation_split: 0.0,
	// -----
	unet_lr: null,
	text_encoder_lr: "1e-4",
	lr_scheduler: "constant",
	lr_warmup_steps: 0,
	lr_scheduler_num_cycles: 0,
	optimizer_type: "adamw8bit",
	min_snr_gamma: undefined,
	optimizer_args: null,
	weighting_scheme: "uniform",
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
	clip_skip: 0,
	split_mode: false,
	text_encoder_batch_size: undefined,
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
	ddp_gradient_as_bucket_view: false,
	// -----
	sample_every_n_steps: undefined,
	sample_prompts: ""
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
	],
	resolution_width: [
		{
			asyncValidator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (value < 64) {
					callback(new Error("图片宽度不能小于64"));
					return;
				}
				if (value % 64 !== 0) {
					callback(new Error("图片宽度必须是64的整数倍"));
					return;
				}
				callback();
			},
			trigger: "change"
		}
	],
	resolution_height: [
		{
			asyncValidator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (value < 64) {
					callback(new Error("图片高度不能小于64"));
					return;
				}
				if (value % 64 !== 0) {
					callback(new Error("图片高度必须是64的整数倍"));
					return;
				}
				callback();
			},
			trigger: "change"
		}
	],
	lr_scheduler: [
		{
			asyncValidator: (_rule: any, _value: string, callback: (error?: string | Error) => void) => {
				// 联动校验
				ruleFormRef.value?.validateField("lr_warmup_steps");
				callback();
			},
			trigger: "change"
		}
	],
	lr_warmup_steps: [
		{
			asyncValidator: (_rule: any, value: number, callback: (error?: string | Error) => void) => {
				if (ruleForm.value.lr_scheduler === "constant_with_warmup") {
					// 学习调度器为该值时lr_warmup_steps预热步数必须大于0
					if (value <= 0) {
						callback(new Error("学习率预热步数必须大于0"));
						return;
					}
					callback();
				} else {
					// 其他情况lr_warmup_steps预热步数必须等于0
					if (value !== 0) {
						callback(new Error("学习率预热步数必须等于0"));
						return;
					}
					callback();
				}
			},
			trigger: "change"
		}
	],
	sample_every_n_steps: [
		{
			asyncValidator: (
				_rule: any,
				value: number | undefined,
				callback: (error?: string | Error) => void
			) => {
				// 联动校验
				ruleFormRef.value?.validateField("sample_prompts");
				if (typeof value !== "number") {
					callback();
					return;
				}
				// 采样步数必须大于等于10
				if ((value ?? 0) < 10) {
					callback(new Error("采样步数必须大于等于10"));
					return;
				}
				callback();
			},
			trigger: "change"
		}
	],
	sample_prompts: [
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const sampleSteps = ruleForm.value.sample_every_n_steps ?? 0;
				const hasPrompt = value.trim().length > 0;

				if (sampleSteps >= 10 && !hasPrompt) {
					callback(new Error("请填写采样提示词"));
				} else if (sampleSteps < 10 && hasPrompt) {
					callback(new Error("未配置采样步数或采样步数小于10，请清空采样提示词"));
				} else {
					callback();
				}
			},
			trigger: "change"
		}
	],
	highvram: [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (value && ruleForm.value.train_batch_size >= 2) {
					return callback(new Error("批量大小（train_batch_size）大于或等于2时，请关闭高显存模式"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	blocks_to_swap: [
		{
			validator: (
				_rule: any,
				value: number | undefined,
				callback: (error?: string | Error) => void
			) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.train_batch_size > 2 && value !== 32) {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，请选择32个block进行交换")
					);
				}
				callback();
			},
			trigger: "change"
		}
	],
	fp8_base: [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.train_batch_size > 2 && !value) {
					return callback(new Error("批量大小（train_batch_size）大于2时，请开启 fp8_base"));
				}
				callback();
			},
			trigger: "change"
		}
	],
	lowram: [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.train_batch_size > 2 && !value) {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，请开启低内存模式（lowram）")
					);
				}
				callback();
			},
			trigger: "change"
		}
	],
	optimizer_type: [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.train_batch_size > 2 && value !== "adamw8bit") {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，优化器设置必须设置为 AdamW8bit")
					);
				}
				callback();
			},
			trigger: "change"
		}
	],
	network_train_unet_only: [
		{
			validator: (_rule: any, value: boolean, callback: (error?: string | Error) => void) => {
				if (!isWhiteCheck) return callback();
				if (ruleForm.value.train_batch_size > 2 && !value) {
					return callback(
						new Error("批量大小（train_batch_size）大于2时，仅训练 U-Net 开关请开启")
					);
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
			prompt_type: ruleForm.value.prompt_type,
			global_prompt:
				ruleForm.value.tagger_model === "joy-caption-alpha-two"
					? ruleForm.value.tagger_global_prompt
					: "",
			is_append: ruleForm.value.tagger_is_append
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
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		const valid = await validateForm({
			formRef: ruleFormRef,
			formData: ruleForm,
			trainingStore: trainingStore,
			openSavePathWarningDialog: openSavePathWarningDialog
		});
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
		isRestored.value = true;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		stopFluxLoraListen(true);
		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

/** 查看采样 */
const openViewSampling = ref(false);
const samplingPath = computed(() => {
	return monitorFluxLoraData.value.data.samplingPath ?? "";
});
function onViewSampling() {
	openViewSampling.value = true;
}

/** 如果存在运行的任务，则在每次第一次更新任务时恢复表单配置为训练时的配置 */
function firstResetFormConfig(taskData: LoRATrainingInfoResult) {
	if (!taskData.frontend_config || isRestored.value) return;
	isRestored.value = true;
	const tomlData = tomlParse(taskData.frontend_config);
	mergeDataToForm(tomlData, ruleForm.value);
	ElMessage.success("训练配置已恢复");
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
