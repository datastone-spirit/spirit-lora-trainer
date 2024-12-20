<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:04:10
 * @LastEditTime: 2024-12-20 17:10:06
 * @LastEditors: mulingyuer
 * @Description: lora训练监控
 * @FilePath: \frontend\src\components\Monitor\LoRATrainingMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="lo-ra-training-monitor">
		<div class="lo-ra-training-monitor-head">
			<el-progress
				class="lo-ra-training-monitor-progress"
				:percentage="data.progress"
				:show-text="false"
				:stroke-width="8"
			></el-progress>
			<el-text class="lo-ra-training-monitor-round"> {{ data.current }}/{{ data.total }} </el-text>
		</div>
		<div class="lo-ra-training-monitor-body">
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">已用时长</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.elapsed }}</div>
			</div>
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">预估剩余时长</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.remaining }}</div>
			</div>
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">每步时间</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.speed }}</div>
			</div>
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">平均loss</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.loss }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { loRATrainingInfo } from "@/api/monitor";
import { sleep } from "@/utils/tools";

export interface LoRATrainingMonitorData {
	/** 当前进度 */
	current: number;
	/** 已经耗时 */
	elapsed: string;
	/** 损失 */
	loss: number;
	/** 进度 */
	progress: number;
	/** 剩余时间 */
	remaining: string;
	/** 每秒速度 */
	speed: number;
	/** 总进度 */
	total: number;
}

const data = ref<LoRATrainingMonitorData>({
	current: 0,
	elapsed: "00:00",
	loss: 0,
	progress: 0,
	remaining: "00:00",
	speed: 0,
	total: 0
});
const status = ref(false);
const sleepTime = 3000;
function update() {
	if (!status.value) return;
	loRATrainingInfo()
		.then((res) => {
			if (!res.detail) return;
			Object.assign(data.value, res.detail);
		})
		.finally(() => {
			status.value && sleep(sleepTime).then(update);
		});
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
.lo-ra-training-monitor {
	min-width: 280px;
}
.lo-ra-training-monitor-head {
	display: flex;
}
.lo-ra-training-monitor-progress {
	flex-grow: 1;
}
.lo-ra-training-monitor-round {
	flex-shrink: 0;
	margin-left: 8px;
	font-size: 12px;
	color: var(--el-text-color-primary);
}
.lo-ra-training-monitor-body {
	display: flex;
	justify-content: space-around;
	margin-top: 2px;
}
.lo-ra-training-monitor-item {
	text-align: center;
	color: var(--el-text-color-primary);
}
.lo-ra-training-monitor-item-label {
	font-size: 12px;
}
.lo-ra-training-monitor-item-value {
	font-size: 12px;
}
</style>
