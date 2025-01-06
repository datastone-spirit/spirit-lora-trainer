<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 16:57:02
 * @LastEditTime: 2025-01-06 16:58:37
 * @LastEditors: mulingyuer
 * @Description: 视频帧提取模式
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\Form\VideoClipModeSelector.vue
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
	label: "提取视频帧的方式",
	options: () => [
		{
			label: " 一个从视频开头开始的剪辑",
			value: "single_beginning"
		},
		{
			label: "一个从视频中间开始的剪辑（等量裁剪掉开始和结束）",
			value: "single_middle"
		},
		{
			label: "提取最少数量的剪辑以覆盖视频的全部范围",
			value: "multiple_overlapping"
		}
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
