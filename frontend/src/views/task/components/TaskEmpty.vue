<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 17:09:38
 * @LastEditTime: 2024-12-26 17:11:10
 * @LastEditors: mulingyuer
 * @Description: 无任务时的展示
 * @FilePath: \frontend\src\views\task\components\TaskEmpty.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task-empty">
		<el-empty class="task-empty-image" :image-size="100" />
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.task-empty {
	padding: 24px;
	background-color: var(--zl-page-bg);
	border-radius: $zl-border-radius;
}
.task-empty-image {
	padding: 0;
}
</style>
