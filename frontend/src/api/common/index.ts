/*
 * @Author: mulingyuer
 * @Date: 2024-12-18 15:35:55
 * @LastEditTime: 2024-12-18 17:40:07
 * @LastEditors: mulingyuer
 * @Description: 公共api
 * @FilePath: \frontend\src\api\common\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type {
	CheckDirectoryExistsParams,
	CheckDirectoryExistsResult,
	GetDirectoryStructureParams,
	GetDirectoryStructureResult
} from "./types";
export type * from "./types";

/** 获取目录结构请求 */
export function getDirectoryStructure(params: GetDirectoryStructureParams) {
	return request<GetDirectoryStructureResult>({
		url: "/file",
		method: "GET",
		params
	});
}

/** 检测目录或者目录下的文件是否存在 */
export function checkDirectoryExists(params: CheckDirectoryExistsParams) {
	return request<CheckDirectoryExistsResult>({
		url: "/path_check",
		method: "GET",
		params
	});
}
