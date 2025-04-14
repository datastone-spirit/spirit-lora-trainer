<!--
 * @Author: mulingyuer
 * @Date: 2025-03-21 16:12:15
 * @LastEditTime: 2025-03-26 14:23:26
 * @LastEditors: mulingyuer
 * @Description: 基础选择器
 * @FilePath: \frontend\src\components\Form\BaseSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="(item, index) in options"
				:key="index"
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
	popoverContent?: string;
	placeholder?: string;
	options: ElOptions;
}

defineProps<BaseSelectorProps>();

const value = defineModel<string | number | boolean>({ required: true });
</script>

<style scoped></style>
