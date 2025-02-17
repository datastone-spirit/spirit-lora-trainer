/*
 * @Author: mulingyuer
 * @Date: 2024-12-18 15:35:55
 * @LastEditTime: 2025-02-17 16:48:38
 * @LastEditors: mulingyuer
 * @Description: 公共api
 * @FilePath: \frontend\src\api\common\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type { AxiosProgressEvent } from "axios";
import type {
	CheckDirectoryExistsParams,
	CheckDirectoryExistsResult,
	DirectoryFilesParams,
	DirectoryFilesResult,
	GetDirectoryStructureParams,
	GetDirectoryStructureResult,
	HYCheckDirectoryExistsParams,
	HYCheckDirectoryExistsResult,
	UploadFilesParams,
	UploadFilesResult
} from "./types";
export type * from "./types";

/** 获取目录结构请求 */
export function getDirectoryStructure(params: GetDirectoryStructureParams) {
	return request<GetDirectoryStructureResult>({
		url: "/file",
		method: "GET",
		params,
		showErrorMessage: false
	});
}

/** 检测目录或者目录下的文件是否存在 */
export function checkDirectoryExists(params: CheckDirectoryExistsParams) {
	return request<CheckDirectoryExistsResult>({
		url: "/path_check",
		method: "GET",
		params,
		showErrorMessage: false
	});
}

/** 上传文件 */
export function uploadFiles(
	params: UploadFilesParams,
	data: FormData,
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
	return request<UploadFilesResult>({
		url: "/upload",
		method: "POST",
		params,
		data,
		onUploadProgress,
		timeout: 1000 * 60 * 10 // 10分钟超时
	});
}

/** 获取目录下的文件 */
export function directoryFiles(params: DirectoryFilesParams) {
	return request<DirectoryFilesResult>({
		url: "/tag_dir_file",
		method: "GET",
		params,
		showErrorMessage: false
	});
}

/** 混元视频：检测目录是否存 */
export function hyCheckDirectoryExists(params: HYCheckDirectoryExistsParams) {
	return request<HYCheckDirectoryExistsResult>({
		url: "/hunyuan/path_check",
		method: "GET",
		params,
		showErrorMessage: false
	});
}
