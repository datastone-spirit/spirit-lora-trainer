/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 09:32:40
 * @LastEditTime: 2025-07-24 14:08:50
 * @LastEditors: mulingyuer
 * @Description: lora api
 * @FilePath: \frontend\src\api\lora\index.ts
 * 怎么可能会有bug！！！
 */

import { request } from "@/request";
import type {
	StartFluxKontextTrainingData,
	StartFluxKontextTrainingResult,
	StartFluxTrainingData,
	StartFluxTrainingResult,
	StartHyVideoTrainingData,
	StartHyVideoTrainingResult,
	StartWanVideoTrainingData,
	StartWanVideoTrainingResult,
	WanVideoVideoDatasetEstimateData,
	WanVideoVideoDatasetEstimateResult
} from "./types";
export type * from "./types";

/** 启动flux训练 */
export function startFluxTraining(data: StartFluxTrainingData) {
	return request<StartFluxTrainingResult>({
		url: "/training/start",
		method: "POST",
		data
	});
}

/** 启动混元视频训练 */
export function startHyVideoTraining(data: StartHyVideoTrainingData) {
	return request<StartHyVideoTrainingResult>({
		url: "/training/hunyuan/start",
		method: "POST",
		data
	});
}

/** 启动wan视频训练 */
export function startWanVideoTraining(data: StartWanVideoTrainingData) {
	return request<StartWanVideoTrainingResult>({
		url: "/training/wan/start",
		method: "POST",
		data
	});
}

/** 获取wan视频素材训练集提取的图片帧数量 */
export function wanVideoVideoDatasetEstimate(data: WanVideoVideoDatasetEstimateData) {
	return request<WanVideoVideoDatasetEstimateResult>({
		url: "/training/wan/datasets/estimate",
		method: "POST",
		data
	});
}

/** 启动flux kontext 训练 */
export function startFluxKontextTraining(data: StartFluxKontextTrainingData) {
	return request<StartFluxKontextTrainingResult>({
		url: "/training/kontext/start",
		method: "POST",
		data
	});
}
