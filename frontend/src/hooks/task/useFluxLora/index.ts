/*
 * @Author: mulingyuer
 * @Date: 2025-04-11 11:52:55
 * @LastEditTime: 2025-04-11 14:42:48
 * @LastEditors: mulingyuer
 * @Description: flux lora hooks
 * @FilePath: \frontend\src\hooks\v2\useFluxLora\index.ts
 * 怎么可能会有bug！！！
 */
import type { LoRATrainingInfoResult } from "@/api/monitor";
import { loRATrainingInfo } from "@/api/monitor";
import { isNetworkError } from "@/request";
import type { FluxLoraData, UseModalManagerStore, UseTrainingStore } from "@/stores";
import { useModalManagerStore, useTrainingStore } from "@/stores";
import { calculatePercentage } from "@/utils/tools";
import mitt from "mitt";
import type { TaskEvents, TaskImplementation, TaskStatus } from "../types";

interface FluxLoraMonitorOptions {
	/** 数据仓库 */
	trainingStore: UseTrainingStore;
	modalManagerStore: UseModalManagerStore;
	/** 定时器延迟 */
	delay?: number;
	/** 当前状态 */
	status?: TaskStatus;
	/** 任务id */
	taskId?: string;
	/** 任务类型 */
	taskType?: TaskType;
	/** 任务进度 */
	taskProgress?: number;
}

/** 设置初始数据 */
export interface InitData {
	/** 任务id */
	taskId: string;
	/** 是否显示训练提示弹窗 */
	showTrainingTip?: boolean;
	/** 显示训练提示弹窗的文本 */
	trainingTipText?: string;
}

class FluxLoraMonitor implements TaskImplementation {
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
	private readonly taskType: TaskType = "flux";
	/** 任务进度 */
	private taskProgress: number = 0;
	/** 任务名称 */
	private readonly taskName: string = "Flux";
	/** 事件订阅 */
	public events = mitt<TaskEvents>();

	constructor(options: FluxLoraMonitorOptions) {
		this.delay = options.delay ?? this.delay;
		this.status = options.status ?? this.status;
		this.trainingStore = options.trainingStore;
		this.modalManagerStore = options.modalManagerStore;
		this.taskId = options.taskId ?? this.taskId;
		this.taskType = options.taskType ?? this.taskType;
		this.taskProgress = options.taskProgress ?? this.taskProgress;
	}

	start(): void {
		if (!this.canQuery()) return;
		if (!this.validateTaskId()) {
			console.warn("查询任务没有提供任务ID，请先运行setTaskId方法设置任务ID，本次查询已跳过");
			return;
		}

		// 更新数据
		this.updateStatus("querying");
		this.updateIsListening(true);
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
		this.updateIsListening(true);
		this.updateCurrentTaskInfo();

		// 立即查询
		this.query();
	}

	stop(): void {
		if (this.status === "idle") return;

		// 更新数据
		this.updateStatus("idle");
		this.updateIsListening(false);
		this.trainingStore.resetCurrentTaskInfo();

		// 停止定时器
		this.clearTimer();
	}

	/** 设置初始数据 */
	public setInitData(initData: InitData) {
		// 更新数据
		this.updateStatus("paused");
		this.setTaskId(initData.taskId);
		this.updateIsListening(true);
		this.updateCurrentTaskInfo();

		// 弹窗提示
		const { showTrainingTip = true, trainingTipText = "当前正在训练..." } = initData;
		if (showTrainingTip) {
			ElMessage({
				message: trainingTipText,
				type: "info"
			});
		}
	}

	/** 设置初始数据并恢复配置 */
	public setInitDataWithConfig(initData: InitData & { config?: any }) {
		// 基础初始化
		this.setInitData(initData);
		
		// 如果有配置信息，触发配置恢复事件
		if (initData.config) {
			this.events.emit("restoreConfig", initData.config);
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
		loRATrainingInfo({
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

	/** 更新是否监听 */
	private updateIsListening(isListening: boolean): void {
		this.trainingStore.setFluxLoraIsListen(isListening);
	}

	/** 更新当前任务信息 */
	private updateCurrentTaskInfo(): void {
		this.trainingStore.setCurrentTaskInfo({
			id: this.taskId,
			type: this.taskType,
			name: this.taskName,
			progress: this.taskProgress
		});
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
	private handleQuerySuccess(result: LoRATrainingInfoResult): void {
		// 更新数据
		const data = this.formatData(result);
		this.trainingStore.setFluxLoraData(data);
		this.taskProgress = data.progress;
		this.updateCurrentTaskInfo();
		this.modalManagerStore.setNetworkDisconnectModal(false);

		// 事件通知
		this.events.emit("update");

		// 根据状态处理下一步
		switch (result.status) {
			case "complete": // 训练完成
				this.updateStatus("success");
				this.updateIsListening(false);
				this.trainingStore.resetFluxLoraData();
				this.trainingStore.resetCurrentTaskInfo();
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
				this.updateIsListening(false);
				this.trainingStore.resetFluxLoraData();
				this.trainingStore.resetCurrentTaskInfo();
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
		this.updateIsListening(false);
		this.trainingStore.resetFluxLoraData();
		this.trainingStore.resetCurrentTaskInfo();

		// 事件通知
		this.events.emit("failed");

		// log
		console.error("查询wan训练任务信息出错：", error);
	}

	/** 格式化数据 */
	private formatData(res: LoRATrainingInfoResult): FluxLoraData {
		let detail = res?.detail ?? {};
		if (typeof detail === "string") detail = {};

		const loraData: FluxLoraData = {
			current: detail.current ?? 0,
			elapsed: detail.elapsed ?? "00:00",
			loss: detail.loss ?? 0,
			loss_avr: detail.loss_avr ?? 0,
			remaining: detail.remaining ?? "00:00",
			speed: detail.speed ?? 0,
			total: detail.total ?? 0,
			progress: 0,
			showSampling: res.is_sampling ?? false,
			samplingPath: res.sampling_path ?? "",
			raw: res
		};
		loraData.progress = calculatePercentage(loraData.current, loraData.total);

		return loraData;
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

let fluxLoraMonitor: FluxLoraMonitor | null = null;

export function useFluxLora() {
	const trainingStore = useTrainingStore();
	const modalManagerStore = useModalManagerStore();
	const { monitorFluxLoraData } = storeToRefs(trainingStore);

	if (!fluxLoraMonitor) {
		fluxLoraMonitor = new FluxLoraMonitor({
			trainingStore,
			modalManagerStore
		});
	}

	return {
		fluxLoraMonitor,
		monitorFluxLoraData
	};
}
