<!--
 * @Author: mulingyuer
 * @Date: 2025-02-07 10:38:27
 * @LastEditTime: 2025-02-07 16:16:13
 * @LastEditors: mulingyuer
 * @Description: 采样选项
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\SampleOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="采样选项">
		<PopoverFormItem
			label="每隔几步进行采样"
			prop="sample_every_n_steps"
			popover-content="sample_every_n_steps"
		>
			<el-input-number
				v-model.number="ruleForm.sample_every_n_steps"
				:step="10"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem label="采样提示词" prop="sample_prompts" popover-content="sample_prompts">
			<el-input
				v-model="ruleForm.sample_prompts"
				placeholder="请输入采样提示词，多个词用英文逗号分隔"
				type="textarea"
				:rows="4"
			/>
		</PopoverFormItem>
		<el-alert
			title="注意：开启采样会增加训练时间"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
