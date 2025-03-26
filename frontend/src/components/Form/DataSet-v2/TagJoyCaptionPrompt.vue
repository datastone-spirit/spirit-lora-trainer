<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:34:21
 * @LastEditTime: 2025-03-26 11:39:19
 * @LastEditors: mulingyuer
 * @Description: joy caption的打标提示词
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagJoyCaptionPrompt.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-input v-model="value" :placeholder="placeholder" type="textarea" :rows="rows" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps, InputProps } from "element-plus";

export interface TagJoyCaptionPromptProps {
	label: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
	placeholder?: string;
	rows?: InputProps["rows"];
}

withDefaults(defineProps<TagJoyCaptionPromptProps>(), {
	label: "打标提示词",
	placeholder: "请输入打标提示词",
	rows: 4
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
