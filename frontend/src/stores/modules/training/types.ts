/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:16
 * @LastEditTime: 2025-01-13 17:40:09
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据类型
 * @FilePath: \frontend\src\stores\modules\training\types.ts
 * 怎么可能会有bug！！！
 */
import type { TaskStatus } from "@/api/types";
import type { HyVideoTrainingInfoResult, LoRATrainingInfoResult } from "@/api/monitor";

/** GPU数据 */
export interface GPUData {
	/** gpu功率百分比，例：20 */
	gpuPower: number;
	/** gpu显存百分比，例：20 */
	gpuMemory: number;
}

/** 监听GPU信息数据 */
export interface MonitorGPUData {
	/** 是否监听 */
	isListen: boolean;
	/** 监听间隔 */
	sleepTime: number;
	/** 是否在轮询 */
	isPolling: boolean;
	/** gpu数据 */
	data: GPUData;
}

/** 打标数据 */
export interface TagData {
	/** 当前第几个 */
	current: number;
	/** 总共多少个 */
	total: number;
	/** 打标进度百分比，例：20 */
	percentage: number;
}

/** 监听打标数据 */
export interface MonitorTagData {
	/** 是否监听 */
	isListen: boolean;
	/** 任务id */
	taskId: string;
	/** 任务状态 */
	taskStatus: TaskStatus | "none";
	/** 监听间隔 */
	sleepTime: number;
	/** 是否在轮询 */
	isPolling: boolean;
	/** 打标数据 */
	data: TagData;
}

/** 监听flux lora训练数据 */
export interface MonitorFluxLoraData {
	/** 是否监听 */
	isListen: boolean;
	/** 任务id */
	taskId: string;
	/** 任务状态 */
	taskStatus: TaskStatus | "none";
	/** 监听间隔 */
	sleepTime: number;
	/** 是否在轮询 */
	isPolling: boolean;
	/** lora数据 */
	data: {
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
	};
}

/** 监听混元视频 lora训练 */
export interface MonitorHYLoraData {
	/** 是否监听 */
	isListen: boolean;
	/** 任务id */
	taskId: string;
	/** 任务状态 */
	taskStatus: TaskStatus | "none";
	/** 监听间隔 */
	sleepTime: number;
	/** 是否在轮询 */
	isPolling: boolean;
	/** lora数据 */
	data: {
		/** 当前第几个 */
		current: number;
		/** 总图片数量 */
		total: number | string;
		/** 已经耗时 */
		elapsed: number;
		/** 当前损失 */
		loss: number;
		/** 每轮的平均 loss */
		epoch_loss: number;
		/** 每轮用时：elapsed / current_epoch */
		epoch_elapsed: number;
		/** 预估总用时 */
		estimate_elapsed: number;
		/** 训练进度百分比,例：20 */
		progress: number;
		/** 源数据，可能为空对象 */
		raw?: HyVideoTrainingInfoResult;
	};
}
