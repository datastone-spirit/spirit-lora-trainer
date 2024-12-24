<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:49:22
 * @LastEditTime: 2024-12-24 09:27:44
 * @LastEditors: mulingyuer
 * @Description: 打标监控
 * @FilePath: \frontend\src\components\Monitor\TagMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="tag-monitor">
		<el-text class="tag-monitor-label"> 打标进度 </el-text>
		<el-progress
			class="tag-monitor-progress"
			:percentage="percentage"
			:show-text="false"
			:stroke-width="8"
		></el-progress>
		<el-text class="tag-monitor-round"> {{ data.current }}/{{ data.total }} </el-text>
	</div>
</template>

<script setup lang="ts">
import { manualTagInfo } from "@/api/monitor";
import { sleep } from "@/utils/tools";
import { EventBus } from "@/utils/event-bus";

export interface TagMonitorData {
	/** 当前第几个 */
	current: number;
	/** 总共多少个 */
	total: number;
}

const emits = defineEmits<{
	/** 完成 */
	complete: [];
	/** 出错 */
	failed: [];
}>();

const task_id = ref<string>("");
const data = ref<TagMonitorData>({
	current: 0,
	total: 0
});
/** 计算百分比 */
const percentage = computed(() => {
	if (data.value.total === 0) return 0;
	if (data.value.current <= 0) return 0;
	const value = Math.floor((data.value.current / data.value.total) * 100);
	return value > 100 ? 100 : value;
});
const status = ref(false);
const sleepTime = 3000;
function update() {
	if (!status.value) return;
	manualTagInfo({ task_id: task_id.value })
		.then((res) => {
			if (!res.detail) return;
			data.value.current = res.detail.current;
			data.value.total = res.detail.total;

			switch (res.status) {
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
	task_id.value = "";
	EventBus.emit("tag_complete");
	emits("complete");

	ElMessageBox({
		title: "打标完成",
		type: "success",
		showCancelButton: false,
		confirmButtonText: "知道了",
		message: "打标完成，可以开始训练LoRA了"
	});
}

/** 出错 */
function failed() {
	status.value = false;
	task_id.value = "";
	EventBus.emit("tag_failed");
	emits("failed");

	ElMessageBox({
		title: "打标失败",
		type: "error",
		showCancelButton: false,
		confirmButtonText: "知道了",
		message: "打标失败，请检查日志或者重新打标"
	});
}

/** 开始查询 */
function start({ taskId }: { taskId: string }) {
	if (typeof taskId !== "string" || taskId.trim() === "") {
		ElMessage.warning("请传递任务ID");
		return;
	}
	task_id.value = taskId;
	status.value = true;
	update();
}

/** 停止查询 */
function stop() {
	status.value = false;
}

onMounted(() => {
	EventBus.on("tag_monitor_start", start);
	EventBus.on("tag_monitor_stop", stop);
});
onUnmounted(() => {
	EventBus.off("tag_monitor_start", start);
	EventBus.off("tag_monitor_stop", stop);
});

defineExpose({
	start,
	stop
});
</script>

<style lang="scss" scoped>
.tag-monitor {
	display: flex;
	align-items: center;
	min-width: 250px;
}
.tag-monitor-label,
.tag-monitor-round {
	flex-shrink: 0;
	font-size: 12px;
	color: var(--el-text-color-primary);
}
.tag-monitor-label {
	margin-right: 8px;
}
.tag-monitor-round {
	margin-left: 8px;
}
.tag-monitor-progress {
	flex-grow: 1;
}
</style>
