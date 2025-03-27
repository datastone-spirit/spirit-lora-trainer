<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 16:16:07
 * @LastEditTime: 2025-03-26 16:38:11
 * @LastEditors: mulingyuer
 * @Description: 扩散模型参数
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\DiffusionModelOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="扩散模型参数">
		<PopoverFormItem
			label="用于控制Euler离散调度器的时间步偏移量，主要影响视频生成的噪声调度过程"
			prop="config.discrete_flow_shift"
			popover-content="discrete_flow_shift"
		>
			<el-input-number v-model.number="ruleForm.config.discrete_flow_shift" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="最小扩散时间步长，0-999"
			prop="config.min_timestep"
			popover-content="min_timestep"
		>
			<el-input-number
				v-model.number="ruleForm.config.min_timestep"
				:step="1"
				step-strictly
				:min="0"
				:max="999"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="最大扩散时间步长，1-1000"
			prop="config.max_timestep"
			popover-content="max_timestep"
		>
			<el-input-number
				v-model.number="ruleForm.config.max_timestep"
				:step="1"
				step-strictly
				:min="1"
				:max="1000"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="时间步权重分布集中度"
			prop="config.mode_scale"
			popover-content="mode_scale"
		>
			<el-input-number v-model.number="ruleForm.config.mode_scale" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="logit_normal权重均值"
			prop="config.logit_mean"
			popover-content="logit_mean"
		>
			<el-input-number v-model.number="ruleForm.config.logit_mean" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="logit_normal权重标准差"
			prop="config.logit_std"
			popover-content="logit_std"
		>
			<el-input-number v-model.number="ruleForm.config.logit_std" :step="0.1" :min="0" />
		</PopoverFormItem>
		<BaseSelector
			v-model="ruleForm.config.timestep_sampling"
			label="时间步采样方法"
			prop="config.timestep_sampling"
			popoverContent="timestep_sampling"
			:options="timestepSamplingOptions"
		/>
		<PopoverFormItem
			label="时间步采样sigmoid缩放系数（仅当timestep_sampling为sigmoid/shift时生效）"
			prop="config.sigmoid_scale"
			popover-content="sigmoid_scale"
		>
			<el-input-number v-model.number="ruleForm.config.sigmoid_scale" :step="0.1" :min="0" />
		</PopoverFormItem>
		<BaseSelector
			v-model="ruleForm.config.weighting_scheme"
			label="时间步权重分配方案"
			prop="config.weighting_scheme"
			popoverContent="weighting_scheme"
			:options="weightingSchemeOptions"
		/>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
/** 时间步采样方法选项 */
const timestepSamplingOptions = ref<ElOptions>([
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
	},
	{
		label: "sigma",
		value: "sigma"
	}
]);
/** 时间步权重分配方案选项 */
const weightingSchemeOptions = ref<ElOptions>([
	{
		label: "logit_normal",
		value: "logit_normal"
	},
	{
		label: "mode",
		value: "mode"
	},
	{
		label: "uniform",
		value: "uniform"
	},
	{
		label: "none",
		value: "none"
	}
]);
</script>

<style scoped></style>
