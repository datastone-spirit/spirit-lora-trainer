<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 11:17:17
 * @LastEditTime: 2025-08-23 21:37:51
 * @LastEditors: mulingyuer
 * @Description: 采样与推理配置
 * @FilePath: \frontend\src\views\lora\qwen-image\components\SampleConfig\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="训练前生成初始样本"
		prop="config.sample_at_first"
		popover-content="sample_at_first"
	>
		<el-switch v-model="ruleForm.config.sample_at_first" />
	</PopoverFormItem>
	<PopoverFormItem
		label="每N个epoch生成样本"
		prop="config.sample_every_n_epochs"
		popover-content="sample_every_n_epochs"
	>
		<el-input-number
			v-model.number="ruleForm.config.sample_every_n_epochs"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="每N步生成样本"
		prop="config.sample_every_n_steps"
		popover-content="sample_every_n_steps"
	>
		<el-input-number
			v-model.number="ruleForm.config.sample_every_n_steps"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="采样使用的提示词"
		prop="config.sample_prompts"
		popover-content="sample_prompts"
	>
		<el-input
			v-model="ruleForm.config.sample_prompts"
			:rows="6"
			type="textarea"
			placeholder="请输入采样提示词，多个词用英文逗号分隔"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="文本控制强度，数值越大生成结果越遵循文本提示"
		prop="config.guidance_scale"
		popover-content="guidance_scale"
	>
		<el-input-number v-model.number="ruleForm.config.guidance_scale" :step="0.1" :min="0" />
	</PopoverFormItem>
	<el-form-item>
		<el-alert
			class="no-select"
			title="注意：开启采样会严重增加训练时间。"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
