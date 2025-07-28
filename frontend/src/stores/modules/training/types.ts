/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:16
 * @LastEditTime: 2025-07-28 15:12:22
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
	WanVideoTrainingInfoResult,
	WanVideoTrainingPhase
} from "@/api/monitor";

/** 基础训练数据类型 */
export interface BaseTrainingItem<T = unknown, R = unknown> {
	/** 是否监听 */
	isListen: boolean;
	/** 格式化后的数据 */
	data: T;
	/** 原始数据 */
	raw: R | null;
}

/** 训练任务数据 */
export type TaskTrainingItem<T extends BaseTrainingFormatData, R = unknown> = BaseTrainingItem<
	T,
	R
>;

/** 基础训练格式化的数据类型 */
export interface BaseTrainingFormatData {
	/** 任务进度百分比，例：20 */
	progress: number;
}

/** GPU */
export type TrainingGPUData = DeepPrettify<
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

/** 打标 */
export type TrainingTagData = DeepPrettify<
	TaskTrainingItem<
		BaseTrainingFormatData & {
			/** 当前第几个 */
			current: number;
			/** 总共多少个 */
			total: number;
		},
		ManualTagInfoResult
	>
>;

/** flux lora训练 */
export type TrainingFluxLoRAData = DeepPrettify<
	TaskTrainingItem<
		BaseTrainingFormatData & {
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
			/** 是否显示查看采样 */
			showSampling: boolean;
			/** 采样文件路径，开启采样时才有值，否则是空字符串 */
			samplingPath: string;
		},
		LoRATrainingInfoResult
	>
>;

/** flux kontext lora训练 */
export type TrainingFluxKontextLoRAData = DeepPrettify<
	TaskTrainingItem<
		BaseTrainingFormatData & {
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

/** 混元视频 lora训练 */
export type TrainingHYLoRAData = DeepPrettify<
	TaskTrainingItem<
		BaseTrainingFormatData & {
			/** 当前第几个 */ current: number;
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

/** wan lora 训练 */
export type TrainingWanLoRAData = DeepPrettify<
	TaskTrainingItem<
		BaseTrainingFormatData & {
			/** 当前进度 */ current: number;
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

/** 所有训练数据 */
export interface TrainingData {
	/** gpu */
	gpu: TrainingGPUData;
	/** 打标 */
	tag: TrainingTagData;
	/** flux lora 训练 */
	flux_lora: TrainingFluxLoRAData;
	/** flux kontext lora 训练 */
	flux_kontext_lora: TrainingFluxKontextLoRAData;
	/** 混元视频 lora 训练 */
	hy_lora: TrainingHYLoRAData;
	/** wan lora 训练 */
	wan_lora: TrainingWanLoRAData;
}

/** 当前任务信息 */
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
