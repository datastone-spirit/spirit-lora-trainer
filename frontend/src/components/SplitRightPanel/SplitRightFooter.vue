<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:59:29
 * @LastEditTime: 2024-12-12 15:38:59
 * @LastEditors: mulingyuer
 * @Description: 底部栏
 * @FilePath: \frontend\src\components\SplitRightPanel\SplitRightFooter.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="split-right-footer">
		<slot></slot>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.split-right-footer {
	flex-shrink: 0;
	margin-top: $zl-padding;
	height: 56px;
	padding: 0 $zl-padding;
	background-color: var(--zl-split-right-panel-bg);
	border-radius: $zl-border-radius;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
