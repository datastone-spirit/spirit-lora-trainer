<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 16:38:54
 * @LastEditTime: 2025-09-04 08:57:08
 * @LastEditors: mulingyuer
 * @Description: 评估设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\EvalSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="评估设置">
		<PopoverFormItem
			label="每n个epochs评估一次"
			prop="config.eval_every_n_epochs"
			popover-content="eval_every_n_epochs"
		>
			<el-input-number
				v-model.number="ruleForm.config.eval_every_n_epochs"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="第一步前评估"
			prop="config.eval_before_first_step"
			popover-content="eval_before_first_step"
		>
			<el-switch v-model="ruleForm.config.eval_before_first_step" />
		</PopoverFormItem>
		<PopoverFormItem
			label="评估每个GPU的微批量大小"
			prop="config.eval_micro_batch_size_per_gpu"
			popover-content="eval_micro_batch_size_per_gpu"
		>
			<el-input-number
				v-model.number="ruleForm.config.eval_micro_batch_size_per_gpu"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="评估梯度累积步骤"
			prop="config.eval_gradient_accumulation_steps"
			popover-content="eval_gradient_accumulation_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.eval_gradient_accumulation_steps"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
