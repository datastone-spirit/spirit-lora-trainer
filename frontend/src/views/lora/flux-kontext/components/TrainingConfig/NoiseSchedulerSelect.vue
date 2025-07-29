<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 15:55:58
 * @LastEditTime: 2025-07-22 16:23:50
 * @LastEditors: mulingyuer
 * @Description: 噪声调度器选项
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\TrainingConfig\NoiseSchedulerSelect.vue
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
	placeholder: "请选择噪声调度器"
});

const value = defineModel({ type: String, required: true });

/** options */
const options = readonly(
	ref([
		{ value: "flowmatch", label: "FlowMatch" },
		{ value: "ddpm", label: "DDPM" }
	])
);
</script>

<style scoped></style>
