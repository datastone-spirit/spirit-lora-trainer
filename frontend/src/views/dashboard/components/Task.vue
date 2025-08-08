<!--
 * @Author: mulingyuer
 * @Date: 2025-08-08 15:15:05
 * @LastEditTime: 2025-08-08 15:55:09
 * @LastEditors: mulingyuer
 * @Description: 任务监控
 * @FilePath: \frontend\src\views\dashboard\components\Task.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task">
		<div class="task-title">任务监控</div>
		<div class="task-content">
			<el-table :data="tableData">
				<el-table-column prop="id" label="ID" min-width="320" />
				<el-table-column prop="type" label="任务类型" min-width="150">
					<template #default="{ row }">
						{{ taskTypeToName(row.type) }}
					</template>
				</el-table-column>
				<el-table-column prop="status" label="任务状态" min-width="150">
					<template #default="{ row }">
						<div class="task-status" :class="[row.status]">
							<div class="task-status-content">
								<Icon class="task-status-icon" :name="taskStatusToIconName(row.status)" />
								<span class="task-status-text">{{ taskStatusToName(row.status) }}</span>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="schedule" label="任务进度" min-width="200">
					<template #default="{ row }">
						<el-progress :percentage="row.schedule" />
					</template>
				</el-table-column>
				<el-table-column prop="start_time" label="开始时间" min-width="180">
					<template #default="{ row }">
						{{ formatDate(row.start_time, "YYYY-MM-DD HH:mm:ss") }}
					</template>
				</el-table-column>
				<el-table-column prop="end_time" label="预估结束时间" min-width="180">
					<template #default="{ row }">
						{{ row.end_time ? formatDate(row.end_time, "YYYY-MM-DD HH:mm:ss") : "无法预估" }}
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" min-width="100">
					<template #default="{ row }">
						<el-button size="small" :icon="RiEyeLine" round @click="onViewDetail(row)">
							查看详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon";
import { formatDate } from "@/utils/dayjs";
import { taskTypeToName, taskStatusToName, taskStatusToIconName } from "@/views/task/task.helper";

const router = useRouter();

// icon
const RiEyeLine = useIcon({ name: "ri-eye-line" });

const tableData = ref([
	{
		id: "9585510cbe584a3ebc0aa99c6027c4d8",
		type: "captioning",
		status: "running",
		schedule: 50,
		start_time: 1754638089.7696962,
		end_time: null
	},
	{
		id: "610ebccdb42f41a6b75e2dd1af8fe33b",
		type: "captioning",
		status: "running",
		schedule: 50,
		start_time: 1754638089.7696962,
		end_time: null
	}
]);

// 跳转到任务详情页
function onViewDetail(row: any) {
	router.push({ name: "TaskList", query: { taskId: row.id } });
}
</script>

<style lang="scss" scoped>
.task {
	padding: 20px;
	background-color: var(--zl-about-page-bg);
	border-radius: $zl-border-radius;
}
.task-title {
	font-size: 14px;
}
.task-content {
	margin-top: 20px;
}
.task-status {
	display: inline-block;
	vertical-align: top;
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
.task-status-content {
	display: flex;
	align-items: center;
	padding: 4px 14px;
	font-size: 12px;
	color: var(--zl-task-item-status-color);
	background-color: var(--zl-task-item-status-bg);
	border-radius: $zl-border-radius;
}
.task-status-icon {
	margin-right: 6px;
}
</style>
