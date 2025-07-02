/*
 * @Author: mulingyuer
 * @Date: 2025-04-11 10:06:22
 * @LastEditTime: 2025-07-01 10:47:29
 * @LastEditors: mulingyuer
 * @Description: 监听公共类型
 * @FilePath: \frontend\src\hooks\task\types.ts
 * 怎么可能会有bug！！！
 */

/** 任务状态 */
export type TaskStatus =
	| "idle" // 空闲
	| "querying" // 查询中
	| "paused" // 暂停
	| "success" // 成功
	| "failure"; // 失败

/** 任务事件订阅 */
export type TaskEvents = {
	update: void;
	complete: void;
	failed: void;
};

/** 任务实现接口 */
export interface TaskImplementation {
	/** 开始 */
	start(): void;

	/** 暂停 */
	pause(): void;

	/** 继续 */
	resume(): void;

	/** 停止 */
	stop(): void;
}
