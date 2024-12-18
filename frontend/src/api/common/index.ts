/*
 * @Author: mulingyuer
 * @Date: 2024-12-18 15:35:55
 * @LastEditTime: 2024-12-18 15:55:50
 * @LastEditors: mulingyuer
 * @Description: 公共api
 * @FilePath: \frontend\src\api\common\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type { GetDirectoryStructureParams, GetDirectoryStructureResult } from "./types";
export type * from "./types";

/** 获取目录结构请求 */
export function getDirectoryStructure(params: GetDirectoryStructureParams) {
	return request<GetDirectoryStructureResult>({
		url: "/file",
		method: "GET",
		params
	});
}
