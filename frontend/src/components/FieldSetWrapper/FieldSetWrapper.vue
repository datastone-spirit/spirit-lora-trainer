<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 14:44:19
 * @LastEditTime: 2024-12-06 15:56:15
 * @LastEditors: mulingyuer
 * @Description: 类似fieldset的容器
 * @FilePath: \frontend\src\components\FieldSetWrapper\FieldSetWrapper.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="fieldset-wrapper">
		<h3 class="fieldset-wrapper-title">- {{ title }} -</h3>
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
	margin: 24px 0 46px;
	position: relative;
	border: 1px var(--el-border-color) var(--el-border-style);
	border-radius: var(--el-border-radius-base);
	z-index: 1;
	transition: border 0.2s;
	&::before,
	&::after {
		content: "";
		position: absolute;
		background-color: var(--el-card-bg-color);
		z-index: -1;
	}
	&::before {
		top: 20px;
		bottom: 20px;
		left: -2px;
		right: -2px;
	}
	&::after {
		top: -2px;
		bottom: -2px;
		left: 20px;
		right: 20px;
	}
	&:hover {
		border-color: var(--el-color-primary);
		.fieldset-wrapper-title {
			color: var(--el-color-primary);
		}
	}
}
.fieldset-wrapper-title {
	font-size: 16px;
	font-weight: bold;
	position: absolute;
	left: 50%;
	transform: translate3D(-50%, -50%, 0);
	color: var(--el-text-color-primary);
	transition: color 0.2s;
}
.fieldset-wrapper-content {
	padding: 30px 10px 0 10px;
}
</style>
