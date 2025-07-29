<!--
 * @Author: mulingyuer
 * @Date: 2025-07-24 15:25:30
 * @LastEditTime: 2025-07-28 16:01:04
 * @LastEditors: mulingyuer
 * @Description: flux kontext 任务详情
 * @FilePath: \frontend\src\views\task\components\FluxKontextDetail.vue
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
			<el-descriptions-item v-if="typeof data.detail === 'string'" label="失败信息">
				{{ data.detail }}
			</el-descriptions-item>
			<template v-else>
				<el-descriptions-item label="当前第几步">
					{{ data.detail.current }}
				</el-descriptions-item>
				<el-descriptions-item label="总步数">
					{{ data.detail.total }}
				</el-descriptions-item>
				<el-descriptions-item label="进度百分比">
					{{ progress }}
				</el-descriptions-item>
				<el-descriptions-item label="每步时间（s）">
					{{ data.detail.seconds_per_step }}
				</el-descriptions-item>
				<el-descriptions-item label="已经耗时">
					{{ elapsed }}
				</el-descriptions-item>
				<el-descriptions-item label="预估剩余时间">
					{{ data.status === "complete" ? "0" : data.detail.remaining_time_str }}
				</el-descriptions-item>
				<el-descriptions-item label="预估总耗时">
					{{ estimatedTotalTimeSeconds }}
				</el-descriptions-item>
				<el-descriptions-item label="当前损失">
					{{ data.detail.loss }}
				</el-descriptions-item>
				<el-descriptions-item label="总计训练的图片数">
					{{ data.detail.total_images }}
				</el-descriptions-item>
				<el-descriptions-item label="unet学习率">
					{{ data.detail.learning_rate }}
				</el-descriptions-item>
				<el-descriptions-item label="每秒速度">
					{{ data.detail.speed_str }}
				</el-descriptions-item>
				<el-descriptions-item v-show="showSampling" label="训练采样" :span="2">
					<el-button type="info" @click="onViewSampling"> 查看采样 </el-button>
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
import type { FluxKontextTrainingInfoResult } from "@/api/monitor/types";
import { taskStatusToName, taskTypeToName, unixFormat } from "../task.helper";
import dayjs from "@/utils/dayjs";
import { useModalManagerStore } from "@/stores";
import { calculatePercentage, secondsToHHMMSS } from "@/utils/tools";

export interface TaskDetailProps {
	data: FluxKontextTrainingInfoResult;
}

const modalManagerStore = useModalManagerStore();

const props = defineProps<TaskDetailProps>();

/** 计算耗时 */
const elapsed = computed(() => {
	if (typeof props.data.detail === "string") return "";
	if (props.data.status !== "complete") return props.data.detail.elapsed_time_str;
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
/** 预估总耗时 */
const estimatedTotalTimeSeconds = computed(() => {
	if (typeof props.data.detail === "string") return "";
	const value = props.data.detail?.estimated_total_time_seconds;
	if (typeof value !== "number") return "";

	return secondsToHHMMSS(value);
});

/** 进度百分比 */
const progress = computed(() => {
	if (props.data.status === "complete") return "100%";
	if (typeof props.data.detail === "string") return "";
	return `${calculatePercentage(props.data.detail.current, props.data.detail.total)}%`;
});

/** 查看采样 */
const showSampling = computed(() => {
	return props.data.is_sampling ?? false;
});
function onViewSampling() {
	modalManagerStore.setViewSamplingDrawerModal({
		open: true,
		filePath: props.data.sampling_path ?? ""
	});
}

/** 查看日志 */
const showLog = ref(false);
function onShowLog() {
	showLog.value = true;
}
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
.task-log {
	margin-top: 20px;
}
</style>
