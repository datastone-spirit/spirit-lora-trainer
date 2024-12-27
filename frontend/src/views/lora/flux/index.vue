<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:07
 * @LastEditTime: 2024-12-27 10:29:43
 * @LastEditors: mulingyuer
 * @Description: flux 模型训练页面
 * @FilePath: \frontend\src\views\lora\flux\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="lora-flux-page">
		<TwoSplit direction="horizontal" :sizes="[50, 50]">
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
							<BasicInfo v-model:form="ruleForm" :form-props="ruleFormProps" />
						</Collapse>
						<Collapse v-model="openStep2" title="第2步：训练用的数据">
							<TrainingData
								v-model:form="ruleForm"
								:form-props="ruleFormProps"
								:tag-submit="onTagSubmit"
							/>
						</Collapse>
						<Collapse v-model="openStep3" title="第3步：模型参数调教">
							<ModelParameters v-model:form="ruleForm" :form-props="ruleFormProps" />
						</Collapse>
						<AdvancedSettingsCollapse
							v-show="isExpert"
							v-model="openStep4"
							title="其它：高级设置"
							:form="ruleForm"
							:form-props="ruleFormProps"
						/>
					</el-form>
				</div>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="ruleForm.image_dir" />
			</template>
		</TwoSplit>
		<ConfigBtns
			@load-config="onLoadConfig"
			:export-config="onExportConfig"
			@reset-data="onResetData"
		/>
		<Teleport to="#footer-bar-center" defer>
			<el-space class="flux-footer-bar" :size="40">
				<GPUMonitor v-if="isListenGPU" />
				<LoRATrainingMonitor v-if="isListenLora" />
				<TagMonitor v-if="isListenTag" />
				<el-button
					v-if="showSubmitBtn"
					type="primary"
					size="large"
					:loading="submitLoading || isListenLora"
					@click="onSubmit"
				>
					开始训练
				</el-button>
			</el-space>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { startFluxTraining } from "@/api/lora";
import type { StartFluxTrainingData } from "@/api/lora/types";
import { batchTag } from "@/api/tag";
import GPUMonitor from "@/components/Monitor/GPUMonitor/index.vue";
import LoRATrainingMonitor from "@/components/Monitor/LoRATrainingMonitor/index.vue";
import TagMonitor from "@/components/Monitor/TagMonitor/index.vue";
import { useGPU } from "@/hooks/useGPU";
import { useTag } from "@/hooks/useTag";
import { useTraining } from "@/hooks/useTraining";
import { useSettingsStore } from "@/stores";
import { checkData, checkDirectory } from "@/utils/lora.helper";
import { tomlStringify } from "@/utils/toml";
import { generateKeyMapFromInterface } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettingsCollapse from "./components/AdvancedSettingsCollapse/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import ConfigBtns from "./components/Footer/ConfigBtns.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import { formatFormData, mergeDataToForm } from "./flux.helper";
import type { RuleForm, RuleFormProps } from "./types";

const settingsStore = useSettingsStore();
const { isListenTag, startTagListen, stopTagListen, tagTaskStatus, isTagTaskEnd } = useTag();
const { isListenLora, startLoraListen, stopLoraListen, loraTaskStatus, isLoraTaskEnd } =
	useTraining();
const { isListenGPU, startGPUListen, stopGPUListen } = useGPU();

