/*
 * @Author: mulingyuer
 * @Date: 2025-03-28 14:29:19
 * @LastEditTime: 2025-03-28 14:39:08
 * @LastEditors: mulingyuer
 * @Description: lora helper 类型声明
 * @FilePath: \frontend\src\utils\lora.helper\types.ts
 * 怎么可能会有bug！！！
 */

import type { BaseMonitorData } from "@/stores";

/** 获取当前训练的任务数据结果 */
export interface RunLoraTaskResult {
	type: TaskType;
	taskName: string;
	taskData: BaseMonitorData;
}

/** 恢复表单数据参数 */
export interface RecoveryTaskFormDataOptions {
	/** 是否开启恢复训练中的任务表单数据 */
	enableTrainingTaskDataRecovery: boolean;
	/** 是否监听 */
	isListen: boolean;
	/** 任务id */
	taskId: string;
	/** 表单数据对象 */
	formData: Record<string, any>;
	/** 是否显示恢复成功提示 */
	showRecoverySuccessTip?: boolean;
}
