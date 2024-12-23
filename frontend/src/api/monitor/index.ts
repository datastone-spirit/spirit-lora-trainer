/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 15:22:03
 * @LastEditTime: 2024-12-23 15:16:06
 * @LastEditors: mulingyuer
 * @Description: 监控api
 * @FilePath: \frontend\src\api\monitor\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type {
	GPUMonitorInfoResult,
	LoRATrainingInfoParams,
	LoRATrainingInfoResult,
	ManualTagInfoParams,
	ManualTagInfoResult
} from "./types";
export type * from "./types";

/** 监控系统：GPU */
export function gpuMonitorInfo() {
	return request<GPUMonitorInfoResult>({
		url: "/training/gpu_log",
		method: "GET"
	});
}

/** 监听训练信息
 *  * 任务只能一次运行一个，所以查询的是当前任务，但是反的值不同，所以分不同的api函数表示
 */
export function loRATrainingInfo(params: LoRATrainingInfoParams) {
	return request<LoRATrainingInfoResult>({
		url: "/tasks/history",
		method: "GET",
		params
	});
}

/** 监听打标信息 */
export function manualTagInfo(params: ManualTagInfoParams) {
	return request<ManualTagInfoResult>({
		url: "/tasks/history",
		method: "GET",
		params
	});
}
