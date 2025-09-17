<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 17:00:20
 * @LastEditTime: 2025-09-04 09:04:06
 * @LastEditors: mulingyuer
 * @Description: 适配器设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\AdapterSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="适配器设置">
		<PopoverFormItem label="适配器类型" prop="config.adapter.type" popover-content="type">
			<el-select v-model="ruleForm.config.adapter.type" placeholder="请选择适配器类型">
				<el-option label="lora" value="lora" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem label="维度" prop="config.adapter.rank" popover-content="rank">
			<el-input-number v-model.number="ruleForm.config.adapter.rank" :step="1" step-strictly />
		</PopoverFormItem>
		<PopoverFormItem
			label="训练的 LoRA 权重的 dtype"
			prop="config.adapter.dtype"
			popover-content="dtype"
		>
			<el-select
				v-model="ruleForm.config.adapter.dtype"
				placeholder="请选择训练的 LoRA 权重的 dtype"
			>
				<el-option label="bfloat16" value="bfloat16" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="从上次的LoRA继续训练"
			prop="config.adapter.init_from_existing"
			popover-content="init_from_existing"
		>
			<FileSelector
				v-model="ruleForm.config.adapter.init_from_existing"
				placeholder="请选择需要继续训练的LoRA"
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
