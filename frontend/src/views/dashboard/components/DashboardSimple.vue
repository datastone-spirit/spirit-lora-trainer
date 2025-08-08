<!--
 * @Author: mulingyuer
 * @Date: 2025-08-07 16:03:42
 * @LastEditTime: 2025-08-08 15:21:00
 * @LastEditors: mulingyuer
 * @Description: 简易信息面板
 * @FilePath: \frontend\src\views\dashboard\components\DashboardSimple.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-row class="dashboard-simple" :gutter="20">
		<el-col :xs="24" :sm="12" :lg="6">
			<div class="dashboard-simple-item">
				<Icon class="dashboard-simple-item-icon" name="ri-time-line" size="120" />
				<div class="dashboard-simple-item-title">系统运行时间</div>
				<div class="dashboard-simple-item-content">
					<div class="dashboard-simple-time-value"><strong>03天00小时</strong></div>
				</div>
			</div>
		</el-col>
		<el-col :xs="24" :sm="12" :lg="6">
			<div class="dashboard-simple-item">
				<Icon class="dashboard-simple-item-icon" name="ri-file-list-2-line" size="120" />
				<div class="dashboard-simple-item-title">活跃任务</div>
				<div class="dashboard-simple-item-content">
					<div class="dashboard-simple-task-value"><strong>1</strong></div>
				</div>
			</div>
		</el-col>
		<el-col :xs="24" :sm="12" :lg="6">
			<div class="dashboard-simple-item">
				<Icon class="dashboard-simple-item-icon" name="ri-database-2-line" size="120" />
				<div class="dashboard-simple-item-title">存储I/O</div>
				<div class="dashboard-simple-item-content">
					<div class="dashboard-simple-storage-detail">
						<div class="storage-detail-item">
							<div class="storage-detail-item-label">
								<Icon class="storage-detail-item-label-icon" name="ri-import-line" size="12" />
								读取
							</div>
							<div class="storage-detail-item-value">850Mb/s</div>
						</div>
						<div class="storage-detail-item">
							<div class="storage-detail-item-label">
								<Icon class="storage-detail-item-label-icon" name="ri-save-line" size="12" />
								写入
							</div>
							<div class="storage-detail-item-value">350Mb/s</div>
						</div>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :xs="24" :sm="12" :lg="6">
			<div class="dashboard-simple-item">
				<Icon class="dashboard-simple-item-icon" name="ri-base-station-line" size="120" />
				<div class="dashboard-simple-item-title">网络连接</div>
				<div class="dashboard-simple-item-content">
					<div class="dashboard-simple-network-detail">
						<div class="network-detail-item">
							<div class="network-detail-item-label">
								<Icon class="network-detail-item-label-icon" name="ri-upload-2-line" size="12" />
								上传
							</div>
							<div class="network-detail-item-value">850Mb/s</div>
						</div>
						<div class="network-detail-item">
							<div class="network-detail-item-label">
								<Icon class="network-detail-item-label-icon" name="ri-download-2-line" size="12" />
								下载
							</div>
							<div class="network-detail-item-value">350Mb/s</div>
						</div>
					</div>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.dashboard-simple {
	margin-bottom: -20px;
	:deep(.el-col) {
		margin-bottom: 20px;
	}
}
.dashboard-simple-item {
	background-color: var(--zl-about-page-bg);
	border-radius: $zl-border-radius;
	padding: 20px;
	min-height: 125px;
	position: relative;
	overflow: hidden;
}
.dashboard-simple-item-icon {
	position: absolute;
	top: -45px;
	right: -45px;
	color: var(--el-text-color-placeholder);
	opacity: 0.3;
}
.dashboard-simple-item-title {
	font-size: 14px;
}
.dashboard-simple-item-content {
	margin-top: 20px;
}
.dashboard-simple-time-value,
.dashboard-simple-task-value {
	font-size: 24px;
}
.dashboard-simple-storage-detail,
.dashboard-simple-network-detail {
	display: flex;
}
.storage-detail-item,
.network-detail-item {
	flex-grow: 1;
	min-width: 1px;
}
.storage-detail-item-label,
.network-detail-item-label {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: var(--el-text-color-secondary);
}
.storage-detail-item-label-icon,
.network-detail-item-label-icon {
	margin-right: 4px;
}
.storage-detail-item-value,
.network-detail-item-value {
	margin-top: 2px;
	font-size: 16px;
	font-weight: bold;
	color: var(--el-text-color-regular);
}
</style>
