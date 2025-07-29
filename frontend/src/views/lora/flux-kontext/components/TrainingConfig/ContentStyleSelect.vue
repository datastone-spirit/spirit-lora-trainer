<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 15:53:47
 * @LastEditTime: 2025-07-22 15:54:58
 * @LastEditors: mulingyuer
 * @Description: 时间步长偏差选项
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\TrainingConfig\ContentStyleSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-select v-model="value" :placeholder="placeholder">
		<el-option
			v-for="item in timestepTypeOptions"
			:key="item.value"
			:label="item.label"
			:value="item.value"
		/>
	</el-select>
</template>

<script setup lang="ts">
export interface OptimizerTypeSelectProps {
	placeholder?: string;
}

withDefaults(defineProps<OptimizerTypeSelectProps>(), {
	placeholder: "请选择时间步长偏差"
});

const value = defineModel({ type: String, required: true });

/** options */
const timestepTypeOptions = readonly(
	ref([
		{ value: "balanced", label: "Balanced" },
		{ value: "content", label: "High Noise" },
		{ value: "style", label: "Low Noise" }
	])
);
</script>

<style scoped></style>
