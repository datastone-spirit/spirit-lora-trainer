<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 11:57:50
 * @LastEditTime: 2024-12-09 09:50:13
 * @LastEditors: mulingyuer
 * @Description: 模型保存精度选择器
 * @FilePath: \frontend\src\components\Form\ModelSavePrecisionSelector.vue
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
