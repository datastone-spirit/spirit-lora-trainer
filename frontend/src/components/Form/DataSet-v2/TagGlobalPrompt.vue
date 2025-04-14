<!--
 * @Author: mulingyuer
 * @Date: 2025-04-07 16:40:42
 * @LastEditTime: 2025-04-07 16:59:23
 * @LastEditors: mulingyuer
 * @Description: 原样保留的打标提示词
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagGlobalPrompt.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-input v-model="value" :placeholder="placeholder" type="textarea" :rows="rows" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface TagGlobalPromptProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
	placeholder?: string;
	rows?: number;
}

withDefaults(defineProps<TagGlobalPromptProps>(), {
	label: "原样保留的打标提示词",
	placeholder: "请输入原样保留的打标提示词",
	rows: 4
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
