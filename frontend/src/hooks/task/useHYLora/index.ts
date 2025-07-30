/*
 * @Author: mulingyuer
 * @Date: 2025-04-11 14:45:05
 * @LastEditTime: 2025-07-30 09:19:59
 * @LastEditors: mulingyuer
 * @Description: 混元lora hooks
 * @FilePath: \frontend\src\hooks\task\useHYLora\index.ts
 * 怎么可能会有bug！！！
 */
import type { HyVideoTrainingInfoResult } from "@/api/monitor";
import { hyVideoTrainingInfo } from "@/api/monitor";
import type { UseModalManagerStore, UseTrainingStore } from "@/stores";
import { useModalManagerStore, useTrainingStore } from "@/stores";
import { isNetworkError } from "axios-retry";
import mitt from "mitt";
import type { TaskEvents, TaskImplementation, TaskStatus } from "../types";

/** 设置初始数据 */
export interface InitData {
	/** 任务id */
	taskId: string;
	/** api返回的任务数据 */
	result: HyVideoTrainingInfoResult;
	/** 是否显示训练提示弹窗 */
	showTrainingTip?: boolean;
	/** 显示训练提示弹窗的文本 */
	trainingTipText?: string;
}

class HYLoraMonitor implements TaskImplementation {
	/** 定时器 */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** 任务定时器延迟 */
	private readonly delay: number = 8000;
	/** 数据仓库 */
	private readonly trainingStore: UseTrainingStore;
	private readonly modalManagerStore: UseModalManagerStore;
	/** 当前状态 */
	private status: TaskStatus = "idle";
	/** 允许查询的状态数组 */
	protected readonly canQueryStatus: Array<TaskStatus> = ["idle", "success", "failure"];
	/** 任务id */
	private taskId: string = "";
	/** 任务类型 */
	private readonly taskType: TaskType = "hunyuan-video";
	/** 任务名称 */
	private readonly taskName: string = "混元视频";
	/** 事件订阅 */
	public events = mitt<TaskEvents>();

	constructor() {
		this.trainingStore = useTrainingStore();
		this.modalManagerStore = useModalManagerStore();
	}

	start(): void {
		if (!this.canQuery()) return;
		if (!this.validateTaskId()) {
			console.warn("查询任务没有提供任务ID，请先运行setTaskId方法设置任务ID，本次查询已跳过");
			return;
		}

		// 更新数据
		this.updateStatus("querying");
		this.updateCurrentTaskInfo();

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
		this.updateCurrentTaskInfo();

		// 立即查询
		this.query();
	}

	stop(): void {
		if (this.status === "idle") return;

		// 更新数据
		this.updateStatus("idle");
		this.resetCurrentTaskInfo();

		// 停止定时器
		this.clearTimer();
	}

	/** 设置初始数据 */
	public setInitData(initData: InitData) {
		const {
			taskId,
			result,
			showTrainingTip = true,
			trainingTipText = "当前正在训练..."
		} = initData;

		// 更新数据
		this.updateStatus("paused");
		this.setTaskId(taskId);
		this.updateCurrentTaskInfo(result);

		// 弹窗提示
		if (showTrainingTip) {
			ElMessage({
				message: trainingTipText,
				type: "info"
			});
		}
	}

	/** 设置任务id */
	public setTaskId(taskId: string) {
		this.taskId = taskId;
		return this;
	}

	/** 获取任务id */
	public getTaskId(): string {
		return this.taskId;
	}

	/** 具体的查询流程 */
	private query() {
		if (this.status !== "querying") return;

		// api查询
		hyVideoTrainingInfo({
			task_id: this.taskId
		})
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

	/** 更新当前任务信息 */
	private updateCurrentTaskInfo(result?: HyVideoTrainingInfoResult): void {
		this.trainingStore.setCurrentTaskInfo({
			id: this.taskId,
			type: this.taskType,
			name: this.taskName,
			result
		});
	}

	/** 重置当前任务信息 */
	private resetCurrentTaskInfo(): void {
		this.trainingStore.resetCurrentTaskInfo({ type: this.taskType });
	}

	/** 校验任务id */
	private validateTaskId(taskId?: string): boolean {
		taskId = taskId ?? this.taskId;
		if (typeof taskId !== "string" || taskId.trim() === "") {
			return false;
		}

		return true;
	}

	/** 处理查询成功 */
	private handleQuerySuccess(result: HyVideoTrainingInfoResult): void {
		// 更新数据
		this.updateCurrentTaskInfo(result);
		this.modalManagerStore.setNetworkDisconnectModal(false);

		// 事件通知
		this.events.emit("update");

		// 根据状态处理下一步
		switch (result.status) {
			case "complete": // 训练完成
				this.updateStatus("success");
				this.resetCurrentTaskInfo();
				this.events.emit("complete");

				ElMessageBox({
					title: "训练完成",
					type: "success",
					showCancelButton: false,
					confirmButtonText: "知道了",
					message: "LoRA训练成功，请检查保存目录下的LoRA模型文件"
				});
				break;
			case "failed": // 训练失败
				this.updateStatus("failure");
				this.resetCurrentTaskInfo();
				this.events.emit("failed");

				ElMessageBox({
					title: "训练失败",
					type: "error",
					showCancelButton: true,
					cancelButtonText: "查看日志",
					confirmButtonText: "知道了",
					message: "LoRA训练失败，请检查日志或者重新训练"
				}).catch(() => {
					// 查看日志弹窗
					this.modalManagerStore.setLoraTaskLogModal({
						open: true,
						taskId: this.taskId
					});
				});
				break;
			case "running":
			case "created":
			default:
				// 继续查询
				this.startTimer();
		}
	}

	/** 处理查询失败 */
	private handleQueryFailure(error: any): void {
		const status = error?.status ?? 0;
		const is5xxError = status >= 500 && status < 600;

		// 如果是网络错误或者5xx错误，弹出网络连接错误提示
		if (isNetworkError(error) || is5xxError) {
			this.modalManagerStore.setNetworkDisconnectModal(true);
			// 继续查询
			this.startTimer();
			return;
		}

		// 其他错误
		this.updateStatus("failure");
		this.resetCurrentTaskInfo();

		// 事件通知
		this.events.emit("failed");

		// log
		console.error("查询wan训练任务信息出错：", error);
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

let hyLoraMonitor: HYLoraMonitor | null = null;

export function useHYLora() {
	if (!hyLoraMonitor) {
		hyLoraMonitor = new HYLoraMonitor();
	}

	return {
		hyLoraMonitor
	};
}
