<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 15:41:07
 * @LastEditTime: 2025-03-24 15:49:17
 * @LastEditors: mulingyuer
 * @Description: 采样设置
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\SamplingOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="采样设置">
		<BaseSelector
			v-model="ruleForm.timestep_sampling"
			label="时间步采样方法"
			prop="timestep_sampling"
			popoverContent="timestep_sampling"
			:options="timestepSamplingOptions"
		/>
		<PopoverFormItem label="视频采样帧率" prop="sample_fps" popover-content="sample_fps">
			<el-input-number v-model.number="ruleForm.sample_fps" :step="1" step-strictly :min="1" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import type { BaseSelectorProps } from "@/components/Form/BaseSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 时间步采样方法选项 */
const timestepSamplingOptions = ref<BaseSelectorProps["options"]>([
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
</script>

<style scoped></style>
