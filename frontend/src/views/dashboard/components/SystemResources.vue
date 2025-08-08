<!--
 * @Author: mulingyuer
 * @Date: 2025-08-08 11:45:13
 * @LastEditTime: 2025-08-08 16:20:35
 * @LastEditors: mulingyuer
 * @Description: 系统资源
 * @FilePath: \frontend\src\views\dashboard\components\SystemResources.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="system-resources">
		<div class="system-resources-title">系统资源</div>
		<el-row class="system-resources-content" :gutter="16">
			<el-col :span="24" :md="12">
				<el-card class="system-resources-item" shadow="always">
					<Icon class="system-resources-item-icon" name="ri-cpu-line" size="120" />
					<div class="system-resources-item-title">CPU使用率</div>
					<div class="system-resources-item-body">
						<div class="system-resources-item-body-value"><strong>50%</strong></div>
						<el-progress
							:percentage="40"
							:show-text="false"
							:stroke-width="8"
							:color="progressColors"
						/>
					</div>
				</el-card>
			</el-col>
			<el-col :span="24" :md="12">
				<el-card class="system-resources-item" shadow="always">
					<Icon class="system-resources-item-icon" name="ri-ram-line" size="120" />
					<div class="system-resources-item-title">内存使用率</div>
					<div class="system-resources-item-body">
						<div class="system-resources-item-body-value"><strong>24.5GB</strong> / 64GB</div>
						<el-progress
							:percentage="40"
							:show-text="false"
							:stroke-width="8"
							:color="progressColors"
						/>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import type { ProgressProps } from "element-plus";

// 进度条颜色
const progressColors: ProgressProps["color"] = [
	{ color: "#20bda0", percentage: 71 },
	{ color: "#f6c000", percentage: 91 },
	{ color: "#ff4136", percentage: 100 }
];
</script>

<style lang="scss" scoped>
.system-resources {
	padding: 20px;
	background-color: var(--zl-about-page-bg);
	border-radius: $zl-border-radius;
}
.system-resources-title {
	font-size: 14px;
}
.system-resources-content {
	margin-top: 20px;
	margin-bottom: -16px;
}
.system-resources-item {
	--el-card-border-radius: 8px;
	--el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, 0.08);
	margin-bottom: 16px;
	position: relative;
	min-height: 126px;
}
.system-resources-item-icon {
	position: absolute;
	top: -45px;
	right: -45px;
	color: var(--el-text-color-placeholder);
	opacity: 0.3;
}
.system-resources-item-title {
	font-size: 14px;
}
.system-resources-item-body {
	margin-top: 24px;
}
.system-resources-item-body-value {
	font-size: 20px;
	color: var(--el-text-color-secondary);
	margin-bottom: 4px;
	strong {
		font-size: 24px;
		color: var(--el-text-color-primary);
	}
}
</style>
