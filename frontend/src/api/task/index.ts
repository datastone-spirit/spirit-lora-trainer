/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 16:53:10
 * @LastEditTime: 2024-12-26 16:19:48
 * @LastEditors: mulingyuer
 * @Description: 任务api
 * @FilePath: \frontend\src\api\task\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type { CurrentTaskResult, TaskListResult } from "./types";
export type * from "./types";

/** 查询当前正在运行的任务 */
export function currentTask() {
	return request<CurrentTaskResult>({
		url: "/tasks/current",
		method: "GET",
		showErrorMessage: false
	});
}

/** 获取任务列表 */
export function taskList() {
	return request<TaskListResult>({
		url: "/tasks/history",
		method: "GET"
	});
}
