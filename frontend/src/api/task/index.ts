/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 16:53:10
 * @LastEditTime: 2024-12-24 17:07:11
 * @LastEditors: mulingyuer
 * @Description: 任务api
 * @FilePath: \frontend\src\api\task\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type { CurrentTaskResult } from "./types";
export type * from "./types";

/** 查询当前正在运行的任务 */
export function currentTask() {
	return request<CurrentTaskResult>({
		url: "/tasks/current",
		method: "GET",
		showErrorMessage: false
	});
}
