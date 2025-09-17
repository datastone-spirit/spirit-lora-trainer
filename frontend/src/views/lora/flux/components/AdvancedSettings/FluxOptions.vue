<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 09:44:26
 * @LastEditTime: 2025-09-03 14:50:57
 * @LastEditors: mulingyuer
 * @Description: flux相关配置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\FluxOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="Flux 专用参数">
		<PopoverFormItem
			label="sigmoid 缩放"
			prop="config.sigmoid_scale"
			popover-content="sigmoid_scale"
		>
			<el-input-number v-model.number="ruleForm.config.sigmoid_scale" :step="0.001" />
		</PopoverFormItem>
		<PopoverFormItem
			label="模型预测类型"
			prop="config.model_prediction_type"
			popover-content="model_prediction_type"
		>
			<el-select v-model="ruleForm.config.model_prediction_type" placeholder="请选择模型预测类型">
				<el-option label="raw" value="raw" />
				<el-option label="additive" value="additive" />
				<el-option label="sigma_scaled" value="sigma_scaled" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="Euler 调度器离散流位移"
			prop="config.discrete_flow_shift"
			popover-content="discrete_flow_shift"
		>
			<el-input-number v-model.number="ruleForm.config.discrete_flow_shift" :step="0.0001" />
		</PopoverFormItem>
		<PopoverFormItem label="损失函数类型" prop="config.loss_type" popover-content="loss_type">
			<el-select v-model="ruleForm.config.loss_type" placeholder="请选择损失函数类型">
				<el-option label="smooth_l1" value="smooth_l1" />
				<el-option label="l2" value="l2" />
				<el-option label="huber" value="huber" />
				<el-option label="smooth_l1" value="smooth_l1" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="T5XXL 最大 token 长度（不填写使用自动）"
			prop="config.t5xxl_max_token_length"
			popover-content="t5xxl_max_token_length"
		>
			<el-input-number
				v-model.number="ruleForm.config.t5xxl_max_token_length"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem label="高显存模式" prop="config.highvram" popover-content="highvram">
			<el-switch v-model="ruleForm.config.highvram" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
