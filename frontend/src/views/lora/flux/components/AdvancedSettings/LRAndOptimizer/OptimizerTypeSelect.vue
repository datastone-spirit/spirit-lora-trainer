<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 10:34:40
 * @LastEditTime: 2025-07-30 15:52:57
 * @LastEditors: mulingyuer
 * @Description: 优化器设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\LRAndOptimizer\OptimizerTypeSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-select v-model="value" :placeholder="placeholder">
		<el-option
			v-for="item in optimizerTypeOptions"
			:key="item.value"
			:label="item.label"
			:value="item.value"
		/>
	</el-select>
</template>

<script setup lang="ts">
export interface OptimizerTypeSelectProps {
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
			value: "adamw"
		},
		{
			label: "AdamW8bit",
			value: "adamw8bit"
		},
		{
			label: "PagedAdamW8bit",
			value: "pagedadamw8bit"
		},
		{
			label: "Lion",
			value: "lion"
		},
		{
			label: "Lion8bit",
			value: "lion8bit"
		},
		{
			label: "PagedLion8bit",
			value: "pagedlion8bit"
		},
		{
			label: "SGDNesterov",
			value: "sgdnesterov"
		},
		{
			label: "SGDNesterov8bit",
			value: "sgdnesterov8bit"
		},
		{
			label: "DAdaptation",
			value: "dadaptation"
		},
		{
			label: "DAdaptAdam",
			value: "dadaptadam"
		},
		{
			label: "DAdaptAdaGrad",
			value: "dadaptadagrad"
		},
		{
			label: "DAdaptAdan",
			value: "dadaptadan"
		},
		{
			label: "DAdaptAdanIP",
			value: "dadaptadanip"
		},
		{
			label: "DAdaptLion",
			value: "dadaptlion"
		},
		{
			label: "DAdaptSGD",
			value: "dadaptsgd"
		},
		{
			label: "Prodigy",
			value: "prodigy"
		},
		{
			label: "AdaFactor",
			value: "adafactor"
		}
	])
);
</script>

<style scoped></style>
