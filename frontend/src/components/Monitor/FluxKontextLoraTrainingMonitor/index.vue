<!--
 * @Author: mulingyuer
 * @Date: 2025-07-24 15:01:26
 * @LastEditTime: 2025-07-28 14:38:34
 * @LastEditors: mulingyuer
 * @Description: flux kontext 训练监控
 * @FilePath: \frontend\src\components\Monitor\FluxKontextLoraTrainingMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div v-if="trainingStore.trainingFluxKontextLoRAData.isListen" class="lo-ra-training-monitor">
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
					<div class="lo-ra-training-monitor-item-value">{{ loraData.elapsed }}</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">每步时间</div>
					<div class="lo-ra-training-monitor-item-value">{{ loraData.speed }}</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">预估剩余时长</div>
					<div class="lo-ra-training-monitor-item-value">{{ loraData.remaining }}</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">预估总时长</div>
					<div class="lo-ra-training-monitor-item-value">
						{{ secondsToHHMMSS(loraData.totalTime) }}
					</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">当前loss</div>
					<div class="lo-ra-training-monitor-item-value">{{ toFixed(loraData.loss) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { isEmptyObject, objectHasKeys } from "@/utils/tools";
import { secondsToHHMMSS } from "@/utils/tools";
import { useTrainingStore } from "@/stores";

const trainingStore = useTrainingStore();

const loraData = computed(() => trainingStore.trainingFluxKontextLoRAData.data);
/** 是否还在加载中 */
const isLoad = computed(() => {
	const rawData = trainingStore.trainingFluxKontextLoRAData.raw;
	if (!rawData) return true;
	const isEmpty = !rawData.detail || isEmptyObject(rawData.detail);
	const hasKey = objectHasKeys(rawData.detail, ["current", "loss", "total"]);
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
	display: flex;
	justify-content: center;
}
.lo-ra-training-monitor-content {
	min-width: 350px;
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
