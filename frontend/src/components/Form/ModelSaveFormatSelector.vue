<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 11:39:32
 * @LastEditTime: 2025-07-22 15:12:46
 * @LastEditors: mulingyuer
 * @Description: 模型保存格式下拉框
 * @FilePath: \frontend\src\components\Form\ModelSaveFormatSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface ModelSaveFormatSelectorProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent: string;
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
