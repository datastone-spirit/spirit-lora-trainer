<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:42:15
 * @LastEditTime: 2025-04-07 16:28:04
 * @LastEditors: mulingyuer
 * @Description: 打标内容是否追加到原有内容后面
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagAppendSwitch.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-switch v-model="value" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface TagAppendSwitchProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
}

withDefaults(defineProps<TagAppendSwitchProps>(), {
	label: "是否追加到已有打标文件中"
});

const value = defineModel({ type: Boolean, required: true });
</script>

<style scoped></style>
