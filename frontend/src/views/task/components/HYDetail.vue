<!--
 * @Author: mulingyuer
 * @Date: 2025-01-10 11:47:24
 * @LastEditTime: 2025-01-14 10:22:49
 * @LastEditors: mulingyuer
 * @Description: 混元视频任务详情
 * @FilePath: \frontend\src\views\task\components\HYDetail.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="hy-detail">
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
			<el-descriptions-item v-if="typeof data.detail === 'string'" label="失败信息">
				{{ data.detail }}
			</el-descriptions-item>
			<template v-else>
				<el-descriptions-item label="当前第几步">
					{{ data.detail.current }}
				</el-descriptions-item>
				<el-descriptions-item label="预估总步数">
					{{ total }}
				</el-descriptions-item>
				<el-descriptions-item label="当前第几轮">
					{{ data.detail.current_epoch }}
				</el-descriptions-item>
				<el-descriptions-item label="预估每轮步数">
					{{ data.detail.estimate_steps_per_epoch }}
				</el-descriptions-item>
				<el-descriptions-item label="总轮数">
					{{ data.detail.total_epoch }}
				</el-descriptions-item>
				<el-descriptions-item label="已经耗时（s）">
					{{ formatSeconds(data.detail.elapsed ?? 0) }}
				</el-descriptions-item>
				<el-descriptions-item label="当前loss">
					{{ data.detail.loss }}
				</el-descriptions-item>
				<el-descriptions-item label="每轮的平均 loss">
					{{ data.detail.epoch_loss }}
				</el-descriptions-item>
			</template>
		</el-descriptions>
	</div>
</template>

<script setup lang="ts">
import type { HyVideoTrainingInfoResult } from "@/api/monitor";
import { taskStatusToName, taskTypeToName, unixFormat } from "../task.helper";
import { formatSeconds } from "@/utils/tools";

export interface HYDetailProps {
	data: HyVideoTrainingInfoResult;
}
type Detail = Exclude<HyVideoTrainingInfoResult["detail"], string>;

const props = defineProps<HYDetailProps>();

const detail = computed(() => props.data.detail);
const isFailed = computed(() => props.data.status === "failed");
/** 预估总步数 */
const total = computed(() => {
	if (isFailed.value) return "??";
	const { estimate_steps_per_epoch = 0, total_epoch = 0 } = detail.value as Detail;
	return estimate_steps_per_epoch * total_epoch;
});
</script>

<style lang="scss" scoped>
.hy-detail {
	:deep(.el-descriptions__label) {
		vertical-align: top;
	}
	:deep(.task-detail-json) {
		white-space: pre-wrap;
	}
}
</style>
