<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 15:18:16
 * @LastEditTime: 2025-01-06 15:19:19
 * @LastEditors: mulingyuer
 * @Description: 底模 dtype
 * @FilePath: \frontend\src\components\Form\ModelTransformerDtypeSelector.vue
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
	label: "底模 dtype",
	options: () => [
		{
			label: "float8",
			value: "float8"
		}
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
