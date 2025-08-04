<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 16:15:46
 * @LastEditTime: 2025-08-04 08:49:13
 * @LastEditors: mulingyuer
 * @Description: 采样设置
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\SampleConfig\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="是否启用采样"
		prop="train.disable_sampling"
		popover-content="disable_sampling"
	>
		<el-switch
			v-model="ruleForm.train.disable_sampling"
			:active-value="false"
			:inactive-value="true"
		/>
	</PopoverFormItem>
	<el-row v-show="!ruleForm.train.disable_sampling" :gutter="16">
		<el-col v-show="isExpert" :span="24">
			<PopoverFormItem label="采样器" prop="sample.sampler" popover-content="sampler">
				<SamplerSelect v-model="ruleForm.sample.sampler" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="每隔多少步进行一次采样"
				prop="sample.sample_every"
				popover-content="sample_every"
			>
				<el-input-number
					v-model.number="ruleForm.sample.sample_every"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="宽度" prop="sample.width" popover-content="width">
				<el-input-number v-model.number="ruleForm.sample.width" :controls="false" :min="0" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="高度" prop="sample.height" popover-content="height">
				<el-input-number v-model.number="ruleForm.sample.height" :controls="false" :min="0" />
			</PopoverFormItem>
		</el-col>
		<template v-if="isExpert">
			<el-col :span="12">
				<PopoverFormItem
					label="指导尺度"
					prop="sample.guidance_scale"
					popover-content="guidance_scale"
				>
					<el-input-number
						v-model.number="ruleForm.sample.guidance_scale"
						:step="1"
						step-strictly
						:min="0"
					/>
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="采样步骤数"
					prop="sample.sample_steps"
					popover-content="sample_steps"
				>
					<el-input-number
						v-model.number="ruleForm.sample.sample_steps"
						:step="1"
						step-strictly
						:min="1"
					/>
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem label="种子" prop="sample.seed" popover-content="seed">
					<el-input-number v-model.number="ruleForm.sample.seed" :step="1" step-strictly :min="0" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="是否在采样过程中逐步改变随机种子"
					prop="sample.walk_seed"
					popover-content="walk_seed"
				>
					<el-switch v-model="ruleForm.sample.walk_seed" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="24">
				<PopoverFormItem
					label="跳过第一个样本"
					prop="train.skip_first_sample"
					popover-content="skip_first_sample"
				>
					<el-switch v-model="ruleForm.train.skip_first_sample" />
				</PopoverFormItem>
			</el-col>
		</template>
		<el-col :span="24">
			<PopoverFormItem label="样本提示" prop="sample.prompts" popover-content="prompts">
				<SamplePrompts v-model:form="ruleForm" :form-instance="formInstance" />
			</PopoverFormItem>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";
import SamplerSelect from "./SamplerSelect.vue";
import SamplePrompts from "./SamplePrompts.vue";
import type { FormInstance } from "element-plus";

export interface SampleConfigProps {
	/** 表单实例 */
	formInstance: FormInstance | undefined;
}

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
defineProps<SampleConfigProps>();

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
