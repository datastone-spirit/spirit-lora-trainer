<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 15:12:30
 * @LastEditTime: 2025-01-06 15:15:23
 * @LastEditors: mulingyuer
 * @Description: 视频模型dtype
 * @FilePath: \frontend\src\components\Form\ModelDtypeSelector.vue
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
	label: "模型的基础 dtype",
	options: () => [
		{
			label: "bfloat16",
			value: "bfloat16"
		}
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
