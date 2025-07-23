<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 11:51:19
 * @LastEditTime: 2025-07-23 09:22:31
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
					<Collapse v-model="openStep2" title="第2步：AI数据集"> xxx </Collapse>
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
			<template #right> </template>
		</TwoSplit>
	</div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
// import type { StartFluxKontextTrainingData } from "@/api/lora";
import type { RuleForm } from "./types";
import { getEnv } from "@/utils/env";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import BasicInfo from "./components/BasicInfo/index.vue";
import SaveConfig from "./components/SaveConfig/index.vue";
import TrainingConfig from "./components/TrainingConfig/index.vue";
import SampleConfig from "./components/SampleConfig/index.vue";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();

const env = getEnv();
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}flux_kontext_form`;
const defaultForm: RuleForm = {
	config: {
		name: "",
		trigger_word: "",
		training_folder: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		network: {
			type: "lora",
			linear: 32,
			linear_alpha: 32
		},
		save: {
			dtype: "fp16",
			save_every: 250,
			max_step_saves_to_keep: 4
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
			name_or_path: "",
			quantize: true,
			quantize_te: true,
			arch: "flux_kontext"
		},
		sample: {
			sampler: "flowmatch",
			sample_every: 250,
			width: 1024,
			height: 1024,
			samples: [],
			seed: 42,
			walk_seed: true,
			guidance_scale: 4,
			sample_steps: 25
		}
	},
	dataset: [],
	frontend_config: "",
	tagConfig: {
		tagger_model: "joy-caption-alpha-two",
		joy_caption_prompt_type: "Training Prompt",
		is_add_global_prompt: false,
		global_prompt: "",
		tagger_advanced_settings: false,
		tagger_global_prompt: "",
		tagger_is_append: false
	}
};
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(defaultForm));
const rules = reactive<FormRules<RuleForm>>({});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);
const openStep5 = ref(true);
const openStep6 = ref(true);
</script>

<style scoped></style>
