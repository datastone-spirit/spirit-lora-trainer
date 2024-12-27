<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 17:24:19
 * @LastEditTime: 2024-12-27 09:36:07
 * @LastEditors: mulingyuer
 * @Description: 任务详情
 * @FilePath: \frontend\src\views\task\components\TagTaskDetail.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task-detail">
		<el-descriptions :title="data.id" border label-width="200px" :column="2">
			<el-descriptions-item label="任务类型">
				{{ taskTypeToName(data.task_type) }}
			</el-descriptions-item>
			<el-descriptions-item label="任务状态">
				{{ taskStatusToName(data.status) }}
			</el-descriptions-item>
			<el-descriptions-item label="开始时间">
				{{ unixFormat(data.start_time) }}
			</el-descriptions-item>
			<el-descriptions-item label="结束时间">
				{{ unixFormat(data.end_time) }}
			</el-descriptions-item>
			<el-descriptions-item label="正在打标第几张图片">
				{{ data.detail.current <= 0 ? 0 : data.detail.current }}
			</el-descriptions-item>
			<el-descriptions-item label="总共打标几张图片">
				{{ data.detail.total }}
			</el-descriptions-item>
			<el-descriptions-item label="输出目录" :span="2">{{ data.output_dir }}</el-descriptions-item>
			<el-descriptions-item label="图片素材数组" :span="2" class-name="task-detail-json">
				{{ formatJson(data.image_paths) }}
			</el-descriptions-item>
			<el-descriptions-item label="打标结果" :span="2" class-name="task-detail-json">
				{{ formatJson(data.detail.captions) }}
			</el-descriptions-item>
		</el-descriptions>
	</div>
</template>

<script setup lang="ts">
import type { ManualTagInfoResult } from "@/api/monitor/types";
import { taskTypeToName, unixFormat, taskStatusToName, formatJson } from "../task.helper";

export interface TaskDetailProps {
	data: ManualTagInfoResult;
}

defineProps<TaskDetailProps>();
</script>

<style lang="scss" scoped>
.task-detail {
	:deep(.el-descriptions__label) {
		vertical-align: top;
	}
	:deep(.task-detail-json) {
		white-space: pre-wrap;
	}
}
</style>
