<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:07
 * @LastEditTime: 2024-12-16 10:45:48
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
							<TrainingData v-model:form="ruleForm" :form-props="ruleFormProps" />
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
				<SplitRightPanel :toml="toml" />
			</template>
		</TwoSplit>
		<ConfigBtns />
		<Teleport to="#footer-bar-center" defer>
			<div class="flux-footer-bar">
				<el-button type="primary" size="large" :loading="submitLoading" @click="onSubmit">
					开始训练
				</el-button>
			</div>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { RuleForm, RuleFormProps } from "./types";
import { generateKeyMapFromInterface, removeUndefinedKeys } from "@/utils/tools";
import BasicInfo from "./components/BasicInfo/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import ConfigBtns from "./components/Footer/ConfigBtns.vue";
import { useSettingsStore } from "@/stores";
import { generateTomlString } from "@/utils/toml";

const settingsStore = useSettingsStore();

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<RuleForm>({
	output_name: "",
	class_tokens: "",
	pretrained_model_name_or_path: "",
	ae: "",
	clip_l: "",
	t5xxl: "",
	resume: "",
	output_dir: "",
	save_model_as: "",
	save_precision: "bf16",
	save_state: false,
	// -----
	image_dir: "",
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
	t5xxl_max_token_length: undefined,
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
	base_weights: [],
	base_weights_multiplier: "",
	// -----
	enable_preview: false,
	// -----
	log_with: "tensorboard",
	log_prefix: "",
	log_tracker_name: "",
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
const rules = reactive<FormRules<RuleForm>>({
	output_name: [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	class_tokens: [{ required: true, message: "请输入触发词", trigger: "blur" }],
	pretrained_model_name_or_path: [
		{ required: true, message: "请选择训练用的底模", trigger: "change" }
	],
	output_dir: [{ required: true, message: "请选择LoRA保存路径", trigger: "blur" }],
	save_model_as: [{ required: true, message: "请选择模型保存格式", trigger: "change" }],
	save_precision: [{ required: true, message: "请选择模型保存精度", trigger: "change" }]
	// save_every_n_epochs: [
	// 	{ required: true, message: "请输入每 N epoch（轮）自动保存一次模型", trigger: "blur" }
	// ],
	// image_dir: [{ required: true, message: "请选择训练用的数据集目录", trigger: "change" }],
	// num_repeats: [{ required: true, message: "请输入每个图像重复训练次数", trigger: "blur" }],
	// resolution_width: [{ required: true, message: "请输入图片尺寸-宽度", trigger: "blur" }],
	// resolution_height: [{ required: true, message: "请输入图片尺寸-高度", trigger: "blur" }]
});
const ruleFormProps = generateKeyMapFromInterface<RuleForm, RuleFormProps>(ruleForm.value);
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);

/** 提交表单 */
const submitLoading = ref(false);
function onSubmit() {
	if (!ruleFormRef.value) return;
	ruleFormRef.value.validate((valid) => {
		if (!valid) return;

		// 开始训练
		submitLoading.value = true;
		setTimeout(() => {
			submitLoading.value = false;
		}, 1000);
	});
}

/** toml */
const toml = ref("");
const generateToml = useDebounceFn(() => {
	const tomlData = removeUndefinedKeys(ruleForm.value);
	toml.value = generateTomlString(tomlData);
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });
</script>

<style lang="scss" scoped>
.lora-flux-page {
	height: calc(100vh - $zl-padding * 2 - $zl-footer-bar-height);
}
.flux-footer-bar {
	height: 100%;
	padding: 0 $zl-padding;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
// .lora-flux-content {
// 	padding: 16px;
// }
</style>
