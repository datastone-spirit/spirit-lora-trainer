<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 16:10:54
 * @LastEditTime: 2025-04-02 09:28:44
 * @LastEditors: mulingyuer
 * @Description: 打标任务
 * @FilePath: \frontend\src\views\task\components\TaskItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task-item" :class="[taskTypeToClass(data.task_type), active ? 'active' : '']">
		<div class="task-item-head">
			<span class="task-item-tag">{{ taskTypeToName(data.task_type) }}</span>
		</div>
		<div class="task-item-body">
			<div class="task-item-id">任务id：{{ data.id }}</div>
			<div class="task-item-time">任务启动时间：{{ unixFormat(data.start_time) }}</div>
			<div class="task-item-time">任务结束时间：{{ unixFormat(data.end_time) }}</div>
		</div>
		<div class="task-item-footer">
			<div class="task-item-status" :class="[data.status]">{{ taskStatusToName(data.status) }}</div>
		</div>
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
</script>

<style lang="scss" scoped>
@use "sass:map";

.task-item {
	padding: 24px;
	background-color: var(--zl-page-bg);
	border-radius: $zl-border-radius;
	margin-bottom: $zl-padding;
	cursor: pointer;
	transition: background-color 0.2s;
}
.task-item-head {
	margin-bottom: 12px;
}
.task-item-tag {
	display: inline-block;
	vertical-align: top;
	padding: 4px 8px;
	border-width: 1px;
	border-style: solid;
	border-radius: 4px;
}
.task-item-body {
	color: var(--zl-task-item-color);
}
.task-item-id {
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 12px;
}
.task-item-time {
	font-size: 16px;
	& + & {
		margin-top: 4px;
	}
}
.task-item-footer {
	margin-top: 8px;
	text-align: right;
	color: var(--zl-task-item-color);
}
.task-item-status {
	font-size: 12px;
	font-weight: bold;
	display: inline-flex;
	align-items: center;
	&::before {
		content: "";
		display: inline-block;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		margin-right: 12px;
		border: 1px solid transparent;
	}
}
// 颜色
$task-item-colors: (
	item0: (
		text: #a78c1c,
		bg: rgba(211, 179, 45, 0.2),
		border: #d3b32d
	),
	item1: (
		text: #1a8a6f,
		bg: rgba(32, 189, 160, 0.2),
		border: #20bda0
	),
	item2: (
		text: #2188c8,
		bg: rgba(26, 164, 250, 0.2),
		border: #1aa4fa
	),
	item3: (
		text: #651afa,
		bg: rgba(101, 26, 250, 0.2),
		border: #8347fa
	),
	item4: (
		text: #c7561a,
		bg: rgba(199, 86, 26, 0.2),
		border: #f16b22
	),
	item5: (
		text: #f3377c,
		bg: rgba(243, 55, 124, 0.2),
		border: #fa6ca0
	)
);
@each $type, $colors in $task-item-colors {
	.task-item.#{$type} {
		.task-item-tag {
			color: map.get($colors, text);
			background-color: map.get($colors, bg);
			border-color: map.get($colors, border);
		}
		&.active,
		&:active {
			background-color: map.get($colors, bg);
		}
	}
}
// .task-item.captioning {
// 	.task-item-tag {
// 		color: #a78c1c;
// 		background-color: rgba(211, 179, 45, 0.2);
// 		border-color: #d3b32d;
// 	}
// 	&.active,
// 	&:active {
// 		background-color: rgba(211, 179, 45, 0.2);
// 	}
// }
// .task-item.training {
// 	.task-item-tag {
// 		color: #1a8a6f;
// 		background-color: rgba(32, 189, 160, 0.2);
// 		border-color: #20bda0;
// 	}
// 	&.active,
// 	&:active {
// 		background-color: rgba(32, 189, 160, 0.2);
// 	}
// }
// .task-item.hunyuan_training {
// 	.task-item-tag {
// 		color: #2188c8;
// 		background-color: rgba(26, 164, 250, 0.2);
// 		border-color: #1aa4fa;
// 	}
// 	&.active,
// 	&:active {
// 		background-color: rgba(26, 164, 250, 0.2);
// 	}
// }
.task-item-status.running::before {
	background-color: #35ba61;
}
.task-item-status.created::before {
	background-color: transparent;
	border-color: #35ba61;
}
.task-item-status.complete::before {
	background-color: #359fc4;
}
.task-item-status.failed::before {
	background-color: #c14848;
}
</style>
