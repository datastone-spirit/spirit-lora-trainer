<!--
 * @Author: mulingyuer
 * @Date: 2025-03-27 15:14:43
 * @LastEditTime: 2025-07-30 09:39:57
 * @LastEditors: mulingyuer
 * @Description: wan训练进度条
 * @FilePath: \frontend\src\views\lora\wan-video\components\WanTrainingLoRAMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div v-if="taskInfo.type === 'wan-video'" class="wan-training-monitor">
		<div v-if="isLoad" class="wan-training-monitor-empty">
			<el-text> {{ loadText }} </el-text>
			<el-text class="text-dot"></el-text>
		</div>
		<div v-else class="wan-training-monitor-content">
			<div class="wan-training-monitor-content-head">
				<el-progress
					class="wan-training-monitor-progress"
					:percentage="taskInfo.progress"
					:show-text="false"
					:stroke-width="8"
				></el-progress>
				<el-text class="wan-training-monitor-round">
					{{ loraData.current }}/{{ loraData.total }}
				</el-text>
			</div>
			<div class="wan-training-monitor-content-body">
				<div class="wan-training-monitor-item">
					<div class="wan-training-monitor-item-label">已用时长</div>
					<div class="wan-training-monitor-item-value">
						{{ loraData.elapsed }}
					</div>
				</div>
				<div class="wan-training-monitor-item">
					<div class="wan-training-monitor-item-label">预估剩余时长</div>
					<div class="wan-training-monitor-item-value">
						{{ loraData.remaining }}
					</div>
				</div>
				<div class="wan-training-monitor-item">
					<div class="wan-training-monitor-item-label">平均loss</div>
					<div class="wan-training-monitor-item-value">
						{{ toFixed(loraData.average_loss) }}
					</div>
				</div>
				<div class="wan-training-monitor-item">
					<div class="wan-training-monitor-item-label">当前loss</div>
					<div class="wan-training-monitor-item-value">
						{{ toFixed(loraData.current_loss) }}
					</div>
				</div>
				<div class="wan-training-monitor-item">
					<div class="wan-training-monitor-item-label">总轮数</div>
					<div class="wan-training-monitor-item-value">
						{{ loraData.total_epoch }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { isEmptyObject, objectHasKeys } from "@/utils/tools";
import { useTrainingStore } from "@/stores";

const trainingStore = useTrainingStore();

const taskInfo = computed(() => trainingStore.currentTaskInfo);
const loraData = computed(() => trainingStore.trainingWanLoRAData.data);
/** 是否还在加载中 */
const isLoad = computed(() => {
	const rawData = trainingStore.trainingWanLoRAData.raw;
	if (!rawData) return true;
	if (loraData.value.phase !== "WanTrainingSubTask") return true;
	const isEmpty = !rawData.detail || isEmptyObject(rawData.detail);
	const hasKey = objectHasKeys(rawData.detail, ["current", "loss", "total"]);
	return isEmpty || !hasKey;
});
/** 加载时的提示文本 */
const loadText = computed(() => {
	const phase = loraData.value.phase ?? "none";
	switch (phase) {
		case "WanPrepareJsonlFileSubTask":
			return "准备训练数据";
		case "WanCacheLatentSubTask":
			return "正在缓存特征数据";
		case "WanTextEncoderOutputCacheSubTask":
			return "正在缓存文本编码数据";
		case "WanTrainingSubTask":
			return "即将训练模型";
		case "none":
		default:
			return "模型加载中";
	}
});

// 保留5位小数，不四舍五入
function toFixed(num: number, precision = 5) {
	if (num === 0) return 0;
	return Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision);
}
</script>

<style lang="scss" scoped>
.wan-training-monitor {
	height: 100%;
	display: flex;
	align-items: center;
}
.wan-training-monitor-empty {
	display: flex;
	justify-content: center;
}
.wan-training-monitor-content {
	min-width: 380px;
}
.wan-training-monitor-content-head {
	display: flex;
}
.wan-training-monitor-progress {
	flex-grow: 1;
}
.wan-training-monitor-round {
	flex-shrink: 0;
	margin-left: 8px;
	font-size: 12px;
	color: var(--el-text-color-primary);
}
.wan-training-monitor-content-body {
	display: flex;
	justify-content: space-between;
	margin-top: 2px;
}
.wan-training-monitor-item {
	text-align: center;
	color: var(--el-text-color-primary);
}
.wan-training-monitor-item-label {
	font-size: 12px;
}
.wan-training-monitor-item-value {
	font-size: 12px;
}
</style>
