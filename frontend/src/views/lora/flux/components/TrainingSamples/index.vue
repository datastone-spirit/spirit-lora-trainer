<!--
 * @Author: mulingyuer
 * @Date: 2025-02-10 09:52:39
 * @LastEditTime: 2025-09-03 14:47:47
 * @LastEditors: mulingyuer
 * @Description: 训练采样
 * @FilePath: \frontend\src\views\lora\flux\components\TrainingSamples\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="采样间隔步数"
		prop="config.sample_every_n_steps"
		popover-content="sample_every_n_steps"
	>
		<el-input-number
			v-model.number="ruleForm.config.sample_every_n_steps"
			:step="10"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem label="采样提示词" prop="config.sample_prompts" popover-content="sample_prompts">
		<el-input
			v-model="ruleForm.config.sample_prompts"
			placeholder="请输入采样提示词，多个词用英文逗号分隔"
			type="textarea"
			:rows="4"
		/>
	</PopoverFormItem>
	<el-alert
		title="注意：开启采样会增加训练时间，如果要开启训练时采样， 采样间隔步数和采样提示词都必须设置，其中采样间隔步数必须大于10，采样提示词必须是非空"
		type="warning"
		:closable="false"
		show-icon
		effect="dark"
	/>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
