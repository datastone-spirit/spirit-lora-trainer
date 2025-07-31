/*
 * @Author: mulingyuer
 * @Date: 2025-04-10 08:48:27
 * @LastEditTime: 2025-07-29 17:30:43
 * @LastEditors: mulingyuer
 * @Description: gpu hooks
 * @FilePath: \frontend\src\hooks\task\useGPU\index.ts
 * 怎么可能会有bug！！！
 */
import type { GPUMonitorInfoResult } from "@/api/monitor";
import { gpuMonitorInfo } from "@/api/monitor";
import type { UseTrainingStore } from "@/stores";
import { useTrainingStore } from "@/stores";
import type { TaskImplementation, TaskStatus } from "../types";

class GPUMonitor implements TaskImplementation {
	/** 定时器 */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** 任务定时器延迟 */
	private readonly delay: number = 3000;
	/** 数据仓库 */
	private readonly trainingStore: UseTrainingStore;
	/** 当前状态 */
	private status: TaskStatus = "idle";
	/** 允许查询的状态数组 */
	protected readonly canQueryStatus: Array<TaskStatus> = ["idle", "success", "failure"];

	constructor() {
		this.trainingStore = useTrainingStore();
	}

	start(): void {
		if (!this.canQuery()) return;

		// 更新数据
		this.updateStatus("querying");

		// 开始查询
		this.query();
	}

	pause(): void {
		if (this.status !== "querying") return;

		// 更新数据
		this.updateStatus("paused");

		// 停止定时器
		this.clearTimer();
	}

	resume(): void {
		if (this.status !== "paused") return;

		// 更新数据
		this.updateStatus("querying");

		// 立即查询
		this.query();
	}

	stop(): void {
		if (this.status === "idle") return;

		// 更新数据
		this.updateStatus("idle");
		this.trainingStore.resetTrainingGPUData();

		// 停止定时器
		this.clearTimer();
	}

	/** 具体的查询流程 */
	private query() {
		if (this.status !== "querying") return;

		// api查询
		gpuMonitorInfo()
			.then(this.handleQuerySuccess.bind(this))
			.catch(this.handleQueryFailure.bind(this));
	}

	/** 是否允许查询 */
	private canQuery() {
		return this.canQueryStatus.includes(this.status);
	}

	/** 更新任务状态 */
	private updateStatus(status: TaskStatus) {
		this.status = status;
	}

	/** 处理查询成功 */
	private handleQuerySuccess(result: GPUMonitorInfoResult): void {
		const oneItemData = result[0];
		if (oneItemData) {
			this.trainingStore.setTrainingGPUData(result);
		}

		// 定时器继续查询
		this.startTimer();
	}

	/** 处理查询失败 */
	private handleQueryFailure(error: any): void {
		// gpu信息查询失败也要继续查询，只有查询条件不成立才停止查询
		console.error("查询GPU信息失败：", error);

		// 定时器继续查询
		this.startTimer();
	}

	/** 开始定时器 */
	private startTimer() {
		this.clearTimer();
		this.timer = setTimeout(this.query.bind(this), this.delay);
	}

	/** 清理定时器 */
	private clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
}

let gpuMonitor: GPUMonitor | null = null;

export function useGPU() {
	if (!gpuMonitor) {
		gpuMonitor = new GPUMonitor();
	}

	return {
		gpuMonitor
	};
}
