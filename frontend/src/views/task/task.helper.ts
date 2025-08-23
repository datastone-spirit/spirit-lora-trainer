/*
 * @Author: mulingyuer
 * @Date: 2024-12-26 16:32:42
 * @LastEditTime: 2025-08-15 14:41:04
 * @LastEditors: mulingyuer
 * @Description: task帮助
 * @FilePath: \frontend\src\views\task\task.helper.ts
 * 怎么可能会有bug！！！
 */

import type { TaskStatus } from "@/api/types";
import { TaskType } from "@/api/types";
import { formatDate } from "@/utils/dayjs";

/** 根据任务类型返回中文名称 */
export function taskTypeToName(taskType: TaskType) {
	switch (taskType) {
		case TaskType.CAPTIONING:
			return "打标任务";
		case TaskType.TRAINING:
			return "Flux 训练";
		case TaskType.HUNYUAN_TRAINING:
			return "混元视频训练";
		case TaskType.WAN_TRAINING:
			return "wan视频训练";
		case TaskType.FLUX_KONTEXT_TRAINING:
			return "Flux Kontext 训练";
		case TaskType.QWENIMAGE_TRAINING:
			return "Qwen Image 训练";
		default:
			return "未知任务";
	}
}

/** 根据任务状态返回中文名称 */
export function taskStatusToName(taskStatus: TaskStatus) {
	switch (taskStatus) {
		case "created":
			return "正在启动";
		case "running":
			return "正在运行";
		case "failed":
			return "任务失败";
		case "complete":
			return "任务完成";
		default:
			return "未知状态";
	}
}

/** Unix时间戳格式化：1735182183.3355355 => 2024-12-26 11:03:03 */
export function unixFormat(timestamp: number | null, placeholder = "任务还未结束") {
	if (!timestamp) return placeholder;
	return formatDate(Math.floor(timestamp * 1000), "YYYY-MM-DD HH:mm:ss");
}

/** 格式化json字符串，让其更好阅读 */
export function formatJson(obj: object) {
	return JSON.stringify(obj, null, 2);
}

/** 根据任务类型返回item的class
 *  一共item0-5的class
 */
export function taskTypeToClass(taskType: TaskType) {
	switch (taskType) {
		case TaskType.CAPTIONING:
			return "item0";
		case TaskType.TRAINING:
			return "item1";
		case TaskType.HUNYUAN_TRAINING:
			return "item2";
		case TaskType.WAN_TRAINING:
			return "item3";
		case TaskType.FLUX_KONTEXT_TRAINING:
			return "item4";
		case TaskType.QWENIMAGE_TRAINING:
			return "item5";
		default:
			return "item0";
	}
}
