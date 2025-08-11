<!--
 * @Author: mulingyuer
 * @Date: 2025-04-02 15:55:35
 * @LastEditTime: 2025-08-11 10:10:14
 * @LastEditors: mulingyuer
 * @Description: 任务日志组件
 * @FilePath: \frontend\src\components\TaskLog\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task-log" :class="{ 'full-screen': isFullScreen }" v-loading="loading">
		<div class="task-log-head">
			<el-space :size="8">
				<el-button
					class="task-log-polling-btn"
					:class="{ polling: isPolling }"
					type="default"
					:icon="isPolling ? RiStopCircleLine : RiPlayCircleLine"
					@click="onTogglePolling"
				>
					{{ isPolling ? "停止轮询" : "开始轮询" }}
				</el-button>
				<el-button type="default" :icon="RiRefreshLine" @click="onRefresh"></el-button>
				<el-button
					type="default"
					:icon="isFullScreen ? RiFullscreenExitLine : RiFullscreenLine"
					@click="onFullScreen"
				></el-button>
			</el-space>
			<el-space :size="8">
				<el-button type="primary" :icon="RiDownloadLine" @click="onDownload">下载日志</el-button>
			</el-space>
		</div>
		<div
			ref="taskLogContentWrapperRef"
			class="task-log-content-wrapper"
			:style="{ maxHeight: isFullScreen ? 'none' : maxHeight }"
		>
			<div class="task-log-content" v-html="logHtml"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { taskLog } from "@/api/task";
import type { TaskLogResult } from "@/api/task";
import { useIcon } from "@/hooks/useIcon";
import { downloadFile } from "@/utils/tools";
import { formatDate } from "@/utils/dayjs";
import type { ScrollbarProps } from "element-plus";

export interface TaskLogProps {
	/** 任务id */
	taskId: string;
	/** 最大滚动高度 */
	maxHeight?: ScrollbarProps["maxHeight"];
}

const props = withDefaults(defineProps<TaskLogProps>(), {
	maxHeight: "500px"
});

// icon
const RiDownloadLine = useIcon({ name: "ri-download-line" });
const RiRefreshLine = useIcon({ name: "ri-refresh-line" });
const RiFullscreenLine = useIcon({ name: "ri-fullscreen-line" });
const RiFullscreenExitLine = useIcon({ name: "ri-fullscreen-exit-line" });
const RiPlayCircleLine = useIcon({ name: "ri-play-circle-line" });
const RiStopCircleLine = useIcon({ name: "ri-stop-circle-line" });

const loading = ref(false);
const logList = ref<TaskLogResult>([]);
const logHtml = ref("");
const isFullScreen = ref(false);
const taskLogContentWrapperRef = ref<HTMLDivElement>();

/** 获取任务日志 */
async function getTaskLog() {
	if (loading.value) return; // 防止重复请求
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

/** 全屏 */
function onFullScreen() {
	isFullScreen.value = !isFullScreen.value;
}

/** 轮询 */
const POLLING_TIME = 5000;
const {
	isActive: isPolling,
	pause,
	resume
} = useTimeoutPoll(
	async () => {
		await getTaskLog();
		if (taskLogContentWrapperRef.value) {
			taskLogContentWrapperRef.value.scrollTo({
				top: taskLogContentWrapperRef.value.scrollHeight,
				behavior: "smooth"
			});
		}
	},
	POLLING_TIME,
	{ immediate: false }
);
function onTogglePolling() {
	if (isPolling.value) {
		pause();
	} else {
		resume();
	}
}

onMounted(() => {
	if (typeof props.taskId !== "string" || props.taskId.trim() === "") return;
	if (isPolling.value) {
		resume();
	} else {
		getTaskLog();
	}
});

onUnmounted(() => {
	if (isPolling.value) {
		pause();
	}
});
</script>

<style lang="scss" scoped>
.task-log.full-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	margin: 0;
	z-index: 9999;
	background-color: var(--zl-page-bg);
	display: flex;
	flex-direction: column;
	padding: 8px;
}
.task-log-head {
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6px;
}
.task-log-content-wrapper {
	flex-grow: 1;
	min-height: 1px;
	background-color: var(--el-bg-color-page);
	font-size: 14px;
	color: var(--el-text-color);
	line-height: 1.5;
	overflow: auto;
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
.task-log-polling-btn {
	--zl-task-log-polling-btn-icon-color: var(--el-color-primary);
	&.polling {
		--zl-task-log-polling-btn-icon-color: var(--el-color-danger);
	}
	:deep(.el-icon) {
		color: var(--zl-task-log-polling-btn-icon-color);
	}
}
</style>
