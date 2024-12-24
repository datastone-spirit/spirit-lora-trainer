<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:04:10
 * @LastEditTime: 2024-12-23 17:49:06
 * @LastEditors: mulingyuer
 * @Description: lora训练监控
 * @FilePath: \frontend\src\components\Monitor\LoRATrainingMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="lo-ra-training-monitor">
		<div v-if="isLoad" class="lo-ra-training-monitor-empty">
			<el-text> 模型加载中 </el-text>
			<el-text class="text-dot"></el-text>
		</div>
		<div v-else class="lo-ra-training-monitor-content">
			<div class="lo-ra-training-monitor-head">
				<el-progress
					class="lo-ra-training-monitor-progress"
					:percentage="progress"
					:show-text="false"
					:stroke-width="8"
				></el-progress>
				<el-text class="lo-ra-training-monitor-round">
					{{ data.current }}/{{ data.total }}
				</el-text>
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
					<div class="lo-ra-training-monitor-item-value">{{ toFixed(data.loss_avr) }}</div>
				</div>
				<div class="lo-ra-training-monitor-item">
					<div class="lo-ra-training-monitor-item-label">当前loss</div>
					<div class="lo-ra-training-monitor-item-value">{{ toFixed(data.loss) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { loRATrainingInfo } from "@/api/monitor";
import type { LoRATrainingInfoResult } from "@/api/monitor";
import { isEmptyObject, objectHasKeys, sleep } from "@/utils/tools";
import { EventBus } from "@/utils/event-bus";

export interface LoRATrainingMonitorData {
	/** 当前进度 */
	current: number;
	/** 已经耗时 */
	elapsed: string;
	/** 当前损失 */
	loss: number;
	/** 平均损失 */
	loss_avr: number;
	/** 剩余时间 */
	remaining: string;
	/** 每秒速度 */
	speed: number;
	/** 总进度 */
	total: number;
}

const emits = defineEmits<{
	/** 完成 */
	complete: [];
	/** 出错 */
	failed: [];
}>();

const task_id = ref<string>("");
const data = ref<LoRATrainingMonitorData>({
	current: 0,
	elapsed: "00:00",
	loss: 0,
	loss_avr: 0,
	remaining: "00:00",
	speed: 0,
	total: 0
});
const progress = computed(() => {
	if (data.value.total === 0) return 0;
	return Math.floor((data.value.current / data.value.total) * 100);
});
const rawData = ref<LoRATrainingInfoResult | null>(null);
const isLoad = computed(() => {
	if (!rawData.value) return true;
	const isEmpty = !rawData.value.detail || isEmptyObject(rawData.value.detail);
	const hasKey = objectHasKeys(rawData.value.detail, ["current", "loss", "total"]);
	return isEmpty || !hasKey;
});
// 保留5位小数，不四舍五入
function toFixed(num: number, precision = 5) {
	if (num === 0) return 0;
	return Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

const status = ref(false);
const sleepTime = 3000;
function update() {
	if (!status.value) return;
	loRATrainingInfo({
		task_id: task_id.value
	})
		.then((res) => {
			rawData.value = res;
			const detail = res.detail;
			if (!detail) return;
			if (isEmptyObject(detail)) return;
			data.value.current = detail.current ?? 0;
			data.value.elapsed = detail.elapsed ?? "00:00";
			data.value.loss = detail.loss ?? 0;
			data.value.loss_avr = detail.loss_avr ?? 0;
			data.value.remaining = detail.remaining ?? "00:00";
			data.value.speed = detail.speed ?? 0;
			data.value.total = detail.total ?? 0;

			switch (res.status) {
				case "running": // 进行中
					break;
				case "complete": // 完成
					complete();
					break;
				case "failed": // 出错
					failed();
					break;
			}
		})
		.finally(() => {
			status.value && sleep(sleepTime).then(update);
		});
}

/** 完成 */
function complete() {
	status.value = false;
	rawData.value = null;
	task_id.value = "";
	EventBus.emit("lora_train_complete");
	emits("complete");
}

/** 出错 */
function failed() {
	status.value = false;
	rawData.value = null;
	task_id.value = "";
	EventBus.emit("lora_train_failed");
	emits("failed");
}

/** 开始查询 */
function start({ taskId }: { taskId: string }) {
	if (typeof taskId !== "string" || taskId.trim() === "") {
		ElMessage.warning("请传递任务ID");
		return;
	}
	task_id.value = taskId;
	status.value = true;
	rawData.value = null;
	update();
}

/** 停止查询 */
function stop() {
	status.value = false;
	rawData.value = null;
	task_id.value = "";
}

onMounted(() => {
	EventBus.on("lora_monitor_train_start", start);
	EventBus.on("lora_monitor_train_stop", stop);
});
onUnmounted(() => {
	EventBus.off("lora_monitor_train_start", start);
	EventBus.off("lora_monitor_train_stop", stop);
});

defineExpose({
	start,
	stop
});
</script>

<style lang="scss" scoped>
// .lo-ra-training-monitor {
// }
.lo-ra-training-monitor-empty {
	padding: 0 $zl-padding;
	display: flex;
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
