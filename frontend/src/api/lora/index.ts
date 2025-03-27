/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 09:32:40
 * @LastEditTime: 2025-03-27 11:22:18
 * @LastEditors: mulingyuer
 * @Description: lora api
 * @FilePath: \frontend\src\api\lora\index.ts
 * 怎么可能会有bug！！！
 */

import { request } from "@/request";
import type {
	StartFluxTrainingData,
	StartFluxTrainingResult,
	StartHyVideoTrainingData,
	StartHyVideoTrainingResult,
	StartWanVideoTrainingData,
	StartWanVideoTrainingResult
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
