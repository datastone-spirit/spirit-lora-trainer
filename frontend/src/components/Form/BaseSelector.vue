<!--
 * @Author: mulingyuer
 * @Date: 2025-03-21 16:12:15
 * @LastEditTime: 2025-07-30 16:02:02
 * @LastEditors: mulingyuer
 * @Description: 基础选择器
 * @FilePath: \frontend\src\components\Form\BaseSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-select v-model="value" :placeholder="placeholder">
		<el-option
			v-for="(item, index) in options"
			:key="index"
			:label="item.label"
			:value="item.value"
		/>
	</el-select>
</template>

<script setup lang="ts">
export interface BaseSelectorProps {
	placeholder?: string;
	options: ElOptions;
}

defineProps<BaseSelectorProps>();

const value = defineModel<string | number | boolean>({ required: true });
</script>

<style scoped></style>
