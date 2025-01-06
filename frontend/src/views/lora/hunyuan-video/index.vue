<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 09:23:30
 * @LastEditTime: 2025-01-06 16:35:20
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
						<TrainingData :form="ruleForm" :tag-submit="onTagSubmit" />
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：模型参数调教">
						<ModelParameters v-model:form="ruleForm" />
					</Collapse>
					<SimpleCollapse v-model="openStep4" title="其它：高级设置">
						<AdvancedSettings v-model:form="ruleForm" />
					</SimpleCollapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="ruleForm.directory.path" />
			</template>
		</TwoSplit>
	</div>
</template>

<script setup lang="ts">
import { tomlStringify } from "@/utils/toml";
import type { FormInstance, FormRules } from "element-plus";
import type { RuleForm } from "./types";
import BasicInfo from "./components/BasicInfo/index.vue";
import TrainingData from "./components/TrainingData/index.vue";
import ModelParameters from "./components/ModelParameters/index.vue";
import AdvancedSettings from "./components/AdvancedSettings/index.vue";

const ruleFormRef = ref<FormInstance>();
const defaultForm = readonly<RuleForm>({
	output_name: "",
	class_tokens: "",
	model: {
		transformer_path: "",
		vae_path: "",
		llm_path: "",
		clip_path: "",
		dtype: "",
		transformer_dtype: "",
		timestep_sample_method: ""
	},
	output_dir: "",
	directory: {
		path: "",
		num_repeats: 0
	},
	tagger_model: "",
	prompt_type: "",
	output_trigger_words: true,
	resolution_width: 0,
	resolution_height: 0,
	enable_ar_bucket: false,
	min_ar: 0,
	max_ar: 0,
	num_ar_buckets: 0,
	frame_buckets: "",
	epochs: 0,
	micro_batch_size_per_gpu: 0,
	pipeline_stages: 0,
	gradient_accumulation_steps: 0,
	gradient_clipping: 0,
	warmup_steps: 0,
	eval_every_n_epochs: 0,
	eval_before_first_step: false,
	eval_micro_batch_size_per_gpu: 0,
	eval_gradient_accumulation_steps: 0,
	save_every_n_epochs: 0,
	checkpoint_every_n_minutes: 0,
	activation_checkpointing: false,
	partition_method: "",
	save_dtype: "",
	caching_batch_size: 0,
	steps_per_print: 0,
	video_clip_mode: "",
	adapter: {
		type: "",
		rank: 0,
		dtype: ""
	},
	optimizer: {
		type: "",
		lr: 0,
		betas: [],
		weight_decay: 0,
		eps: 0
	}
});
const ruleForm = ref<RuleForm>(structuredClone(toRaw(defaultForm) as RuleForm));
const rules = reactive<FormRules<RuleForm>>({});

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

// 打标
function onTagSubmit() {}
</script>

<style lang="scss" scoped>
.hunyuan-video {
	height: calc(100vh - $zl-padding * 2 - $zl-footer-bar-height);
}
</style>
