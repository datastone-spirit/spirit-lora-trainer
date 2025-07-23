<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 15:46:00
 * @LastEditTime: 2025-07-22 16:23:39
 * @LastEditors: mulingyuer
 * @Description: 时间步类型选项
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\TrainingConfig\TimestepTypeSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-select v-model="value" :placeholder="placeholder">
		<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
	</el-select>
</template>

<script setup lang="ts">
export interface OptimizerTypeSelectProps {
	placeholder?: string;
}

withDefaults(defineProps<OptimizerTypeSelectProps>(), {
	placeholder: "请选择时间步类型"
});

const value = defineModel({ type: String, required: true });

/** options */
const options = readonly(
	ref([
		{ value: "sigmoid", label: "Sigmoid" },
		{ value: "linear", label: "Linear" },
		{ value: "shift", label: "Shift" },
		{ value: "weighted", label: "Weighted" }
	])
);
</script>

<style scoped></style>
