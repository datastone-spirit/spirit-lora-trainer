/*
 * @Author: mulingyuer
 * @Date: 2025-04-10 16:36:15
 * @LastEditTime: 2025-04-11 10:42:02
 * @LastEditors: mulingyuer
 * @Description: 任务监控器
 * @FilePath: \frontend\src\utils\monitor\core\lora-monitor.ts
 * 怎么可能会有bug！！！
 */
import { BaseMonitor } from "./base-monitor";
import type { BaseMonitorInfo, BaseTaskMonitorOptions } from "./base-monitor";
import mitt from "mitt";

/** 任务信息 */
export interface LoRAMonitorInfo extends BaseMonitorInfo {
	/** 任务类型 */
	type: TaskType;
	/** 任务id */
	taskId: string;
}

/** lora任务监控器选项 */
export type LoRAMonitorOptions = BaseTaskMonitorOptions &
	Partial<{
		/** 任务类型 */
		type: TaskType;
	}>;

/** 设置初始数据 */
export interface InitData {
	/** 任务类型 */
	type: TaskType;
	/** 任务id */
	taskId: string;
	/** 是否显示训练提示弹窗 */
	showTrainingTip?: boolean;
	/** 显示训练提示弹窗的文本 */
	trainingTipText?: string;
}

/** 事件订阅 */
export type LoRAEvents = {
	update: void;
	complete: void;
	failed: void;
};

export abstract class LoRAMonitor<ApiResult> extends BaseMonitor<ApiResult> {
	/** 任务信息 */
	public monitorInfo: LoRAMonitorInfo = {
		status: "idle",
		timer: null,
		delay: 5000,
		type: "none",
		taskId: ""
	};
	/** 事件订阅 */
	public events = mitt<LoRAEvents>();

	constructor(options: LoRAMonitorOptions = {}) {
		super(options);
		this.monitorInfo = { ...this.monitorInfo, ...options };
	}

	/** 开始 */
	public start() {
		if (!this.validateTaskId(this.monitorInfo.taskId)) {
			console.warn("查询任务没有提供任务ID，请先运行setTaskId方法设置任务ID，本次查询已跳过");
			return;
		}

		// 更新数据
		this.updateTaskType(this.monitorInfo.type);

		// 调用父类方法
		super.start();
	}

	/** 继续 */
	public resume() {
		if (this.monitorInfo.status !== "paused") return;

		// 更新数据
		this.updateTaskType(this.monitorInfo.type);

		// 调用父类方法
		super.resume();
	}

	/** 停止 */
	public stop() {
		if (this.monitorInfo.status === "idle") return;

		// 更新数据
		this.updateIsListening(false);
		this.updateTaskType("none");

		// 调用父类方法
		super.stop();
	}

	/** 设置初始数据 */
	public setInitData(initData: InitData) {
		// 更新数据
		this.updateStatus("paused");
		this.setTaskId(initData.taskId);
		this.updateIsListening(true);
		this.updateTaskType(initData.type);

		// 弹窗提示
		const { showTrainingTip = true, trainingTipText = "当前正在训练..." } = initData;
		if (showTrainingTip) {
			ElMessage({
				message: trainingTipText,
				type: "info"
			});
		}
	}

	/** 校验任务id */
	protected validateTaskId(taskId?: string): boolean {
		taskId = taskId ?? this.monitorInfo.taskId;
		if (typeof taskId !== "string" || taskId.trim() === "") {
			return false;
		}

		return true;
	}

	/** 设置任务id */
	public setTaskId(taskId: string) {
		this.monitorInfo.taskId = taskId;
		return this;
	}

	/** 更新任务类型 */
	protected abstract updateTaskType(taskType: TaskType): void;
}
