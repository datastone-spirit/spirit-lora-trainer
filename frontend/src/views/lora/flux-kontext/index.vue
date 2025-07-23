<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 11:51:19
 * @LastEditTime: 2025-07-23 17:41:28
 * @LastEditors: mulingyuer
 * @Description: flux kontext 训练
 * @FilePath: \frontend\src\views\lora\flux-kontext\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="flux-kontext-page">
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
					<Collapse v-model="openStep2" title="第2步：AI数据集">
						<DataSet v-model:form="ruleForm" v-model:active-tab-name="activeTabName" />
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：LoRA 保存配置">
						<SaveConfig v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep4" title="第4步：训练配置">
						<TrainingConfig v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep5" title="第5步：采样配置">
						<SampleConfig v-model:form="ruleForm" />
					</Collapse>
					<SimpleCollapse v-show="isExpert" v-model="openStep6" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="activeDataSetItem?.folder_path ?? ''" />
			</template>
		</TwoSplit>
		<TeleportFooterBarContent
			v-model:merge-data="ruleForm"
			:reset-data="defaultForm"
			:submit-loading="false"
			@reset-data="onResetData"
			@submit="onSubmit"
		>
			<!-- <template #monitor-progress-bar>
				<LoRATrainingMonitor />
			</template>
			<template #right-btn-group>
				<el-button
					v-if="monitorFluxLoraData.data.showSampling"
					size="large"
					@click="onViewSampling"
				>
					查看采样
				</el-button> -->
			<!-- </template> -->
		</TeleportFooterBarContent>
	</div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, TabPaneName } from "element-plus";
// import type { StartFluxKontextTrainingData } from "@/api/lora";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useSettingsStore } from "@/stores";
import { tomlStringify } from "@/utils/toml";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import BasicInfo from "./components/BasicInfo/index.vue";
import DataSet from "./components/DataSet/index.vue";
import SampleConfig from "./components/SampleConfig/index.vue";
import SaveConfig from "./components/SaveConfig/index.vue";
import TrainingConfig from "./components/TrainingConfig/index.vue";
import type { RuleForm } from "./types";

const settingsStore = useSettingsStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();

const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}flux_kontext_form`;
const defaultForm: RuleForm = {
	type: "sd_trainer",
	training_folder: "",
	trigger_word: "",
	device: "cuda:0",
	network: {
		type: "lora",
		linear: 32,
		linear_alpha: 32
	},
	save: {
		dtype: "fp16",
		save_every: 250,
		max_step_saves_to_keep: 4,
		push_to_hub: false
	},
	train: {
		batch_size: 1,
		steps: 3000,
		gradient_accumulation_steps: 1,
		train_unet: true,
		train_text_encoder: false,
		gradient_checkpointing: true,
		noise_scheduler: "flowmatch",
		optimizer: "adamw8bit",
		timestep_type: "weighted",
		content_or_style: "balanced",
		optimizer_params: {
			weight_decay: 0.0001
		},
		unload_text_encoder: false,
		lr: 0.0001,
		ema_config: {
			use_ema: false,
			ema_decay: 0.99
		},
		skip_first_sample: false,
		disable_sampling: false,
		diff_output_preservation: false,
		diff_output_preservation_multiplier: 1,
		diff_output_preservation_class: "person",
		dtype: "bf16"
	},
	model: {
		arch: "flux_kontext",
		name_or_path: "",
		quantize: true,
		quantize_te: true
	},
	sample: {
		sampler: "flowmatch",
		sample_every: 250,
		width: 1024,
		height: 1024,
		seed: 42,
		walk_seed: true,
		guidance_scale: 4,
		sample_steps: 25,
		neg: "",
		prompts: []
	},
	datasets: [],
	name: "",
	tagConfig: {
		tagger_model: "joy-caption-alpha-two",
		joy_caption_prompt_type: "Training Prompt",
		is_add_global_prompt: false,
		tagger_advanced_settings: false,
		tagger_global_prompt: "",
		tagger_is_append: false
	}
};
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(defaultForm));
const rules = reactive<FormRules<RuleForm>>({});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
const activeTabName = ref<TabPaneName>("");
const activeDataSetItem = computed(() => {
	const findItem = ruleForm.value.datasets.find((item) => item.id === activeTabName.value);
	return findItem;
});

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
const openStep5 = ref(true);
const openStep6 = ref(true);

/** toml */
const toml = ref("");
const generateToml = useDebounceFn(() => {
	toml.value = tomlStringify(ruleForm.value);
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });

// 重置表单
function onResetData() {
	if (ruleFormRef.value) ruleFormRef.value.resetFields();
	ruleForm.value = structuredClone(defaultForm);
}

// 提交表单
function onSubmit() {}
</script>

<style lang="scss" scoped>
.flux-kontext-page {
	height: $zl-view-footer-bar-height;
}
</style>
