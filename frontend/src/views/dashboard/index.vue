<!--
 * @Author: mulingyuer
 * @Date: 2025-08-06 16:17:16
 * @LastEditTime: 2025-08-08 15:22:54
 * @LastEditors: mulingyuer
 * @Description: 监控面板
 * @FilePath: \frontend\src\views\dashboard\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="dashboard">
		<div class="dashboard-head">
			<div class="dashboard-head-left">
				<h2 class="dashboard-title">监控面板</h2>
				<p class="dashboard-desc">实时监控实例性能和任务状态</p>
			</div>
			<div class="dashboard-head-right">
				<div>最后更新时间</div>
				<div class="dashboard-last-update-time">2025/08/06 16:17:16</div>
			</div>
		</div>
		<DashboardSimple />
		<GPUList />
		<SystemResources />
		<Task />
	</div>
</template>

<script setup lang="ts">
import DashboardSimple from "./components/DashboardSimple.vue";
import GPUList from "./components/GPUList.vue";
import SystemResources from "./components/SystemResources.vue";
import Task from "./components/Task.vue";
</script>

<style lang="scss" scoped>
.dashboard {
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: $zl-padding;
}
.dashboard-head {
	background-color: var(--zl-about-page-bg);
	border-radius: $zl-border-radius;
	padding: 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.dashboard-title {
	font-size: 20px;
	font-weight: bold;
}
.dashboard-desc {
	margin-top: 2px;
	font-size: 12px;
	color: var(--el-text-color-regular);
}
.dashboard-head-right {
	text-align: right;
	font-size: 14px;
	line-height: 1.3;
	color: var(--el-text-color-regular);
}
</style>
