<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 15:48:01
 * @LastEditTime: 2025-03-24 15:49:08
 * @LastEditors: mulingyuer
 * @Description: 优化器设置
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\OptimizerOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="优化器设置">
		<BaseSelector
			v-model="ruleForm.optimizer_type"
			label="优化器类型"
			prop="optimizer_type"
			popoverContent="optimizer_type"
			:options="optimizerTypeOptions"
		/>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import type { BaseSelectorProps } from "@/components/Form/BaseSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 优化器类型选项 */
const optimizerTypeOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "adamw8bit",
		value: "adamw8bit"
	},
	{
		label: "adafactor",
		value: "adafactor"
	},
	{
		label: "lion",
		value: "lion"
	},
	{
		label: "lion8bit",
		value: "lion8bit"
	}
]);
</script>

<style scoped></style>
