<!--
 * @Author: mulingyuer
 * @Date: 2025-04-02 15:55:35
 * @LastEditTime: 2025-04-03 16:10:15
 * @LastEditors: mulingyuer
 * @Description: 任务日志组件
 * @FilePath: \frontend\src\components\TaskLog\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task-log" v-loading="loading">
		<div class="task-log-head">
			<el-button-group size="small">
				<el-button type="default" :icon="RiRefreshLine" @click="onRefresh"></el-button>
			</el-button-group>
			<el-button-group size="small">
				<el-button type="default" :icon="RiDownload_2Line" @click="onDownload">下载日志</el-button>
			</el-button-group>
		</div>
		<el-scrollbar class="task-log-scrollbar" max-height="500px">
			<div class="task-log-content-wrapper">
				<div class="task-log-content" v-html="logHtml"></div>
			</div>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { taskLog } from "@/api/task";
import type { TaskLogResult } from "@/api/task";
import { useIcon } from "@/hooks/useIcon";
import { downloadFile } from "@/utils/tools";
import { formatDate } from "@/utils/dayjs";

export interface TaskLogProps {
	/** 任务id */
	taskId: string;
}

const props = defineProps<TaskLogProps>();

const loading = ref(false);
const logList = ref<TaskLogResult>([]);
const logHtml = ref("");
const RiDownload_2Line = useIcon({ name: "ri-download-2-line", size: 12 });
const RiRefreshLine = useIcon({ name: "ri-refresh-line", size: 12 });

/** 获取任务日志 */
function getTaskLog() {
	loading.value = true;
	return taskLog({ task_id: props.taskId })
		.then((res) => {
			logList.value = res;
			logHtml.value = logToHtml(res);
		})
		.catch(() => {})
		.finally(() => {
			loading.value = false;
		});
}

/** 将日志转换成html */
function logToHtml(list: TaskLogResult) {
	let html = "<ul class='task-log-list'>";
	list.forEach((log) => (html += `<li class="task-log-item">${log}</li>`));
	html += "</ul>";

	return html;
}

/** 刷新 */
function onRefresh() {
	if (typeof props.taskId !== "string" || props.taskId.trim() === "") return;
	getTaskLog().then(() => {
		ElMessage.success("刷新成功");
	});
}

/** 下载 */
function onDownload() {
	const text = logList.value.join("\n");
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	downloadFile(url, `task_log_${formatDate(new Date(), "YYYY-MM-DD HH:mm:ss")}`);
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 2000);
}

watch(
	() => props.taskId,
	() => {
		if (typeof props.taskId !== "string" || props.taskId.trim() === "") return;
		getTaskLog();
	},
	{ immediate: true }
);
</script>

<style lang="scss" scoped>
.task-log-content-wrapper {
	background-color: var(--el-bg-color-page);
	font-size: 14px;
	color: var(--el-text-color);
	line-height: 1.5;
}
.task-log-head {
	margin-bottom: 6px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.task-log-content {
	min-height: 150px;
	padding: 10px;
	white-space: pre-wrap;
	word-wrap: break-word;
	:deep(.task-log-list) {
		list-style: none;
	}
	:deep(.task-log-item) {
		margin-bottom: 4px;
	}
}
</style>
