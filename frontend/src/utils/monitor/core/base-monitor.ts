/*
 * @Author: mulingyuer
 * @Date: 2025-04-10 16:33:23
 * @LastEditTime: 2025-04-10 18:02:49
 * @LastEditors: mulingyuer
 * @Description: 基础监控器
 * @FilePath: \frontend\src\utils\monitor\core\base-monitor.ts
 * 怎么可能会有bug！！！
 */
import type { TaskStatus } from "../types";

/** 任务信息 */
export interface BaseMonitorInfo {
	/** 任务状态 */
	status: TaskStatus;
	/** 定时器 */
	timer: number | null;
	/** 查询延迟 */
	delay: number;
}

/** 任务监控器选项 */
export type BaseTaskMonitorOptions = Partial<Omit<BaseMonitorInfo, "timer">>;

export abstract class BaseMonitor<ApiResult> {
	/** 任务信息 */
	public monitorInfo: BaseMonitorInfo = {
		status: "idle",
		timer: null,
		delay: 5000
	};
	/** 允许查询的状态数组 */
	protected readonly canQueryStatus: Array<TaskStatus> = ["idle", "success", "failure"];

	constructor(options: BaseTaskMonitorOptions = {}) {
		this.monitorInfo = { ...this.monitorInfo, ...options };
	}

	/** 开始 */
	public start() {
		if (!this.canQuery()) return;

		// 更新数据
		this.updateIsListening(true);
		this.updateStatus("querying");

		// 开始查询
		this.query();
	}

	/** 暂停 */
	public pause() {
		if (this.monitorInfo.status !== "querying") return;

		// 更新状态
		this.updateStatus("paused");

		// 停止定时器
		this.clearTimer();
	}

	/** 继续 */
	public resume() {
		if (this.monitorInfo.status !== "paused") return;

		// 更新数据
		this.updateIsListening(true);
		this.updateStatus("querying");

		// 立即查询
		this.query();
	}

	/** 停止 */
	public stop() {
		if (this.monitorInfo.status === "idle") return;

		// 更新数据
		this.updateIsListening(false);
		this.updateStatus("idle");

		// 停止定时器
		this.clearTimer();
	}

	/** 具体的查询流程 */
	protected query() {
		if (this.monitorInfo.status !== "querying") return;

		// api查询
		this.apiQuery(this.monitorInfo)
			.then(this.handleQuerySuccess.bind(this))
			.catch(this.handleQueryFailure.bind(this));
	}

	/** 是否允许查询 */
	public canQuery() {
		return this.canQueryStatus.includes(this.monitorInfo.status);
	}

	/** 更新任务状态 */
	protected updateStatus(status: TaskStatus) {
		this.monitorInfo.status = status;
	}

	/** 开始定时器 */
	protected startTimer() {
		this.clearTimer();
		this.monitorInfo.timer = setTimeout(this.query.bind(this), this.monitorInfo.delay);
	}

	/** 清理定时器 */
	protected clearTimer() {
		if (this.monitorInfo.timer) {
			clearTimeout(this.monitorInfo.timer);
			this.monitorInfo.timer = null;
		}
	}

	/** api查询 */
	protected abstract apiQuery(data: BaseMonitorInfo): Promise<ApiResult>;

	/** 处理查询成功 */
	protected abstract handleQuerySuccess(result: ApiResult): void;

	/** 处理查询失败 */
	protected abstract handleQueryFailure(error: any): void;

	/** 更新监听状态 */
	protected abstract updateIsListening(isListening: boolean): void;
}
