<!--
 * @Author: mulingyuer
 * @Date: 2025-07-30 15:27:32
 * @LastEditTime: 2025-07-30 15:27:33
 * @LastEditors: mulingyuer
 * @Description: 模型保存格式选择
 * @FilePath: \frontend\src\views\lora\flux\components\BasicInfo\ModelSaveFormatSelect.vue
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
	label: "模型保存格式",
	options: () => [
		{
			label: "safetensors",
			value: "safetensors"
		},
		{
			label: "pt",
			value: "pt"
		},
		{
			label: "ckpt",
			value: "ckpt"
		}
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
