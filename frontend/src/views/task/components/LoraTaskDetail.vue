<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 17:31:23
 * @LastEditTime: 2025-04-02 17:15:03
 * @LastEditors: mulingyuer
 * @Description: LoRA任务详情
 * @FilePath: \frontend\src\views\task\components\LoraTaskDetail.vue
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
				<el-descriptions-item label="已经耗时（s）">
					{{ elapsed }}
				</el-descriptions-item>
				<el-descriptions-item label="剩余时间">
					{{ data.status === "complete" ? "0" : data.detail.remaining }}
				</el-descriptions-item>
				<el-descriptions-item label="损失平均值">
					{{ data.detail.loss_avr }}
				</el-descriptions-item>
				<el-descriptions-item label="当前损失">
					{{ data.detail.loss }}
				</el-descriptions-item>
				<el-descriptions-item label="总计训练的图片数">
					{{ data.detail.num_train_images }}
				</el-descriptions-item>
				<el-descriptions-item label="正则化图片数量">
					{{ data.detail.num_reg_images }}
				</el-descriptions-item>
				<el-descriptions-item label="每轮的总批次数">
					{{ data.detail.num_batches_per_epoch }}
				</el-descriptions-item>
				<el-descriptions-item label="训练轮数">
					{{ data.detail.num_epochs }}
				</el-descriptions-item>
				<el-descriptions-item label="每个设备上的批次数">
					{{ data.detail.batch_size_per_device }}
				</el-descriptions-item>
				<el-descriptions-item label="多少步累计梯度">
					{{ data.detail.gradient_accumulation_steps }}
				</el-descriptions-item>
				<el-descriptions-item label="总共优化步数">
					{{ data.detail.total_optimization_steps }}
				</el-descriptions-item>
				<el-descriptions-item label="unet学习率">
					{{ data.detail.lr_unet }}
				</el-descriptions-item>
				<el-descriptions-item label="每秒速度">
					{{ data.detail.speed }}
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
		<ViewSampling v-model:open="openViewSampling" :sampling-path="samplingPath" />
	</div>
</template>

<script setup lang="ts">
import type { LoRATrainingInfoResult } from "@/api/monitor/types";
import { taskStatusToName, taskTypeToName, unixFormat } from "../task.helper";
import ViewSampling from "@/components/ViewSampling/index.vue";
import dayjs from "@/utils/dayjs";

export interface TaskDetailProps {
	data: LoRATrainingInfoResult;
}

const props = defineProps<TaskDetailProps>();

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

/** 进度百分比 */
const progress = computed(() => {
	if (props.data.status === "complete") return "100%";
	if (typeof props.data.detail === "string") return "";
	if (!props.data.detail.progress) return "";
	return `${props.data.detail.progress}%`;
});

/** 查看采样 */
const showSampling = computed(() => {
	return props.data.is_sampling ?? false;
});
const openViewSampling = ref(false);
const samplingPath = computed(() => {
	return props.data.sampling_path ?? "";
});
function onViewSampling() {
	openViewSampling.value = true;
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
