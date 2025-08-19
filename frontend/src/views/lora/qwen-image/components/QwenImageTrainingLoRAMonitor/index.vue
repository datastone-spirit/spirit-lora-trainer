<!--
 * @Author: mulingyuer
 * @Date: 2025-03-27 15:14:43
 * @LastEditTime: 2025-08-15 16:54:41
 * @LastEditors: mulingyuer
 * @Description: QwenImage训练进度条
 * @FilePath: \frontend\src\views\lora\qwen-image\components\QwenImageTrainingLoRAMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div v-if="taskInfo.type === 'qwen-image'" class="qwen-image-monitor">
		<div v-if="isLoad" class="qwen-image-monitor-empty">
			<el-text> {{ loadText }} </el-text>
			<el-text class="text-dot"></el-text>
		</div>
		<div v-else class="qwen-image-monitor-content">
			<div class="qwen-image-monitor-content-head">
				<el-progress
					class="qwen-image-monitor-progress"
					:percentage="taskInfo.progress"
					:show-text="false"
					:stroke-width="8"
				></el-progress>
				<el-text class="qwen-image-monitor-round">
					{{ loraData.current_steps }}/{{ loraData.total_steps }}
				</el-text>
			</div>
			<div class="qwen-image-monitor-content-body">
				<div class="qwen-image-monitor-item">
					<div class="qwen-image-monitor-item-label">已用时长</div>
					<div class="qwen-image-monitor-item-value">
						{{ loraData.elapsed }}
					</div>
				</div>
				<div class="qwen-image-monitor-item">
					<div class="qwen-image-monitor-item-label">预估剩余时长</div>
					<div class="qwen-image-monitor-item-value">
						{{ loraData.remaining }}
					</div>
				</div>
				<div class="qwen-image-monitor-item">
					<div class="qwen-image-monitor-item-label">平均loss</div>
					<div class="qwen-image-monitor-item-value">
						{{ toFixed(loraData.average_loss) }}
					</div>
				</div>
				<div class="qwen-image-monitor-item">
					<div class="qwen-image-monitor-item-label">当前loss</div>
					<div class="qwen-image-monitor-item-value">
						{{ toFixed(loraData.current_loss) }}
					</div>
				</div>
				<div class="qwen-image-monitor-item">
					<div class="qwen-image-monitor-item-label">速度</div>
					<div class="qwen-image-monitor-item-value">
						{{ toFixed(loraData.speed) }}
					</div>
				</div>
				<div class="qwen-image-monitor-item">
					<div class="qwen-image-monitor-item-label">总步数</div>
					<div class="qwen-image-monitor-item-value">
						{{ loraData.total_steps }}
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
const loraData = computed(() => trainingStore.trainingQwenImageLoRAData.data);
/** 是否还在加载中 */
const isLoad = computed(() => {
	const rawData = trainingStore.trainingQwenImageLoRAData.raw;
	if (!rawData) return true;
	if (loraData.value.phase !== "QwenImageTrainingSubTask") return true;
	const isEmpty = !rawData.detail || isEmptyObject(rawData.detail);
	const hasKey = objectHasKeys(rawData.detail, ["current", "loss", "total"]);
	return isEmpty || !hasKey;
});
/** 加载时的提示文本 */
const loadText = computed(() => {
	const phase = loraData.value.phase ?? "none";
	switch (phase) {
		case "QwenImageCacheLatentSubTask":
			return "正在缓存特征数据";
		case "QwenImageCacheTextEncoderOutputSubTask":
			return "正在缓存文本编码数据";
		case "QwenImageTrainingSubTask":
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
.qwen-image-monitor {
	height: 100%;
	display: flex;
	align-items: center;
}
.qwen-image-monitor-empty {
	display: flex;
	justify-content: center;
}
.qwen-image-monitor-content {
	min-width: 380px;
}
.qwen-image-monitor-content-head {
	display: flex;
}
.qwen-image-monitor-progress {
	flex-grow: 1;
}
.qwen-image-monitor-round {
	flex-shrink: 0;
	margin-left: 8px;
	font-size: 12px;
	color: var(--el-text-color-primary);
}
.qwen-image-monitor-content-body {
	display: flex;
	justify-content: space-between;
	margin-top: 2px;
}
.qwen-image-monitor-item {
	text-align: center;
	color: var(--el-text-color-primary);
}
.qwen-image-monitor-item-label {
	font-size: 12px;
}
.qwen-image-monitor-item-value {
	font-size: 12px;
}
</style>
