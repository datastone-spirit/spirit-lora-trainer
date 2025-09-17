<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 17:06:44
 * @LastEditTime: 2025-09-04 09:07:11
 * @LastEditors: mulingyuer
 * @Description: 优化器设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\OptimizerSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="优化器设置">
		<PopoverFormItem label="优化器类型" prop="config.optimizer.type" popover-content="type">
			<el-select v-model="ruleForm.config.optimizer.type" placeholder="请选择优化器类型">
				<el-option label="adamw_optimi" value="adamw_optimi" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem label="lr" prop="config.optimizer.lr" popover-content="lr">
			<el-input v-model="ruleForm.config.optimizer.lr" placeholder="请输入lr" />
		</PopoverFormItem>
		<el-row :gutter="16">
			<el-col :span="12">
				<PopoverFormItem
					label="betas 第一位"
					prop="config.optimizer.betas.0"
					popover-content="betas"
				>
					<el-input-number
						v-model.number="ruleForm.config.optimizer.betas[0]"
						:step="0.1"
						:min="0"
					/>
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="betas 第二位"
					prop="config.optimizer.betas.1"
					popover-content="betas"
				>
					<el-input-number
						v-model.number="ruleForm.config.optimizer.betas[1]"
						:step="0.1"
						:min="0"
					/>
				</PopoverFormItem>
			</el-col>
		</el-row>
		<PopoverFormItem
			label="权重衰减"
			prop="config.optimizer.weight_decay"
			popover-content="weight_decay"
		>
			<el-input-number
				v-model.number="ruleForm.config.optimizer.weight_decay"
				:step="0.01"
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem label="eps" prop="config.optimizer.eps" popover-content="eps">
			<el-input v-model="ruleForm.config.optimizer.eps" placeholder="请输入eps" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
