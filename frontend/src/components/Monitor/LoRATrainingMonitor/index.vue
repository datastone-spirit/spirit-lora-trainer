<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:04:10
 * @LastEditTime: 2024-12-16 17:54:44
 * @LastEditors: mulingyuer
 * @Description: lora训练监控
 * @FilePath: \frontend\src\components\LoRATrainingMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="lo-ra-training-monitor">
		<div class="lo-ra-training-monitor-head">
			<el-progress
				class="lo-ra-training-monitor-progress"
				:percentage="percentage"
				:show-text="false"
				:stroke-width="8"
			></el-progress>
			<el-text class="lo-ra-training-monitor-round">
				{{ data.currentRound }}/{{ data.totalRound }}
			</el-text>
		</div>
		<div class="lo-ra-training-monitor-body">
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">已用时长</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.usedTime }}</div>
			</div>
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">预估剩余时长</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.remainingTime }}</div>
			</div>
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">每步时间</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.stepTime }}</div>
			</div>
			<div class="lo-ra-training-monitor-item">
				<div class="lo-ra-training-monitor-item-label">平均loss</div>
				<div class="lo-ra-training-monitor-item-value">{{ data.averageLoss }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
export interface LoRATrainingMonitorProps {
	data: {
		/** 当前轮数 */
		currentRound: number;
		/** 总轮数 */
		totalRound: number;
		/** 已用时长 */
		usedTime: string;
		/** 预估剩余时长 */
		remainingTime: string;
		/** 每步时间 */
		stepTime: string;
		/** 平均loss */
		averageLoss: string;
	};
}

const props = withDefaults(defineProps<LoRATrainingMonitorProps>(), {
	data: () => ({
		currentRound: 0,
		totalRound: 0,
		usedTime: "00:00:00",
		remainingTime: "00:00:00",
		stepTime: "00:00:00",
		averageLoss: "0.000"
	})
});

/** 计算百分比 */
const percentage = computed(() => {
	if (props.data.totalRound === 0) return 0;
	const value = Math.floor((props.data.currentRound / props.data.totalRound) * 100);
	return value > 100 ? 100 : value;
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
