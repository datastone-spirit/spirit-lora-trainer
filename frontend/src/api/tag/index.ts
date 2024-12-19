/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 17:32:51
 * @LastEditTime: 2024-12-19 17:36:36
 * @LastEditors: mulingyuer
 * @Description: 打标api
 * @FilePath: \frontend\src\api\tag\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type { BatchTagData, BatchTagResult, ManualTagData, ManualTagResult } from "./types";
export type * from "./types";

/** 一键打标 */
export function batchTag(data: BatchTagData) {
	return request<BatchTagResult>({
		url: "/training/tag",
		method: "POST",
		data
	});
}

/** 手动打标 */
export function manualTag(data: ManualTagData) {
	return request<ManualTagResult>({
		url: "/training/tag_manual",
		method: "POST",
		data
	});
}
