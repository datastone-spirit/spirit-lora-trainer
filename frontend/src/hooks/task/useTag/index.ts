/*
 * @Author: mulingyuer
 * @Date: 2025-04-11 09:16:38
 * @LastEditTime: 2025-07-28 15:35:35
 * @LastEditors: mulingyuer
 * @Description: 打标hooks
 * @FilePath: \frontend\src\hooks\task\useTag\index.ts
 * 怎么可能会有bug！！！
 */
import type { ManualTagInfoResult } from "@/api/monitor";
import { manualTagInfo } from "@/api/monitor";
import { batchTag, type BatchTagData } from "@/api/tag";
import {
	useModalManagerStore,
	useTrainingStore,
	type UseModalManagerStore,
	type UseTrainingStore
} from "@/stores";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import { isNetworkError } from "axios-retry";
import mitt from "mitt";
import type { TaskEvents, TaskImplementation, TaskStatus } from "../types";

interface TagMonitorOptions {
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

/** 打标选项 */
export interface TagOptions {
	/** 打标模型 */
	tagModel: string;
	/** 打标的目录 */
	tagDir: string;
	/** 打标模型为：Joy Caption2时，需要具体的打标类型 */
	joyCaptionPromptType?: string;
	/** 是否添加原封不动输出到打标内容中 */
	isAddGlobalPrompt: boolean;
	/** 原封不动输出到打标内容中的文本，isAddGlobalPrompt为true时有效 */
	globalPrompt?: string;
	/** 打标时给AI的提示词（用于生成打标内容） */
	tagPrompt: string;
	/** 打标的是内容是否追加到原有内容后面 */
	isAppend: boolean;
	/** 是否显示任务开始提示 */
	showTaskStartPrompt: boolean;
}

/** 打标校验参数 */
export interface ValidateTagOptions extends TagOptions {
	/** 是否显示错误消息弹窗 */
	showErrorMessage: boolean;
}

/** 打标校验规则 */
export type ValidateTagRules = Array<{
	condition: () => boolean | Promise<boolean>;
	message: string;
}>;

/** 打标校验结果 */
export interface ValidateTagResult {
	isValid: boolean;
	message: string;
}

class TagMonitor implements TaskImplementation {
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
	private readonly taskType: TaskType = "tag";
	/** 任务名称 */
	private readonly taskName: string = "打标";
	/** 事件订阅 */
	public events = mitt<TaskEvents>();

	constructor(options: TagMonitorOptions) {
		this.delay = options.delay ?? this.delay;
		this.status = options.status ?? this.status;
		this.trainingStore = options.trainingStore;
		this.modalManagerStore = options.modalManagerStore;
		this.taskId = options.taskId ?? this.taskId;
		this.taskType = options.taskType ?? this.taskType;
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

	/** 更新是否监听 */
	private updateIsListening(isListening: boolean): void {
		this.trainingStore.setTrainingTagListen(isListening);
	}

	/** 更新当前任务信息 */
	private updateCurrentTaskInfo(): void {
		this.trainingStore.setCurrentTaskInfo({
			id: this.taskId,
			type: this.taskType,
			name: this.taskName,
			progress: this.trainingStore.trainingTagData.data.progress
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
	private handleQuerySuccess(result: ManualTagInfoResult): void {
		// 更新数据
		this.trainingStore.setTrainingTagData(result);
		this.updateCurrentTaskInfo();
		this.modalManagerStore.setNetworkDisconnectModal(false);

		// 事件通知
		this.events.emit("update");

		// 根据状态处理下一步
		switch (result.status) {
			case "complete": // 打标完成
				this.updateStatus("success");
				this.updateIsListening(false);
				this.trainingStore.resetTrainingTagData();
				this.trainingStore.resetCurrentTaskInfo();
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
				this.updateIsListening(false);
				this.trainingStore.resetTrainingTagData();
				this.trainingStore.resetCurrentTaskInfo();
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
			this.modalManagerStore.setNetworkDisconnectModal(true);
			// 继续查询
			this.startTimer();
			return;
		}

		// 其他错误
		this.updateStatus("failure");
		this.updateIsListening(false);
		this.trainingStore.resetTrainingTagData();
		this.trainingStore.resetCurrentTaskInfo();

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
	const trainingStore = useTrainingStore();
	const modalManagerStore = useModalManagerStore();

	/** 打标 */
	async function tag(options: TagOptions) {
		// 先校验参数
		const validateResult = await validateTag({
			...options,
			showErrorMessage: true
		});
		if (!validateResult.isValid) throw new Error(validateResult.message);

		// api
		const apiData: BatchTagData = {
			image_path: options.tagDir,
			model_name: options.tagModel,
			prompt_type: options.joyCaptionPromptType ?? "",
			class_token: options.isAddGlobalPrompt ? (options.globalPrompt ?? "") : "",
			global_prompt: isJoyCaption2Model(options.tagModel) ? options.tagPrompt : "",
			is_append: options.isAppend
		};
		const apiResult = await batchTag(apiData);

		options.showTaskStartPrompt &&
			ElMessage({
				message: "正在打标...",
				type: "success"
			});

		return apiResult;
	}

	/** 打标前校验 */
	async function validateTag(options: ValidateTagOptions): Promise<ValidateTagResult> {
		const trainingStore = useTrainingStore();
		const {
			tagDir,
			tagModel,
			isAddGlobalPrompt,
			globalPrompt,
			joyCaptionPromptType,
			showErrorMessage
		} = options;

		const rules: ValidateTagRules = [
			{
				condition: () => trainingStore.useGPU,
				message: "GPU已经被占用，请等待对应任务完成再执行打标"
			},
			{
				condition: () => typeof tagDir !== "string" || tagDir.trim() === "",
				message: "请先选择训练用的数据集目录"
			},
			{
				condition: async () => {
					const { valid } = await LoRAValidator.validateDirectory({ path: tagDir });
					return !valid;
				},
				message: "数据集目录不存在"
			},
			{
				condition: () => typeof tagModel !== "string" || tagModel.trim() === "",
				message: "请先选择打标模型"
			},
			{
				condition: () => {
					if (!isJoyCaption2Model(tagModel)) return false;
					if (typeof joyCaptionPromptType !== "string" || joyCaptionPromptType.trim() === "")
						return true;

					return false;
				},
				message: "请选择 Joy Caption2 的提示词类型"
			},
			{
				condition: () => {
					if (!isAddGlobalPrompt) return false;
					if (typeof globalPrompt !== "string" || globalPrompt.trim() === "") return true;
					return false;
				},
				message: "请填写触发词"
			}
		];

		for (const rule of rules) {
			if (await rule.condition()) {
				showErrorMessage &&
					ElMessage({
						message: rule.message,
						type: "error"
					});

				return {
					isValid: false,
					message: rule.message
				};
			}
		}

		return {
			isValid: true,
			message: ""
		};
	}

	/** 是否是Joy Caption2打标模型 */
	function isJoyCaption2Model(tagModel: string) {
		return tagModel === "joy-caption-alpha-two";
	}

	if (!tagMonitor) {
		tagMonitor = new TagMonitor({
			trainingStore,
			modalManagerStore
		});
	}

	return {
		tagMonitor,
		tag
	};
}
