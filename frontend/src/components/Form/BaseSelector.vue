<!--
 * @Author: mulingyuer
 * @Date: 2025-03-21 16:12:15
 * @LastEditTime: 2025-03-21 16:28:47
 * @LastEditors: mulingyuer
 * @Description: 基础选择器
 * @FilePath: \frontend\src\components\Form\BaseSelector.vue
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

export interface BaseSelectorProps {
	label: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent: string;
	placeholder?: string;
	options: Array<{ label: string; value: string; disabled?: boolean }>;
}

defineProps<BaseSelectorProps>();

const value = defineModel<string | number | boolean>({ required: true });
</script>

<style scoped></style>
