/*
 * @Author: mulingyuer
 * @Date: 2025-03-28 14:50:08
 * @LastEditTime: 2025-03-28 15:16:52
 * @LastEditors: mulingyuer
 * @Description: gpu hooks types
 * @FilePath: \frontend\src\hooks\useGPU\types.ts
 * 怎么可能会有bug！！！
 */

/** 查询任务的状态 */
export type QueryGPUStatus =
	| "idle" // 空闲
	| "querying" // 查询中
	| "paused" // 暂停中
	| "success" // 成功
	| "failure"; // 失败

/** gpu任务信息 */
export interface QueryGPUInfo {
	/** 当前查询的状态 */
	status: QueryGPUStatus;
	/** 查询定时器 */
	timer: number | null;
	/** 查询定时器延迟（ms） */
	delay: number;
}

/** GPU事件订阅 */
export type GPUEvent = {
	/** 训练数据更新 */
	update: void;
};
