/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 09:32:40
 * @LastEditTime: 2025-01-06 14:42:13
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
	StartHyVideoTrainingResult
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
		url: "/training/start_hy_video",
		method: "POST",
		data
	});
}
