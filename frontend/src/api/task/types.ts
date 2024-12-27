/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 17:02:02
 * @LastEditTime: 2024-12-26 16:19:34
 * @LastEditors: mulingyuer
 * @Description: 任务api类型
 * @FilePath: \frontend\src\api\task\types.ts
 * 怎么可能会有bug！！！
 */
import type { TaskStatus, TaskType } from "../types";
import type { ManualTagInfoResult, LoRATrainingInfoResult } from "@/api/monitor/types";

/** 查询当前正在运行的任务响应值 */
export interface CurrentTaskResult {
	/** 任务id */
	id: string;
	/** 任务状态 */
	status: TaskStatus;
	/** 任务类型*/
	task_type: TaskType;
	/** 任务详情，有可能是空对象 */
	detail: any;
}

/** 获取任务列表 */
export type TaskListResult = Array<ManualTagInfoResult | LoRATrainingInfoResult>;
