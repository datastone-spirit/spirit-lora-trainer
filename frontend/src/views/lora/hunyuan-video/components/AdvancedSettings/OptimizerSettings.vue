<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 17:06:44
 * @LastEditTime: 2025-01-07 09:31:11
 * @LastEditors: mulingyuer
 * @Description: 优化器设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\OptimizerSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="优化器设置">
		<OptimizerTypeSelector
			v-model="ruleForm.optimizer_type"
			label="优化器类型"
			prop="optimizer_type"
			placeholder="请选择优化器类型"
			popover-content="optimizer_type"
		/>
		<PopoverFormItem label="lr" prop="optimizer_lr" popover-content="optimizer_lr">
			<el-input v-model="ruleForm.optimizer_lr" placeholder="请输入lr" />
		</PopoverFormItem>
		<el-row :gutter="16">
			<el-col :span="12">
				<PopoverFormItem
					label="betas 第一位"
					prop="optimizer_betas"
					popover-content="optimizer_betas"
				>
					<el-input-number v-model.number="ruleForm.optimizer_betas[0]" :step="0.1" :min="0" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="betas 第二位"
					prop="optimizer_betas"
					popover-content="optimizer_betas"
				>
					<el-input-number v-model.number="ruleForm.optimizer_betas[1]" :step="0.1" :min="0" />
				</PopoverFormItem>
			</el-col>
		</el-row>
		<PopoverFormItem
			label="weight_decay"
			prop="optimizer_weight_decay"
			popover-content="optimizer_weight_decay"
		>
			<el-input-number v-model.number="ruleForm.optimizer_weight_decay" :step="0.01" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem label="eps" prop="optimizer_eps" popover-content="eps">
			<el-input v-model="ruleForm.optimizer_eps" placeholder="请输入eps" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import OptimizerTypeSelector from "../Form/OptimizerTypeSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
