/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 15:22:03
 * @LastEditTime: 2025-03-28 11:23:15
 * @LastEditors: mulingyuer
 * @Description: 监控api
 * @FilePath: \frontend\src\api\monitor\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type {
	GPUMonitorInfoResult,
	HyVideoTrainingInfoParams,
	HyVideoTrainingInfoResult,
	LoRATrainingInfoParams,
	LoRATrainingInfoResult,
	ManualTagInfoParams,
	ManualTagInfoResult,
	WanVideoTrainingInfoParams,
	WanVideoTrainingInfoResult
} from "./types";
export type * from "./types";

/** 监控系统：GPU */
export function gpuMonitorInfo() {
	return request<GPUMonitorInfoResult>({
		url: "/training/gpu_log",
		method: "GET",
		showErrorMessage: false
	});
}

/** 监听训练信息
 *  * gpu任务只能一次运行一个，所以查询的api url是同一个，但是返回的值不同，所以分不同的api函数表示
 */
export function loRATrainingInfo(params: LoRATrainingInfoParams) {
	return request<LoRATrainingInfoResult>({
		url: "/tasks/history",
		method: "GET",
		params,
		showErrorMessage: false
	});
}

/** 监听打标信息 */
export function manualTagInfo(params: ManualTagInfoParams) {
	return request<ManualTagInfoResult>({
		url: "/tasks/history",
		method: "GET",
		params,
		showErrorMessage: false
	});
}

/** 监听混元视频训练信息 */
export function hyVideoTrainingInfo(params: HyVideoTrainingInfoParams) {
	return request<HyVideoTrainingInfoResult>({
		url: "/tasks/history",
		method: "GET",
		params,
		showErrorMessage: false
	});
}

/** 监听wan视频训练信息 */
export function wanVideoTrainingInfo(params: WanVideoTrainingInfoParams) {
	return request<WanVideoTrainingInfoResult>({
		url: "/tasks/history",
		method: "GET",
		params,
		showErrorMessage: false
	});
}
