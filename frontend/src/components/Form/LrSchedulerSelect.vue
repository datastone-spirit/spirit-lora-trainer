<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 10:29:33
 * @LastEditTime: 2024-12-11 09:33:05
 * @LastEditors: mulingyuer
 * @Description: 学习率调度器设置
 * @FilePath: \frontend\src\components\Form\LrSchedulerSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="item in lrSchedulerOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
</template>

<script setup lang="ts">
export interface LrSchedulerSelectProps {
	label?: string;
	prop?: string;
	popoverContent: string;
	placeholder?: string;
}

withDefaults(defineProps<LrSchedulerSelectProps>(), {
	label: "学习率调度器设置",
	placeholder: "请选择学习率调度器设置"
});

const value = defineModel({ type: String, required: true });

/** 学习率调度器options */
const lrSchedulerOptions = readonly([
	{
		label: "linear",
		value: "linear"
	},
	{
		label: "cosine",
		value: "cosine"
	},
	{
		label: "cosine_with_restarts",
		value: "cosine_with_restarts"
	},
	{
		label: "polynomial",
		value: "polynomial"
	},
	{
		label: "constant",
		value: "constant"
	},
	{
		label: "constant_with_warmup",
		value: "constant_with_warmup"
	}
]);
</script>

<style scoped></style>
