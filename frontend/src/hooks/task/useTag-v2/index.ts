/*
 * @Author: mulingyuer
 * @Date: 2025-04-11 09:16:38
 * @LastEditTime: 2025-09-03 15:58:30
 * @LastEditors: mulingyuer
 * @Description: 打标hooks
 * @FilePath: \frontend\src\hooks\task\useTag-v2\index.ts
 * 怎么可能会有bug！！！
 */
import type { ManualTagInfoResult } from "@/api/monitor";
import { manualTagInfo } from "@/api/monitor";
import { batchTag, type BatchTagData } from "@/api/tag";
import { useTrainingStore, type UseTrainingStore } from "@/stores";
import { NetworkDisconnectModal } from "@/utils/modal-manager";
import { isNetworkError } from "axios-retry";
import mitt from "mitt";
import type { SimplifyDeep } from "type-fest";
import type { TaskEvents, TaskImplementation, TaskStatus } from "../types";

/** 设置初始数据 */
export interface InitData {
	/** 任务id */
	taskId: string;
	/** api返回的任务数据 */
	result: ManualTagInfoResult;
	/** 是否显示训练提示弹窗 */
	showTrainingTip?: boolean;
	/** 显示训练提示弹窗的文本 */
	trainingTipText?: string;
}

/** 打标选项 */
export type TagData = SimplifyDeep<
	BatchTagData & {
		/** 是否显示任务开始提示 */
		showTaskStartPrompt?: boolean;
	}
>;

class TagMonitor implements TaskImplementation {
	/** 定时器 */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** 任务定时器延迟 */
	private readonly delay: number = 8000;
	/** 数据仓库 */
	private readonly trainingStore: UseTrainingStore;
	/** 当前状态 */
	private status: TaskStatus = "idle";
	/** 允许查询的状态数组 */
	protected readonly canQueryStatus: Array<TaskStatus> = ["idle", "success", "failure"];
	/** 任务id */
	private taskId: string = "";
	/** 任务类型 */
	private readonly taskType: TaskType = "tag";
	/** 任务名称 */
	private readonly taskName: string = "打标";
	/** 事件订阅 */
	public events = mitt<TaskEvents>();

	constructor() {
		this.trainingStore = useTrainingStore();
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
		this.updateStatus("querying");
		this.setTaskId(taskId);
		this.updateCurrentTaskInfo(result);

		// 继续查询
		this.startTimer();

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
		manualTagInfo({
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
	private updateCurrentTaskInfo(result?: ManualTagInfoResult): void {
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
	private handleQuerySuccess(result: ManualTagInfoResult): void {
		// 更新数据
		this.updateCurrentTaskInfo(result);
		NetworkDisconnectModal.close();

		// 事件通知
		this.events.emit("update");

		// 根据状态处理下一步
		switch (result.status) {
			case "complete": // 打标完成
				this.updateStatus("success");
				this.resetCurrentTaskInfo();
				this.events.emit("complete");

				ElMessageBox({
					title: "打标完成",
					type: "success",
					showCancelButton: false,
					confirmButtonText: "知道了",
					message: "打标完成，可以开始训练LoRA了"
				});
				break;
			case "failed": // 打标失败
				this.updateStatus("failure");
				this.resetCurrentTaskInfo();
				this.events.emit("failed");

				ElMessageBox({
					title: "打标失败",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "知道了",
					message: "打标失败，请检查日志或者重新打标"
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
			NetworkDisconnectModal.show();
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
		console.error("查询tag打标任务信息出错：", error);
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

let tagMonitor: TagMonitor | null = null;

export function useTag() {
	/** 打标 */
	async function tag(data: TagData) {
		const { showTaskStartPrompt = false } = data;

		const apiData: BatchTagData = {
			image_path: data.image_path,
			model_name: data.model_name,
			prompt_type: data.prompt_type,
			class_token: data.class_token || void 0,
			global_prompt: data.global_prompt || void 0,
			is_append: data.is_append
		};

		// 非joy2模型打标，删除相关字段
		if (!isJoyCaption2Model(data.model_name)) {
			Reflect.deleteProperty(apiData, "prompt_type");
			Reflect.deleteProperty(apiData, "global_prompt");
		}

		const apiResult = await batchTag(apiData);

		showTaskStartPrompt &&
			ElMessage({
				message: "正在打标...",
				type: "success"
			});

		return apiResult;
	}

	/** 是否是Joy Caption2打标模型 */
	function isJoyCaption2Model(tagModel: string) {
		return tagModel === "joy-caption-alpha-two";
	}

	if (!tagMonitor) {
		tagMonitor = new TagMonitor();
	}

	return {
		tagMonitor,
		tag,
		isJoyCaption2Model
	};
}
