/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:16
 * @LastEditTime: 2025-08-15 16:52:54
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据类型
 * @FilePath: \frontend\src\stores\modules\training\types.ts
 * 怎么可能会有bug！！！
 */
import type {
	FluxKontextTrainingInfoResult,
	GPUMonitorInfoResult,
	HyVideoTrainingInfoResult,
	LoRATrainingInfoResult,
	ManualTagInfoResult,
	QwenImageTrainingInfoResult,
	QwenImageTrainingPhase,
	WanVideoTrainingInfoResult,
	WanVideoTrainingPhase
} from "@/api/monitor";
import type { SimplifyDeep } from "type-fest";

/** 当前任务信息
 * 任务相关的具体数据因为格式不同，所以单独定义
 */
export interface CurrentTaskInfo {
	/** 任务id */
	id: string;
	/** 任务类型 */
	type: TaskType;
	/** 任务名称 */
	name: string;
	/** 任务进度百分比，例：20 */
	progress: number;
}

/** 设置当前任务信息参数 */
export type SetCurrentTaskInfoData = SimplifyDeep<
	Omit<CurrentTaskInfo, "progress"> & {
		/** API返回的任务数据 */
		result?: unknown;
	}
>;

/** 重置当前任务信息参数 */
export type ResetCurrentTaskInfoData = Pick<CurrentTaskInfo, "type">;

/** 基础训练数据 */
export interface BaseTrainingItem<T = unknown, R = unknown> {
	/** 格式化后的数据 */
	data: T;
	/** 原始数据 */
	raw: R | null;
}

/** 训练数据 - gpu */
export type TrainingGPUData = SimplifyDeep<
	BaseTrainingItem<
		{
			/** gpu功率百分比，例：20 */
			gpuPower: number;
			/** gpu显存百分比，例：20 */
			gpuMemory: number;
			/** gpu列表信息 */
			gpuList: GPUMonitorInfoResult;
		},
		GPUMonitorInfoResult
	>
>;

/** 训练数据 - 打标 */
export type TrainingTagData = SimplifyDeep<
	BaseTrainingItem<
		{
			/** 当前第几个 */
			current: number;
			/** 总共多少个 */
			total: number;
		},
		ManualTagInfoResult
	>
>;

/** 训练数据 - flux lora */
export type TrainingFluxLoRAData = SimplifyDeep<
	BaseTrainingItem<
		{
			/** 当前进度 */ current: number;
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
			/** 是否显示查看采样 */
			showSampling: boolean;
			/** 采样文件路径，开启采样时才有值，否则是空字符串 */
			samplingPath: string;
		},
		LoRATrainingInfoResult
	>
>;

/** 训练数据 - flux kontext lora */
export type TrainingFluxKontextLoRAData = SimplifyDeep<
	BaseTrainingItem<
		{
			/** 当前进度 */
			current: number;
			/** 已经耗时 */
			elapsed: string;
			/** 当前损失 */
			loss: number;
			/** 剩余时间 */
			remaining: string;
			/** 每秒速度 */
			speed: number;
			/** 总进度 */
			total: number;
			/** 是否显示查看采样 */
			showSampling: boolean;
			/** 采样文件路径，开启采样时才有值，否则是空字符串 */
			samplingPath: string;
			/** 预估总时长 s */
			totalTime: number;
		},
		FluxKontextTrainingInfoResult
	>
>;

/** 训练数据 - 混元视频 lora */
export type TrainingHYLoRAData = SimplifyDeep<
	BaseTrainingItem<
		{
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
			/** 当前轮 */
			current_epoch: number | string;
			/** 总轮数 */
			total_epoch: number | string;
		},
		HyVideoTrainingInfoResult
	>
>;

/** 训练数据 - wan lora */
export type TrainingWanLoRAData = SimplifyDeep<
	BaseTrainingItem<
		{
			/** 当前进度 */
			current: number;
			/** 总进度 */
			total: number;
			/** 已用时长 */
			elapsed: string;
			/** 预估剩余时长 */
			remaining: string | number;
			/** 当前loss */
			current_loss: number;
			/** 平均loss */
			average_loss: number;
			/** 总轮数 */
			total_epoch: number | string;
			/** 是否显示查看采样 */
			showSampling: boolean;
			/** 采样文件路径，开启采样时才有值，否则是空字符串 */
			samplingPath: string;
			/** 训练阶段 */
			phase: WanVideoTrainingPhase;
		},
		WanVideoTrainingInfoResult
	>
>;

/** 训练数据 - qwen image */
export type TrainingQwenImageData = SimplifyDeep<
	BaseTrainingItem<
		{
			/** 当前步数 */
			current_steps: number;
			/** 已用时长 */
			elapsed: string;
			/** 预估剩余时长 */
			remaining: string | number;
			/** 当前loss */
			current_loss: number;
			/** 平均loss */
			average_loss: number;
			/** 每秒速度 */
			speed: number;
			/** 总步数 */
			total_steps: number;
			/** 是否显示查看采样 */
			showSampling: boolean;
			/** 采样文件路径，开启采样时才有值，否则是空字符串 */
			samplingPath: string;
			/** 训练阶段 */
			phase: QwenImageTrainingPhase;
		},
		QwenImageTrainingInfoResult
	>
>;
