<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 14:52:03
 * @LastEditTime: 2024-12-16 17:26:19
 * @LastEditors: mulingyuer
 * @Description: 系统监控：gpu、训练轮数
 * @FilePath: \frontend\src\components\SystemMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="system-monitor">
		<div class="system-monitor-item">
			<div class="system-monitor-item-label">GPU占用</div>
			<div class="system-monitor-item-value">{{ data.gpuUsage }}%</div>
		</div>
		<div class="system-monitor-item">
			<div class="system-monitor-item-label">GPU功率</div>
			<div class="system-monitor-item-value">{{ data.gpuPower }}%</div>
		</div>
		<div class="system-monitor-item">
			<div class="system-monitor-item-label">GPU显存</div>
			<div class="system-monitor-item-value">{{ data.gpuMemory }}%</div>
		</div>
	</div>
</template>

<script setup lang="ts">
export interface SystemMonitorProps {
	data: {
		/** gpu占用百分比 */
		gpuUsage: number;
		/** gpu功率百分比 */
		gpuPower: number;
		/** gpu显存百分比 */
		gpuMemory: number;
	};
}

withDefaults(defineProps<SystemMonitorProps>(), {
	data: () => ({
		gpuUsage: 0,
		gpuPower: 0,
		gpuMemory: 0
	})
});
</script>

<style lang="scss" scoped>
.system-monitor {
	display: flex;
}
.system-monitor-item {
	width: 70px;
	text-align: center;
	color: var(--el-text-color-primary);
}
.system-monitor-item-label {
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
	padding-bottom: 2px;
	border-bottom: 1px solid var(--el-color-primary);
}
.system-monitor-item-value {
	padding-top: 2px;
	font-size: 16px;
}
</style>
