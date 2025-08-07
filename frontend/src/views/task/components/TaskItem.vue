<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 16:10:54
 * @LastEditTime: 2025-08-07 15:50:57
 * @LastEditors: mulingyuer
 * @Description: 打标任务
 * @FilePath: \frontend\src\views\task\components\TaskItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task-item" :class="[taskTypeToClass(data.task_type), active ? 'active' : '']">
		<div class="task-item-status" :class="[data.status]">
			<Icon class="task-item-status-icon" :name="getIconName(data.status)" />
			<span class="task-item-status-text">{{ taskStatusToName(data.status) }}</span>
		</div>
		<div class="task-item-head">
			<span class="task-item-tag">{{ taskTypeToName(data.task_type) }}</span>
		</div>
		<div class="task-item-body">
			<div class="task-item-id">
				<span class="task-item-id-label">任务id：</span>
				<span class="task-item-id-value">{{ data.id }}</span>
			</div>
			<div class="task-item-time-line">
				<div class="task-item-time">任务启动时间：{{ unixFormat(data.start_time) }}</div>
				<div class="task-item-time">任务结束时间：{{ unixFormat(data.end_time) }}</div>
			</div>
		</div>
		<div class="task-item-footer"></div>
	</div>
</template>

<script setup lang="ts">
import type { TaskListResult } from "@/api/task";
import { taskTypeToName, unixFormat, taskStatusToName, taskTypeToClass } from "../task.helper";

export interface TaskItemProps {
	data: TaskListResult[number];
	active?: boolean;
	/** 下标顺序 */
	index?: number;
}

withDefaults(defineProps<TaskItemProps>(), {
	active: false
});

/** 根据状态返回对应icon name */
function getIconName(status: TaskListResult[number]["status"]) {
	switch (status) {
		case "complete":
			return "ri-check-line";
		case "failed":
			return "ri-close-line";
		case "created":
			return "ri-time-line";
		case "running":
			return "ri-play-circle-line";
		default:
			return "ri-spam-line";
	}
}
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "sass:color";

// 生成颜色
$task-base-colors: (
	item0: #d3b32d,
	item1: #20bda0,
	item2: #1aa4fa,
	item3: #8347fa,
	item4: #f16b22,
	item5: #fa6ca0
);

@each $type, $base-color in $task-base-colors {
	.task-item.#{$type} {
		--zl-task-item-type-color: #{color.adjust($base-color, $lightness: -15%)};
		--zl-task-item-type-bg: #{rgba($base-color, 0.1)};
		--zl-task-item-type-border: #{$base-color};
		--zl-task-item-active-bg: #{color.scale($base-color, $lightness: 40%)};
	}
}

.task-item {
	padding: 24px 12px;
	background-color: var(--zl-page-bg);
	border: 2px solid transparent;
	border-radius: $zl-border-radius;
	margin-bottom: $zl-padding;
	cursor: pointer;
	transition: border-color 0.2s;
	position: relative;
	&.active,
	&:active {
		border-color: var(--zl-task-item-active-bg);
	}
}
.task-item-head {
	margin-bottom: 45px;
}
.task-item-tag {
	display: inline-block;
	vertical-align: top;
	padding: 4px 8px;
	border-width: 1px;
	border-style: solid;
	border-radius: 4px;
	color: var(--zl-task-item-type-color);
	background-color: var(--zl-task-item-type-bg);
	border-color: var(--zl-task-item-type-border);
}
.task-item-body {
	color: var(--zl-task-item-color);
}
.task-item-id {
	margin-bottom: 8px;
}
.task-item-id-value {
	display: inline-block;
	padding: 4px 8px;
	background-color: var(--el-bg-color-page);
	border-radius: 4px;
	font-size: 12px;
}
.task-item-time-line {
	display: flex;
	gap: 40px;
}
.task-item-status {
	position: absolute;
	top: 24px;
	right: 12px;
	display: flex;
	align-items: center;
	padding: 8px 12px;
	font-size: 14px;
	font-weight: bold;
	color: var(--zl-task-item-status-color);
	background-color: var(--zl-task-item-status-bg);
	border-radius: $zl-border-radius;

	&.created {
		--zl-task-item-status-color: #359fc4;
		--zl-task-item-status-bg: rgba(53, 159, 196, 0.12);
	}
	&.running {
		--zl-task-item-status-color: #359fc4;
		--zl-task-item-status-bg: rgba(53, 159, 196, 0.12);
	}
	&.complete {
		--zl-task-item-status-color: #35ba61;
		--zl-task-item-status-bg: rgba(53, 186, 97, 0.12);
	}
	&.failed {
		--zl-task-item-status-color: #c14848;
		--zl-task-item-status-bg: rgba(53, 159, 196, 0.12);
	}
}

.task-item-status-icon {
	margin-right: 8px;
}
</style>
