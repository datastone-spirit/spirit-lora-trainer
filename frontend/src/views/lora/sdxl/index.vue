<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:50:40
 * @LastEditTime: 2024-12-11 15:48:08
 * @LastEditors: mulingyuer
 * @Description: sdxl 模型训练页面
 * @FilePath: \frontend\src\views\lora\sdxl\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<TwoSplit class="lora-sdxl-page" direction="horizontal" :sizes="[50, 50]">
		<template #left>
			<div class="lora-sdxl-content">
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
					<Collapse v-if="isExpert" v-model="openStep4" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" :form-props="ruleFormProps" />
					</Collapse>
				</el-form>
			</div>
		</template>
		<template #right>
			<div style="height: 100%">AI 数据集</div>
		</template>
	</TwoSplit>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import BasicInfo from "./components/BasicInfo/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import { useSettingsStore } from "@/stores";
import type { RuleForm, RuleFormProps } from "./types";
import { generateKeyMapFromInterface } from "@/utils/tools";

const settingsStore = useSettingsStore();

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<RuleForm>({
	output_name: "",
	class_tokens: "",
	pretrained_model_name_or_path: "",
	resume: "",
	vae: "",
	output_dir: "",
	save_model_as: "safetensors",
	save_precision: "fp16",
	save_state: false,
	// -----
	train_data_dir: "",
	num_repeats: 10,
	max_train_epochs: 10,
	train_batch_size: 1,
	resolution_width: 512,
	resolution_height: 512,
	enable_bucket: true,
	min_bucket_reso: 256,
	max_bucket_reso: 1024,
	bucket_reso_steps: 64,
	// -----
	seed: 1337,
	learning_rate: "1e-4",
	save_every_n_epochs: 2,
	network_dim: 32,
	// -----
	gradient_checkpointing: false,
	gradient_accumulation_steps: undefined,
	network_train_unet_only: false,
	network_train_text_encoder_only: false,
	unet_lr: "1e-4",
	text_encoder_lr: "1e-4",
	lr_scheduler: "cosine_with_restarts",
	lr_warmup_steps: 0,
	lr_scheduler_num_cycles: 1,
	optimizer_type: "adamw8bit",
	min_snr_gamma: undefined,
	optimizer_args: "",
	// -----
	network_module: "networks.lora",
	network_weights: "",
	network_alpha: "1e-2",
	network_dropout: 0,
	scale_weight_norms: undefined,
	network_args: "",
	enable_block_weights: false,
	down_lr_weight: "1,1,1,1,1,1,1,1,1,1,1,1",
	mid_lr_weight: "1",
	up_lr_weight: "1,1,1,1,1,1,1,1,1,1,1,1",
	block_lr_zero_threshold: 0,
	enable_base_weight: false,
	base_weights: [],
	base_weights_multiplier: "",
	// -----
	enable_preview: false,
	// -----,
	log_with: "tensorboard",
	log_prefix: "",
	log_tracker_name: "",
	logging_dir: "./logs",
	// -----
	caption_extension: ".txt",
	shuffle_caption: true,
	weighted_captions: false,
	keep_tokens: 0,
	keep_tokens_separator: "",
	max_token_length: 255,
	caption_dropout_rate: undefined,
	caption_dropout_every_n_epochs: undefined,
	caption_tag_dropout_rate: undefined,
	// -----
	noise_offset: undefined,
	multires_noise_iterations: undefined,
	multires_noise_discount: undefined,
	// -----
	color_aug: false,
	flip_aug: false,
	random_crop: false,
	// -----
	clip_skip: 2,
	// -----
	mixed_precision: "fp16",
	full_fp16: false,
	full_bf16: false,
	fp8_base: false,
	no_half_vae: false,
	xformers: true,
	sdpa: false,
	lowram: false,
	cache_latents: true,
	cache_latents_to_disk: true,
	cache_text_encoder_outputs: false,
	cache_text_encoder_outputs_to_disk: false,
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
	save_precision: [{ required: true, message: "请选择模型保存精度", trigger: "change" }],
	save_every_n_epochs: [
		{ required: true, message: "请输入每 N epoch（轮）自动保存一次模型", trigger: "blur" }
	],
	train_data_dir: [{ required: true, message: "请选择训练用的数据集目录", trigger: "change" }],
	num_repeats: [{ required: true, message: "请输入每个图像重复训练次数", trigger: "blur" }],
	resolution_width: [{ required: true, message: "请输入图片尺寸-宽度", trigger: "blur" }],
	resolution_height: [{ required: true, message: "请输入图片尺寸-高度", trigger: "blur" }]
});
const ruleFormProps = generateKeyMapFromInterface<RuleForm, RuleFormProps>(ruleForm.value);
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
</script>

<style lang="scss" scoped>
.lora-sdxl-page {
	height: calc(100vh - $header-height - $padding * 2);
}
.lora-sdxl-content {
	padding: 16px;
}
</style>
