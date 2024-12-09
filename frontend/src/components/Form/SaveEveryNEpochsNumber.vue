<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 14:23:28
 * @LastEditTime: 2024-12-09 09:50:42
 * @LastEditors: mulingyuer
 * @Description: 每 N epoch（轮）自动保存一次模型
 * @FilePath: \frontend\src\components\Form\SaveEveryNEpochsNumber.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-input-number v-model.number="value" :step="1" step-strictly :min="1" />
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
	label: "每 N epoch（轮）自动保存一次模型"
});

const value = defineModel({ type: Number, required: true });
</script>

<style scoped></style>
