<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:07
 * @LastEditTime: 2024-12-20 14:54:49
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
								:tagger-start="onTaggerStart"
								:tagger-end="onTaggerEnd"
							/>
						</Collapse>
						<Collapse v-model="openStep3" title="第3步：模型参数调教">
							<ModelParameters v-model:form="ruleForm" :form-props="ruleFormProps" />
						</Collapse>
						<SimpleCollapse v-if="isExpert" v-model="openStep4" title="其它：高级设置">
							<AdvancedSettings v-model:form="ruleForm" :form-props="ruleFormProps" />
						</SimpleCollapse>
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
				<SystemMonitor v-if="showSystemMonitor" :data="systemMonitorData" />
				<LoRATrainingMonitor v-if="showLoRATrainingMonitor" :data="loRATrainingMonitorData" />
				<TagMonitor ref="tagMonitorRef" v-show="showTagMonitor" />
				<el-button
					v-if="!showSystemMonitor"
					type="primary"
					size="large"
					:loading="submitLoading"
					@click="onSubmit"
				>
					开始训练
				</el-button>
			</el-space>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import type { StartFluxTrainingData } from "@/api/lora/types";
import type { LoRATrainingMonitorProps } from "@/components/Monitor/LoRATrainingMonitor/index.vue";
import type { SystemMonitorProps } from "@/components/Monitor/SystemMonitor/index.vue";
import { useSettingsStore } from "@/stores";
import { checkData, checkDirectory } from "@/utils/lora.helper";
import { tomlStringify } from "@/utils/toml";
import { generateKeyMapFromInterface } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import ConfigBtns from "./components/Footer/ConfigBtns.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import { formatFormData, mergeDataToForm } from "./flux.helper";
import type { RuleForm, RuleFormProps } from "./types";
import TagMonitor from "@/components/Monitor/TagMonitor/index.vue";
import { startFluxTraining } from "@/api/lora";

const settingsStore = useSettingsStore();

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
	output_dir: "",
	save_model_as: "safetensors",
	save_precision: "bf16",
	save_state: false,
	// -----
	image_dir: "",
	tagger_model: "florence2",
	num_repeats: 1,
	max_train_epochs: 4,
	train_batch_size: 1,
	resolution_width: 768,
	resolution_height: 768,
	enable_bucket: false,
	min_bucket_reso: 256,
	max_bucket_reso: 1024,
	bucket_reso_steps: 64,
	bucket_no_upscale: false,
	// -----
	seed: 42,
	max_data_loader_n_workers: 2,
	learning_rate: "1e-4",
	save_every_n_epochs: 1,
	guidance_scale: 1,
	timestep_sampling: "sigmoid",
	network_dim: 4,
	// -----
	sigmoid_scale: 1,
	model_prediction_type: "raw",
	discrete_flow_shift: 3.1582,
	loss_type: "l2",
	t5xxl_max_token_length: null,
	// -----
	gradient_checkpointing: true,
	gradient_accumulation_steps: 1,
	network_train_unet_only: true,
	network_train_text_encoder_only: false,
	// -----
	unet_lr: "1e-5",
	text_encoder_lr: "1e-4",
	lr_scheduler: "constant_with_warmup",
	lr_warmup_steps: 0,
	lr_scheduler_num_cycles: 0,
	optimizer_type: "adafactor",
	min_snr_gamma: null,
	optimizer_args: "",
	// -----
	network_module: "networks.lora_flux",
	network_weights: "",
	network_alpha: "1e-2",
	network_dropout: 0,
	scale_weight_norms: null,
	network_args: "",
	enable_base_weight: false,
	base_weights: "",
	base_weights_multiplier: 1,
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
	caption_dropout_rate: null,
	caption_dropout_every_n_epochs: null,
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
	vae_batch_size: null,
	// -----
	ddp_timeout: null,
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

// 系统监控
const showSystemMonitor = ref(false);
const systemMonitorData = ref<SystemMonitorProps["data"]>({
	gpuUsage: 0, // gpu占用百分比
	gpuPower: 0, // gpu功率百分比
	gpuMemory: 0 // gpu显存百分比
});
// LoRA训练监控
const showLoRATrainingMonitor = ref(false);
const loRATrainingMonitorData = ref<LoRATrainingMonitorProps["data"]>({
	currentRound: 0,
	totalRound: 0,
	usedTime: "00:00:00",
	remainingTime: "00:00:00",
	stepTime: "00:00:00",
	averageLoss: "0.000"
});
// 打标监控
const showTagMonitor = ref(false);
const tagMonitorRef = ref<InstanceType<typeof TagMonitor>>();
function onTaggerStart() {
	showTagMonitor.value = true;
	tagMonitorRef.value?.start();
}
function onTaggerEnd() {
	showTagMonitor.value = false;
	tagMonitorRef.value?.stop();
}

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
			return resolve(true);
		});
	});
}
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		const valid = await validateForm();
		if (!valid) {
			ElMessage.warning("请填写必填项");
			return;
		}

		// 校验数据集是否有数据
		const isHasData = await checkData(ruleForm.value.image_dir);
		if (!isHasData) {
			ElMessage.error("数据集目录下没有数据");
			return;
		}

		// 开始训练
		const data: StartFluxTrainingData = formatFormData(ruleForm.value);
		submitLoading.value = true;
		showSystemMonitor.value = true;
		showLoRATrainingMonitor.value = true;
		await startFluxTraining(data);
		// 创建训练任务成功
		submitLoading.value = false;
		showSystemMonitor.value = false;
		showLoRATrainingMonitor.value = false;
		ElMessage.success("创建训练任务成功");
	} catch (error) {
		submitLoading.value = false;
		showSystemMonitor.value = false;
		showLoRATrainingMonitor.value = false;
		console.error("创建训练任务失败", error);
	}
}
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
