<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 17:02:05
 * @LastEditTime: 2025-01-06 17:02:05
 * @LastEditors: mulingyuer
 * @Description: 适配器类型
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\Form\AdapterTypeSelector.vue
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
	popoverContent?: string;
	placeholder?: string;
	options?: Array<{ label: string; value: string; disabled?: boolean }>;
}

withDefaults(defineProps<ModelSaveFormatSelectorProps>(), {
	label: "适配器类型",
	options: () => [
		{
			label: "lora",
			value: "lora"
		}
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
