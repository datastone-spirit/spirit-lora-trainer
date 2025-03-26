<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 10:58:24
 * @LastEditTime: 2025-03-26 11:31:57
 * @LastEditors: mulingyuer
 * @Description: 打标目录
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagDirectory.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<FolderSelector v-model="value" :placeholder="placeholder" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface TagDirectoryProps {
	label: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
	placeholder?: string;
}

withDefaults(defineProps<TagDirectoryProps>(), {
	label: "数据集目录",
	placeholder: "请选择训练用的数据集目录"
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
