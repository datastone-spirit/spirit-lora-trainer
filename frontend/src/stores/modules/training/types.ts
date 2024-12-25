/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:16
 * @LastEditTime: 2024-12-25 15:57:29
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据类型
 * @FilePath: \frontend\src\stores\modules\training\types.ts
 * 怎么可能会有bug！！！
 */
import type { TaskStatus } from "@/api/types";
import type { LoRATrainingInfoResult } from "@/api/monitor";

/** gpu监控信息 */
export interface GPUData {
	/** gpu功率百分比，例：20 */
	gpuPower: number;
	/** gpu显存百分比，例：20 */
	gpuMemory: number;
}

/** 打标监听信息 */
export interface TagData {
	/** 当前第几个 */
	current: number;
	/** 总共多少个 */
	total: number;
	/** 打标进度百分比，例：20 */
	percentage: number;
}

/** 打标任务状态 */
export type TagTaskStatus = TaskStatus | "none";

/** lora训练监听信息 */
export interface LoraData {
	/** 当前进度 */
	current: number;
	/** 已经耗时 */
	elapsed: string;
	/** 当前损失 */
	loss: number;
	/** 平均损失 */
	loss_avr: number;
	/** 剩余时间 */
	remaining: string;
	/** 每秒速度 */
	speed: number;
	/** 总进度 */
	total: number;
	/** 训练进度百分比,例：20 */
	progress: number;
	/** 源数据，可能为空对象 */
	raw?: LoRATrainingInfoResult;
}

/** lora训练的任务状态 */
export type LoraTaskStatus = TaskStatus | "none";
