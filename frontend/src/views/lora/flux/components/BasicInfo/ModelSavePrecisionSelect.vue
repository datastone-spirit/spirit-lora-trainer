<!--
 * @Author: mulingyuer
 * @Date: 2025-07-30 15:45:08
 * @LastEditTime: 2025-07-30 15:46:50
 * @LastEditors: mulingyuer
 * @Description: 模型保存精度选择
 * @FilePath: \frontend\src\views\lora\flux\components\BasicInfo\ModelSavePrecisionSelect.vue
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
		{
			label: "fp16",
			value: "fp16"
		},
		{
			label: "float",
			value: "float"
		},
		{
			label: "bf16",
			value: "bf16"
		}
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
