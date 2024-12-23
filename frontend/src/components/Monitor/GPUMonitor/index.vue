<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 14:52:03
 * @LastEditTime: 2024-12-23 15:14:30
 * @LastEditors: mulingyuer
 * @Description: 系统监控：gpu、训练轮数
 * @FilePath: \frontend\src\components\Monitor\GPUMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="gpu-monitor">
		<div class="gpu-monitor-item">
			<div class="gpu-monitor-item-label">GPU功率</div>
			<div class="gpu-monitor-item-value">{{ data.gpuPower }}%</div>
		</div>
		<div class="gpu-monitor-item">
			<div class="gpu-monitor-item-label">GPU显存</div>
			<div class="gpu-monitor-item-value">{{ data.gpuMemory }}%</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { gpuMonitorInfo } from "@/api/monitor";
import { sleep } from "@/utils/tools";

export interface SystemMonitorData {
	/** gpu功率百分比 */
	gpuPower: number;
	/** gpu显存百分比 */
	gpuMemory: number;
}

const data = ref<SystemMonitorData>({
	gpuPower: 0,
	gpuMemory: 0
});
const status = ref(false);
const sleepTime = 3000;
function update() {
	if (!status.value) return;
	gpuMonitorInfo()
		.then((res) => {
			const result = res[0];
			if (!result && status.value) {
				return sleep(sleepTime).then(update);
			}
			data.value.gpuMemory = calculatePercentage(result.memory_used_mb, result.memory_total_mb);
			data.value.gpuPower = calculatePercentage(result.power_draw_watts, result.power_total_watts);
		})
		.finally(() => {
			status.value && sleep(sleepTime).then(update);
		});
}
// 计算百分比
function calculatePercentage(current: number, total: number) {
	return Math.floor((current / total) * 100);
}

/** 开始查询 */
function start() {
	status.value = true;
	update();
}

/** 停止查询 */
function stop() {
	status.value = false;
}

defineExpose({
	start,
	stop
});
</script>

<style lang="scss" scoped>
.gpu-monitor {
	display: flex;
}
.gpu-monitor-item {
	width: 70px;
	text-align: center;
	color: var(--el-text-color-primary);
}
.gpu-monitor-item-label {
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
	padding-bottom: 2px;
	border-bottom: 1px solid var(--el-color-primary);
}
.gpu-monitor-item-value {
	padding-top: 2px;
	font-size: 16px;
}
</style>
