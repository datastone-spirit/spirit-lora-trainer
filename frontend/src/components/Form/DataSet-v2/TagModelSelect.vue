<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 10:48:16
 * @LastEditTime: 2025-03-26 11:32:17
 * @LastEditors: mulingyuer
 * @Description: 打标模型选择器
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagModelSelect.vue
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

export interface TaggerModelSelectProps {
	label: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
	placeholder?: string;
	options?: ElOptions;
}

withDefaults(defineProps<TaggerModelSelectProps>(), {
	label: "打标模型",
	placeholder: "请选择打标模型",
	options: () => [
		{ label: "Joy Caption2", value: "joy-caption-alpha-two" },
		{ label: "Florence2", value: "florence2" }
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
