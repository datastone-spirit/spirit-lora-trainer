<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 17:06:44
 * @LastEditTime: 2025-01-06 17:44:39
 * @LastEditors: mulingyuer
 * @Description: 优化器设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\OptimizerSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="优化器设置">
		<OptimizerTypeSelector
			v-model="ruleForm.optimizer.type"
			label="优化器类型"
			prop="optimizer.type"
			placeholder="请选择优化器类型"
			popover-content="type"
		/>
		<PopoverFormItem label="lr" prop="optimizer.lr" popover-content="lr">
			<el-input v-model="ruleForm.optimizer.lr" placeholder="请输入lr" />
		</PopoverFormItem>
		<el-row :gutter="16">
			<el-col :span="12">
				<PopoverFormItem label="betas 第一位" prop="optimizer.betas" popover-content="betas">
					<el-input-number v-model.number="ruleForm.optimizer.betas[0]" :step="0.1" :min="0" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem label="betas 第二位" prop="optimizer.betas" popover-content="betas">
					<el-input-number v-model.number="ruleForm.optimizer.betas[1]" :step="0.1" :min="0" />
				</PopoverFormItem>
			</el-col>
		</el-row>
		<PopoverFormItem
			label="weight_decay"
			prop="optimizer.weight_decay"
			popover-content="weight_decay"
		>
			<el-input-number v-model.number="ruleForm.optimizer.weight_decay" :step="0.01" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem label="eps" prop="optimizer.eps" popover-content="eps">
			<el-input v-model="ruleForm.optimizer.eps" placeholder="请输入eps" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import OptimizerTypeSelector from "../Form/OptimizerTypeSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
