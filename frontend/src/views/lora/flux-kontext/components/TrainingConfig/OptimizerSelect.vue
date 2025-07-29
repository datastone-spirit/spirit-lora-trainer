<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 15:40:39
 * @LastEditTime: 2025-07-22 16:23:44
 * @LastEditors: mulingyuer
 * @Description: 优化器选择
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\TrainingConfig\OptimizerSelect.vue
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
	placeholder: "请选择优化器设置"
});

const value = defineModel({ type: String, required: true });

/** 优化器设置options */
const options = readonly(
	ref([
		{ value: "adamw8bit", label: "AdamW8Bit" },
		{ value: "adafactor", label: "Adafactor" }
	])
);
</script>

<style scoped></style>
