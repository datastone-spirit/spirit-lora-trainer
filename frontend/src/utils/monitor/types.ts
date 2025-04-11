/*
 * @Author: mulingyuer
 * @Date: 2025-04-08 15:50:42
 * @LastEditTime: 2025-04-10 17:14:26
 * @LastEditors: mulingyuer
 * @Description: 任务监控器的类型定义
 * @FilePath: \frontend\src\utils\monitor\types.ts
 * 怎么可能会有bug！！！
 */

/** 任务状态 */
export type TaskStatus =
	| "idle" // 空闲
	| "querying" // 查询中
	| "paused" // 暂停
	| "success" // 成功
	| "failure"; // 失败
