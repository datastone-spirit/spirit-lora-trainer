<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 09:10:38
 * @LastEditTime: 2024-12-10 09:30:27
 * @LastEditors: mulingyuer
 * @Description: 模型参数
 * @FilePath: \frontend\src\views\lora\flux\components\ModelParameters\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="随机种子" :prop="formProps.seed" popover-content="seed">
		<el-input-number v-model.number="ruleForm.seed" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem
		label="workers 数量"
		:prop="formProps.max_data_loader_n_workers"
		popover-content="max_data_loader_n_workers"
	>
		<el-input-number v-model.number="ruleForm.max_data_loader_n_workers" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem
		label="总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效"
		:prop="formProps.learning_rate"
		popover-content="learning_rate"
	>
		<el-input v-model="ruleForm.learning_rate" placeholder="请输入总学习率" />
	</PopoverFormItem>
	<PopoverFormItem
		label="每 N epoch（轮）自动保存一次模型"
		:prop="formProps.save_every_n_epochs"
		popover-content="save_every_n_epochs"
	>
		<el-input-number
			v-model.number="ruleForm.save_every_n_epochs"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="CFG 引导缩放"
		:prop="formProps.guidance_scale"
		popover-content="guidance_scale"
	>
		<el-input-number v-model.number="ruleForm.guidance_scale" :step="0.01" />
	</PopoverFormItem>
	<PopoverFormItem
		label="时间步采样"
		:prop="formProps.timestep_sampling"
		popover-content="timestep_sampling"
	>
		<el-select v-model="ruleForm.timestep_sampling" placeholder="请选择时间步采样">
			<el-option
				v-for="item in timestepSamplingOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		label="网络维度，常用 4~128，不是越大越好, 低dim可以降低显存占用"
		:prop="formProps.network_dim"
		popover-content="network_dim"
	>
		<el-input-number v-model.number="ruleForm.network_dim" :step="1" step-strictly />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { RuleForm, RuleFormProps } from "../../types";

export interface ModelParametersProps {
	/** 表单props */
	formProps: RuleFormProps;
}

defineProps<ModelParametersProps>();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

const timestepSamplingOptions = readonly([
	{
		label: "sigma",
		value: "sigma"
	},
	{
		label: "uniform",
		value: "uniform"
	},
	{
		label: "sigmoid",
		value: "sigmoid"
	},
	{
		label: "shift",
		value: "shift"
	}
]);
</script>

<style scoped></style>
