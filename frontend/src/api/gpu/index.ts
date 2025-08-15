/*
 * @Author: mulingyuer
 * @Date: 2025-08-14 09:08:35
 * @LastEditTime: 2025-08-15 10:23:13
 * @LastEditors: mulingyuer
 * @Description: gpu相关api
 * @FilePath: \frontend\src\api\gpu\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type { GpuInfo } from "./types";
export type * from "./types";

/** 获取gpu信息 */
export function gpuInfo() {
	return request<GpuInfo>({
		url: "/gpu/info",
		method: "GET"
	});
}
