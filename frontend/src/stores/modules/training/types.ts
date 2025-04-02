/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:16
 * @LastEditTime: 2025-04-02 15:31:20
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据类型
 * @FilePath: \frontend\src\stores\modules\training\types.ts
 * 怎么可能会有bug！！！
 */
import type {
	GPUMonitorInfoResult,
	HyVideoTrainingInfoResult,
	LoRATrainingInfoResult,
	WanVideoTrainingInfoResult,
	WanVideoTrainingPhase
} from "@/api/monitor";

/** GPU数据 */
export interface GPUData {
	/** gpu功率百分比，例：20 */
	gpuPower: number;
	/** gpu显存百分比，例：20 */
	gpuMemory: number;
	/** gpu列表信息 */
	gpuList: GPUMonitorInfoResult;
}

/** 监听GPU信息数据 */
export interface MonitorGPUData {
	/** 是否监听 */
	isListen: boolean;
	/** gpu数据 */
	data: GPUData;
}

/** 监听任务的基础数据类型 */
export interface BaseMonitorData {
	/** 任务进度百分比，例：20 */
	progress: number;
}

/** 打标数据 */
export interface TagData extends BaseMonitorData {
	/** 当前第几个 */
	current: number;
	/** 总共多少个 */
	total: number;
}

/** 监听打标数据 */
export interface MonitorTagData {
	/** 是否监听 */
	isListen: boolean;
	/** 打标数据 */
	data: TagData;
}

/** flux lora训练数据 */
export interface FluxLoraData extends BaseMonitorData {
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
	/** 源数据，可能为空对象 */
	raw?: LoRATrainingInfoResult;
}

/** 监听flux lora训练数据 */
export interface MonitorFluxLoraData {
	/** 是否监听 */
	isListen: boolean;
	/** lora数据 */
	data: FluxLoraData;
}

/** 混元视频 lora训练数据 */
export interface HYLoraData extends BaseMonitorData {
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
	/** 源数据，可能为空对象 */
	raw?: HyVideoTrainingInfoResult;
}

/** 监听混元视频 lora训练 */
export interface MonitorHYLoraData {
	/** 是否监听 */
	isListen: boolean;
	/** lora数据 */
	data: HYLoraData;
}

/** wan lora训练数据 */
export interface WanLoraData extends BaseMonitorData {
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
	/** 当前轮 */
	current_epoch: number | string;
	/** 总轮数 */
	total_epoch: number | string;
	/** 是否显示查看采样 */
	showSampling: boolean;
	/** 采样文件路径，开启采样时才有值，否则是空字符串 */
	samplingPath: string;
	/** 训练阶段 */
	phase: WanVideoTrainingPhase;
	/** 源数据，可能为空对象 */
	raw?: WanVideoTrainingInfoResult;
}

/** 监听打标数据 */
export interface MonitorWanLoraData {
	/** 是否监听 */
	isListen: boolean;
	/** 打标数据 */
	data: WanLoraData;
}
