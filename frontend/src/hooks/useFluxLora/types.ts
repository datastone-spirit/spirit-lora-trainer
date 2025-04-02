/*
 * @Author: mulingyuer
 * @Date: 2025-04-02 14:21:15
 * @LastEditTime: 2025-04-02 14:23:51
 * @LastEditors: mulingyuer
 * @Description: flux lora types
 * @FilePath: \frontend\src\hooks\useFluxLora\types.ts
 * 怎么可能会有bug！！！
 */
import type { LoRATrainingInfoResult } from "@/api/monitor";

/** 查询任务的状态 */
export type QueryTaskStatus =
	| "idle" // 空闲
	| "querying" // 查询中
	| "paused" // 暂停中
	| "success" // 成功
	| "failure"; // 失败

/** wan任务信息 */
export interface QueryFluxTaskInfo {
	/** 任务id */
	taskId: string;
	/** 当前查询的状态 */
	status: QueryTaskStatus;
	/** 查询定时器 */
	timer: number | null;
	/** 查询定时器延迟（ms） */
	delay: number;
}

/** wan训练事件订阅 */
export type TrainingEvent = {
	/** 训练成功 */
	complete: void;
	/** 训练失败 */
	failed: void;
	/** 训练数据更新 */
	update: void;
};

/** 初始化wan训练参数 */
export interface InitFluxTrainingTaskOptions {
	/** API返回的任务数据 */
	taskData: LoRATrainingInfoResult;
	/** 是否显示任务开始提示 */
	showTaskStartPrompt: boolean;
}
