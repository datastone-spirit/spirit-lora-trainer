<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 14:44:19
 * @LastEditTime: 2024-12-12 11:37:17
 * @LastEditors: mulingyuer
 * @Description: 类似fieldset的容器
 * @FilePath: \frontend\src\components\FieldSetWrapper\FieldSetWrapper.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="fieldset-wrapper">
		<div class="fieldset-wrapper-header">
			<h3 class="fieldset-wrapper-title">{{ title }}</h3>
		</div>
		<div class="fieldset-wrapper-divider-wrapper">
			<el-divider class="fieldset-wrapper-divider" />
		</div>
		<div class="fieldset-wrapper-content">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
export interface FieldSetWrapperProps {
	title: string;
}

withDefaults(defineProps<FieldSetWrapperProps>(), {});
</script>

<style lang="scss" scoped>
.fieldset-wrapper {
	background-color: var(--zl-field-set-wrapper-bg);
	border-radius: $zl-border-radius;
	margin-bottom: $zl-collapse-margin;
}
.fieldset-wrapper-header {
	padding: $zl-padding;
}
.fieldset-wrapper-title {
	font-size: 16px;
	font-weight: bold;
	color: var(--el-text-color-primary);
}
.fieldset-wrapper-divider-wrapper {
	margin: 0 $zl-padding;
}
.fieldset-wrapper-divider {
	margin: 0;
}
.fieldset-wrapper-content {
	padding: calc($zl-padding + $zl-padding / 2) $zl-padding;
}
</style>
