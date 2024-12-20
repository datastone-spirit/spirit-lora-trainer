/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 09:32:40
 * @LastEditTime: 2024-12-20 09:38:02
 * @LastEditors: mulingyuer
 * @Description: lora api
 * @FilePath: \frontend\src\api\lora\index.ts
 * 怎么可能会有bug！！！
 */

import { request } from "@/request";
import type { StartFluxTrainingData, StartFluxTrainingResult } from "./types";
export type * from "./types";

/** 启动flux训练 */
export function startFluxTraining(data: StartFluxTrainingData) {
	return request<StartFluxTrainingResult>({
		url: "/training/start",
		method: "POST",
		data
	});
}
