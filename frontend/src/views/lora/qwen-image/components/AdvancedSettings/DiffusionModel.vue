<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 11:35:02
 * @LastEditTime: 2025-08-13 14:19:20
 * @LastEditors: mulingyuer
 * @Description: 扩散模型参数
 * @FilePath: \frontend\src\views\lora\qwen-image\components\AdvancedSettings\DiffusionModel.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="扩散模型参数">
		<PopoverFormItem
			label="时间步采样方法"
			prop="config.timestep_sampling"
			popoverContent="timestep_sampling"
		>
			<el-select v-model="ruleForm.config.timestep_sampling" placeholder="请选择时间步采样方法">
				<el-option label="uniform" value="uniform" />
				<el-option label="sigmoid" value="sigmoid" />
				<el-option label="shift" value="shift" />
				<el-option label="sigma" value="sigma" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="时间步采样sigmoid缩放系数（仅当timestep_sampling为sigmoid/shift时生效）"
			prop="config.sigmoid_scale"
			popover-content="sigmoid_scale"
		>
			<el-input-number v-model.number="ruleForm.config.sigmoid_scale" :step="0.1" :min="0" />
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
			label="用于控制Euler离散调度器的时间步偏移量，主要影响视频生成的噪声调度过程"
			prop="config.discrete_flow_shift"
			popover-content="discrete_flow_shift"
		>
			<el-input-number v-model.number="ruleForm.config.discrete_flow_shift" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="时间步权重分配方案"
			prop="config.weighting_scheme"
			popoverContent="weighting_scheme"
		>
			<el-select v-model="ruleForm.config.weighting_scheme" placeholder="请选择时间步权重分配方案">
				<el-option label="logit_normal" value="logit_normal" />
				<el-option label="mode" value="mode" />
				<el-option label="uniform" value="uniform" />
				<el-option label="none" value="none" />
			</el-select>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
