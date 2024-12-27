<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 17:31:23
 * @LastEditTime: 2024-12-27 09:35:53
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
				<el-descriptions-item label="当前第几个">
					{{ data.detail.current }}
				</el-descriptions-item>
				<el-descriptions-item label="总图片数量">
					{{ data.detail.total }}
				</el-descriptions-item>
				<el-descriptions-item label="进度百分比">
					{{ data.detail.progress }}
				</el-descriptions-item>
				<el-descriptions-item label="已经耗时">
					{{ data.detail.elapsed }}
				</el-descriptions-item>
				<el-descriptions-item label="剩余时间">
					{{ data.detail.remaining }}
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
			</template>
		</el-descriptions>
	</div>
</template>

<script setup lang="ts">
import type { LoRATrainingInfoResult } from "@/api/monitor/types";
import { taskStatusToName, taskTypeToName, unixFormat } from "../task.helper";

export interface TaskDetailProps {
	data: LoRATrainingInfoResult;
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
