<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:04:10
 * @LastEditTime: 2025-04-11 14:54:59
 * @LastEditors: mulingyuer
 * @Description: 混元训练监控
 * @FilePath: \frontend\src\components\Monitor\HYTrainingMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div v-if="monitorHYLoraData.isListen" class="lo-ra-training-monitor">
		<div v-if="isLoad" class="lo-ra-training-monitor-empty">
			<el-text> 模型加载中 </el-text>
			<el-text class="text-dot"></el-text>
		</div>
		<div v-else class="lo-ra-training-monitor-content">
			<div class="lo-ra-training-monitor-head">
				<el-progress
					class="lo-ra-training-monitor-progress"
					:percentage="loraData.progress"
					:show-text="false"
					:stroke-width="8"
				></el-progress>
				<el-text class="lo-ra-training-monitor-round">
					{{ loraData.current }}/{{ loraData.total }}
				</el-text>
			</div>
			<div class="lo-ra-training-monitor-body">
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">已用时长</div>
					<div class="lo-ra-training-monitor-item-value">
						{{ secondsToHHMMSS(loraData.elapsed) }}
					</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">预估每轮用时</div>
					<div class="lo-ra-training-monitor-item-value">
						{{ secondsToHHMMSS(loraData.epoch_elapsed) }}
					</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">预估总用时</div>
					<div class="lo-ra-training-monitor-item-value">
						{{ secondsToHHMMSS(loraData.estimate_elapsed) }}
					</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">当前loss</div>
					<div class="lo-ra-training-monitor-item-value">{{ toFixed(loraData.loss) }}</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">每轮平均loss</div>
					<div class="lo-ra-training-monitor-item-value">{{ toFixed(loraData.epoch_loss) }}</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">当前轮</div>
					<div class="lo-ra-training-monitor-item-value">{{ loraData.current_epoch }}</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">总轮数</div>
					<div class="lo-ra-training-monitor-item-value">{{ loraData.total_epoch }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { isEmptyObject, objectHasKeys, secondsToHHMMSS } from "@/utils/tools";
import { useHYLora } from "@/hooks/task/useHYLora";

const { monitorHYLoraData } = useHYLora();
const loraData = computed(() => monitorHYLoraData.value.data);
/** 是否还在加载中 */
const isLoad = computed(() => {
	const rawData = loraData.value.raw;
	if (!rawData) return true;
	const isEmpty = !rawData.detail || isEmptyObject(rawData.detail);
	const hasKey = objectHasKeys(rawData.detail, ["loss", "elapsed"]);
	return isEmpty || !hasKey;
});
// 保留5位小数，不四舍五入
function toFixed(num: number, precision = 5) {
	if (num === 0) return 0;
	return Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision);
}
</script>

<style lang="scss" scoped>
.lo-ra-training-monitor {
	height: 100%;
	display: flex;
	align-items: center;
}
.lo-ra-training-monitor-empty {
	padding: 0 $zl-padding;
	display: flex;
}
.lo-ra-training-monitor-content {
	min-width: 430px;
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
	justify-content: space-between;
	margin-top: 2px;
	gap: 10px;
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
