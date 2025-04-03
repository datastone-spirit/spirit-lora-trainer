/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 16:53:10
 * @LastEditTime: 2025-04-02 15:55:09
 * @LastEditors: mulingyuer
 * @Description: 任务api
 * @FilePath: \frontend\src\api\task\index.ts
 * 怎么可能会有bug！！！
 */
import { request } from "@/request";
import type {
	CurrentTaskFormConfigResult,
	CurrentTaskParams,
	CurrentTaskResult,
	TaskListResult,
	TaskLogParams,
	TaskLogResult
} from "./types";
export type * from "./types";

/** 查询当前正在运行的任务 */
export function currentTask(timeout?: number) {
	return request<CurrentTaskResult>({
		url: "/tasks/current",
		method: "GET",
		showErrorMessage: false,
		timeout
	});
}

/** 获取任务列表 */
export function taskList() {
	return request<TaskListResult>({
		url: "/tasks/history",
		method: "GET"
	});
}

/** 获取当前训练任务的表单配置 */
export function currentTaskFormConfig(params: CurrentTaskParams) {
	return request<CurrentTaskFormConfigResult>({
		url: "/tasks/history",
		method: "GET",
		params,
		showErrorMessage: false
	});
}

/** 获取训练任务日志 */
export function taskLog(params: TaskLogParams) {
	return request<TaskLogResult>({
		url: "/tasks/logs",
		method: "GET",
		params
	});
}
