<!--
 * @Author: mulingyuer
 * @Date: 2025-01-10 11:47:24
 * @LastEditTime: 2025-04-02 17:01:29
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
					{{ data.status === "complete" ? total : data.detail.current }}
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
					{{ elapsed }}
				</el-descriptions-item>
				<el-descriptions-item label="当前loss">
					{{ data.detail.loss }}
				</el-descriptions-item>
				<el-descriptions-item label="每轮的平均 loss">
					{{ data.detail.epoch_loss }}
				</el-descriptions-item>
			</template>
			<el-descriptions-item label="查看日志" :span="2">
				<el-button type="info" @click="onShowLog"> 查看日志 </el-button>
			</el-descriptions-item>
		</el-descriptions>
		<div v-if="showLog" class="task-log">
			<TaskLog :task-id="data.id" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { HyVideoTrainingInfoResult } from "@/api/monitor";
import dayjs from "@/utils/dayjs";
import { taskStatusToName, taskTypeToName, unixFormat } from "../task.helper";

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

/** 计算耗时 */
const elapsed = computed(() => {
	if (typeof props.data.detail === "string") return "";
	if (props.data.status !== "complete") return props.data.detail.elapsed;
	const start = dayjs.unix(props.data.start_time);
	const end = dayjs.unix(props.data.end_time ?? 0);
	// 计算总的秒差
	let totalSecondsDiff = end.diff(start, "second");

	// 计算小时、分钟、秒
	const hours = Math.floor(totalSecondsDiff / 3600);
	totalSecondsDiff %= 3600;
	const minutes = Math.floor(totalSecondsDiff / 60);
	const seconds = totalSecondsDiff % 60;

	// 构造时间差字符串
	let timeDiffString = "";

	if (hours > 0) {
		timeDiffString += `${hours}:`;
	}

	if (minutes > 0 || hours > 0) {
		// 如果有小时部分，则分钟部分必须显示两位
		timeDiffString += `${minutes.toString().padStart(2, "0")}:`;
	} else if (seconds > 0) {
		// 如果没有小时和分钟部分，且有秒数，则直接显示秒数前不需要分钟的零
		timeDiffString += `0:`;
	}

	timeDiffString += seconds.toString().padStart(2, "0");

	return timeDiffString;
});

/** 查看日志 */
const showLog = ref(false);
function onShowLog() {
	showLog.value = true;
}
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
.task-log {
	margin-top: 20px;
}
</style>
