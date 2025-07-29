<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 15:13:34
 * @LastEditTime: 2025-07-22 15:50:09
 * @LastEditors: mulingyuer
 * @Description: 保存的浮点精度
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\SaveConfig\SaveDataType.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-select v-model="value" :placeholder="placeholder">
		<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
	</el-select>
</template>

<script setup lang="ts">
export interface ModelSaveFormatSelectorProps {
	placeholder?: string;
	options?: Array<{ label: string; value: string; disabled?: boolean }>;
}

withDefaults(defineProps<ModelSaveFormatSelectorProps>(), {
	label: "模型保存精度",
	options: () => [
		{ value: "bf16", label: "BF16" },
		{ value: "fp16", label: "FP16" },
		{ value: "fp32", label: "FP32" }
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
