/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 17:32:51
 * @LastEditTime: 2024-12-20 09:21:34
 * @LastEditors: mulingyuer
 * @Description: 打标api
 * @FilePath: \frontend\src\api\tag\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type {
	BatchTagData,
	BatchTagResult,
	DeleteFileParams,
	ManualTagData,
	ManualTagResult
} from "./types";
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

/** 删除文件 */
export function deleteFile(params: DeleteFileParams) {
	return request<string>({
		url: "/delete_file",
		method: "DELETE",
		params
	});
}
