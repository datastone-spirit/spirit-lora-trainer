<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 14:28:13
 * @LastEditTime: 2024-12-09 09:50:58
 * @LastEditors: mulingyuer
 * @Description: 保存训练状态开关
 * @FilePath: \frontend\src\components\Form\SaveStateSwitch.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-switch v-model="value" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface ModelSaveFormatSelectorProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent: string;
}

withDefaults(defineProps<ModelSaveFormatSelectorProps>(), {
	label: "保存训练状态 配合 resume 参数可以继续从某个状态训练"
});

const value = defineModel({ type: Boolean, required: true });
</script>

<style scoped></style>
