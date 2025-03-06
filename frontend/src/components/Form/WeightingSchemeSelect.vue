<!--
 * @Author: mulingyuer
 * @Date: 2025-03-06 15:16:01
 * @LastEditTime: 2025-03-06 15:18:18
 * @LastEditors: mulingyuer
 * @Description: 权重分配方案选择
 * @FilePath: \frontend\src\components\Form\WeightingSchemeSelect.vue
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
	popoverContent: string;
	placeholder?: string;
	options?: Array<{ label: string; value: string; disabled?: boolean }>;
}

withDefaults(defineProps<ModelSaveFormatSelectorProps>(), {
	label: "权重分配方案，控制训练中各部分的权重分布",
	options: () => [
		{
			label: "sigma_sqrt",
			value: "sigma_sqrt"
		},
		{
			label: "logit_normal",
			value: "logit_normal"
		},
		{
			label: "mode",
			value: "mode"
		},
		{
			label: "cosmap",
			value: "cosmap"
		},
		{
			label: "uniform",
			value: "uniform"
		},
		{
			label: "none",
			value: "none"
		}
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
