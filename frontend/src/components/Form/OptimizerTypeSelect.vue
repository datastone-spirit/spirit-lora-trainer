<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 10:34:40
 * @LastEditTime: 2024-12-10 10:39:12
 * @LastEditors: mulingyuer
 * @Description: 优化器设置
 * @FilePath: \frontend\src\components\Form\OptimizerTypeSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="item in optimizerTypeOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
</template>

<script setup lang="ts">
export interface OptimizerTypeSelectProps {
	label?: string;
	prop?: string;
	popoverContent: string;
	placeholder?: string;
}

withDefaults(defineProps<OptimizerTypeSelectProps>(), {
	label: "优化器设置",
	placeholder: "请选择优化器设置"
});

const value = defineModel({ type: String, required: true });

/** 优化器设置options */
const optimizerTypeOptions = readonly(
	ref([
		{
			label: "AdamW",
			value: "AdamW"
		},
		{
			label: "AdamW8bit",
			value: "AdamW8bit"
		},
		{
			label: "PagedAdamW8bit",
			value: "PagedAdamW8bit"
		},
		{
			label: "Lion",
			value: "Lion"
		},
		{
			label: "Lion8bit",
			value: "Lion8bit"
		},
		{
			label: "PagedLion8bit",
			value: "PagedLion8bit"
		},
		{
			label: "SGDNesterov",
			value: "SGDNesterov"
		},
		{
			label: "SGDNesterov8bit",
			value: "SGDNesterov8bit"
		},
		{
			label: "DAdaptation",
			value: "DAdaptation"
		},
		{
			label: "DAdaptAdam",
			value: "DAdaptAdam"
		},
		{
			label: "DAdaptAdaGrad",
			value: "DAdaptAdaGrad"
		},
		{
			label: "DAdaptAdanlP",
			value: "DAdaptAdanlP"
		},
		{
			label: "DAdaptAdaMax",
			value: "DAdaptAdaMax"
		},
		{
			label: "DAdaptLion",
			value: "DAdaptLion"
		},
		{
			label: "DAdaptsGD",
			value: "DAdaptsGD"
		},
		{
			label: "AdaFactor",
			value: "AdaFactor"
		},
		{
			label: "Prodigy",
			value: "Prodigy"
		}
	])
);
</script>

<style scoped></style>