const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_flux_form`;
const defaultForm = readonly<RuleForm>({
	output_name: "",
	class_tokens: "",
	pretrained_model_name_or_path: "",
	ae: "",
	clip_l: "",
	t5xxl: "",
	resume: "",
	output_dir: "/",
	save_model_as: "safetensors",
	save_precision: "bf16",
	save_state: false,
	// -----
	image_dir: "/",
	tagger_model: "joy-caption-alpha-two",
	num_repeats: 4,
	max_train_epochs: 10,
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
	learning_rate: "1e-4",
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
	network_train_unet_only: true,
	network_train_text_encoder_only: false,
	output_config: true,
	// -----
	unet_lr: "1e-5",
	text_encoder_lr: "1e-4",
	lr_scheduler: "constant_with_warmup",
	lr_warmup_steps: 0,
	lr_scheduler_num_cycles: 0,
	optimizer_type: "adamw8bit",
	min_snr_gamma: undefined,
	optimizer_args: "",
	// -----
	network_module: "networks.lora_flux",
	network_weights: "",
	network_alpha: "1e-2",
	network_dropout: 0,
	scale_weight_norms: undefined,
	network_args: "",
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
	keep_tokens: 1,
	keep_tokens_separator: "|||",
	caption_dropout_rate: undefined,
	caption_dropout_every_n_epochs: undefined,
	caption_tag_dropout_rate: 0,
	// -----
	color_aug: false,
	flip_aug: true,
	random_crop: false,
	// -----
	clip_skip: 2,
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
const ruleForm = useLocalStorage<RuleForm>(
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
const ruleFormProps = generateKeyMapFromInterface<RuleForm, RuleFormProps>(ruleForm.value);
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
	toml.value = tomlStringify(formatFormData(ruleForm.value));
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });

/** 导入配置 */
function onLoadConfig(toml: StartFluxTrainingData) {
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
	return formatFormData(ruleForm.value);
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
async function onTagSubmit() {
	try {
		const { image_dir, tagger_model } = ruleForm.value;
		// 校验
		let valid = true;
		let validMsg = "";
		if (typeof image_dir !== "string" || image_dir.trim() === "") {
			valid = false;
			validMsg = "请先选择训练用的数据集目录";
		}
		const exists = await checkDirectory(image_dir);
		if (!exists) {
			valid = false;
			validMsg = "数据集目录不存在";
		}
		if (typeof tagger_model !== "string" || tagger_model.trim() === "") {
			valid = false;
			validMsg = "请先选择打标模型";
		}
		if (!valid) {
			ElMessage({
				message: validMsg,
				type: "error"
			});
			return;
		}

		// api
		const result = await batchTag({
			image_path: image_dir,
			model_name: tagger_model
		});
		startGPUListen();
		startTagListen(result.task_id);

		ElMessage({
			message: "正在打标...",
			type: "success"
		});
	} catch (error) {
		stopGPUListen();
		stopTagListen();

		console.log("打标任务创建失败", error);
	}
}

/** 提交表单 */
const submitLoading = ref(false);
// 如果任何一个监视器为真，则不显示提交按钮
const showSubmitBtn = computed(() => {
	const monitors = [isListenGPU.value, isListenLora.value, isListenTag.value];
	return !monitors.some((monitor) => monitor);
});
function validateForm() {
	return new Promise((resolve) => {
		if (!ruleFormRef.value) return resolve(false);
		ruleFormRef.value.validate(async (valid) => {
			if (!valid) {
				ElMessage.warning("请填写必填项");
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
		// 监听GPU数据
		startGPUListen();
		// 监听训练数据
		startLoraListen(task_id);

		submitLoading.value = false;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		stopLoraListen();

		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}

// 监听是否在打标和训练
watch(
	[isListenTag, isListenLora],
	(newList) => {
		const isNotListen = newList.every((item) => !item);
		if (isNotListen) {
			stopGPUListen();
		}
	},
	{ immediate: true }
);

onMounted(() => {
	// 组件挂载时，开始监听
	if (!isTagTaskEnd(tagTaskStatus.value)) {
		startTagListen();
		startGPUListen();
	}
	if (!isLoraTaskEnd(loraTaskStatus.value)) {
		startLoraListen();
		startGPUListen();
	}
});
onUnmounted(() => {
	// 组件销毁时，停止监听
	stopGPUListen();
	stopTagListen();
	stopLoraListen();
});
</script>

<style lang="scss" scoped>
.lora-flux-page {
	height: calc(100vh - $zl-padding * 2 - $zl-footer-bar-height);
}
.flux-footer-bar {
	width: 100%;
	height: 100%;
	justify-content: flex-end;
}
</style>
