<!--
 * @Author: mulingyuer
 * @Date: 2025-08-07 16:53:50
 * @LastEditTime: 2025-08-08 16:20:27
 * @LastEditors: mulingyuer
 * @Description: gpu列表
 * @FilePath: \frontend\src\views\dashboard\components\GPUList.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="gpu-list">
		<div class="gpu-list-title">GPU监控</div>
		<el-row class="gpu-list-content" :gutter="10">
			<el-col v-for="item in 4" :key="item" :span="6">
				<el-card class="gpu-item" shadow="always">
					<div class="gpu-item-name">
						NVIDIA GeForce RTX 4090D
						<el-tag class="gpu-item-tag" type="info" effect="dark" round>GPU#0</el-tag>
					</div>
					<div class="gpu-item-temperature-power">
						<div class="temperature-power-item">
							<Icon
								class="temperature-power-item-icon temperature"
								name="ri-temp-hot-line"
								size="22"
							/>
							<div class="temperature-power-item-content">
								<div class="temperature-power-item-label">温度</div>
								<div class="temperature-power-item-value"><strong>32℃</strong></div>
							</div>
						</div>
						<div class="temperature-power-item">
							<Icon class="temperature-power-item-icon power" name="ri-flashlight-line" size="22" />
							<div class="temperature-power-item-content">
								<div class="temperature-power-item-label">功耗</div>
								<div class="temperature-power-item-value"><strong>34.2W</strong> / 425.0W</div>
							</div>
						</div>
					</div>
					<div class="gpu-item-schedule">
						<div class="schedule-item">
							<div class="schedule-item-head">
								<div class="schedule-item-label">
									<Icon class="schedule-item-icon" name="ri-ram-line" size="15" />
									显存
								</div>
								<div class="schedule-item-value"><strong>12.1GB</strong> / 24GB</div>
							</div>
							<div class="schedule-item-body">
								<el-progress
									:percentage="50"
									:show-text="false"
									:stroke-width="8"
									:color="progressColors"
								/>
							</div>
						</div>
						<div class="schedule-item">
							<div class="schedule-item-head">
								<div class="schedule-item-label">
									<Icon class="schedule-item-icon" name="ri-speed-up-line" size="15" />
									风扇
								</div>
								<div class="schedule-item-value"><strong>2000 </strong>RPM</div>
							</div>
							<div class="schedule-item-body">
								<el-progress
									:percentage="100"
									:show-text="false"
									:stroke-width="8"
									:color="progressColors"
								/>
							</div>
						</div>
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
.gpu-list {
	padding: 20px;
	background-color: var(--zl-about-page-bg);
	border-radius: $zl-border-radius;
}
.gpu-list-title {
	font-size: 14px;
}
.gpu-list-content {
	margin-top: 20px;
	margin-bottom: -10px;
}
.gpu-item {
	--el-card-border-radius: 8px;
	--el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, 0.08);
	margin-bottom: 10px;
}
.gpu-item-name {
	font-size: 14px;
	font-weight: bold;
	display: flex;
	align-items: center;
}
.gpu-item-tag {
	margin-left: 8px;
	font-weight: normal;
	--el-tag-text-color: var(--el-text-color-secondary);
	--el-tag-bg-color: var(--el-border-color-lighter);
	--el-tag-border-color: var(--el-border-color);
	--el-tag-hover-color: var(--el-text-color-secondary);
}
.gpu-item-temperature-power {
	margin-top: 15px;
	display: flex;
	.temperature-power-item {
		flex-grow: 1;
		display: flex;
		align-items: center;
	}
	.temperature-power-item-icon {
		margin-right: 9px;
		&.power {
			color: var(--el-color-warning);
		}
		&.temperature {
			color: var(--el-color-primary);
		}
	}
	.temperature-power-item-label {
		font-size: 12px;
		color: var(--el-text-color-secondary);
	}
	.temperature-power-item-value {
		margin-top: 2px;
		font-size: 12px;
		color: var(--el-text-color-secondary);
		strong {
			font-size: 15px;
			color: var(--el-text-color-primary);
		}
	}
}
.gpu-item-schedule {
	margin-top: 16px;
}
.schedule-item {
	& + & {
		margin-top: 16px;
	}
}
.schedule-item-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 12px;
}
.schedule-item-label {
	display: flex;
	align-items: center;
	color: var(--el-text-color-primary);
}
.schedule-item-icon {
	margin-right: 4px;
	color: var(--el-text-color-secondary);
}
.schedule-item-value {
	color: var(--el-text-color-secondary);
	strong {
		font-weight: normal;
		color: var(--el-text-color-primary);
	}
}
.schedule-item-body {
	margin-top: 4px;
}
</style>
