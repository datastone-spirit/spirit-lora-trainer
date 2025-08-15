/*
 * @Author: mulingyuer
 * @Date: 2025-08-14 09:30:38
 * @LastEditTime: 2025-08-15 10:39:42
 * @LastEditors: mulingyuer
 * @Description: 多GPU hooks类型
 * @FilePath: \frontend\src\hooks\useMultiGPU\types.ts
 * 怎么可能会有bug！！！
 */
import type { GpuInfo } from "@/api/gpu";
import type { SimplifyDeep } from "type-fest";

/** 获取gpu信息参数 */
export interface GetGpuInfoData {
	/** 最低内存要求 */
	min_memory_required_mb: number;
}

export type FormattedGPUItem = SimplifyDeep<
	GpuInfo["gpus"][number] & {
		uuid: string;
		/** 格式化的温度文本 */
		formatted_temperature_celsius: string;
		/** 格式化的GPU使用率 */
		formatted_utilization_percent: string;
		/** 格式化功耗 */
		formatted_power_draw_watts: string;
		/** 格式化总功耗 */
		formatted_power_limit_watts: string;
		/** 是否满足使用条件 */
		is_available: boolean;
		/** 格式化gpu可用文本 */
		formatted_gpu_available_text: string;
	}
>;

/** 格式化后的GPU信息 */
export type FormattedGpuInfo = SimplifyDeep<{
	/** gpu列表 */
	gpus: Array<FormattedGPUItem>;
	/** 系统信息 */
	system_info: GpuInfo["system_info"];
	/** 总gpu数量 */
	total_gpus: GpuInfo["total_gpus"];
}>;

/** 获取gpu信息返回值 */
export type GpuInfoResult =
	| {
			data: FormattedGpuInfo;
			message: null;
	  }
	| {
			data: null;
			message: string;
	  };

/** 判断gpu是否禁用参数 */
export interface IsGpuDisabledParams {
	/** gpu信息 */
	gpuInfo: GpuInfo["gpus"][number];
	/** 最低内存要求 */
	min_memory_required_mb: number;
}
