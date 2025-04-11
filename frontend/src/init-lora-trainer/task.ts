/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 14:54:45
 * @LastEditTime: 2025-04-11 14:55:42
 * @LastEditors: mulingyuer
 * @Description: 任务初始化处理
 * @FilePath: \frontend\src\init-lora-trainer\task.ts
 * 怎么可能会有bug！！！
 */
import type {
	HyVideoTrainingInfoResult,
	LoRATrainingInfoResult,
	ManualTagInfoResult,
	WanVideoTrainingInfoResult
} from "@/api/monitor";
import type { CurrentTaskResult } from "@/api/task";
import { currentTask } from "@/api/task";
import { TaskType } from "@/api/types";
import { useFluxLora } from "@/hooks/task/useFluxLora";
import { useHYLora } from "@/hooks/task/useHYLora";
import { useTag } from "@/hooks/task/useTag";
import type { AxiosError } from "axios";
import { useWanLora } from "@/hooks/task/useWanLora";

class TaskInitializer {
	constructor(private readonly taskData: CurrentTaskResult) {}

	/** 初始化 */
	async init() {
		let initPromise: Promise<void>;

		switch (this.taskData.task_type) {
			case TaskType.CAPTIONING: // 打标
				initPromise = this.initTag();
				break;
			case TaskType.TRAINING: // flux 训练
				initPromise = this.initFluxTraining();
				break;
			case TaskType.HUNYUAN_TRAINING: // 混元视频训练
				initPromise = this.initHyVideoTraining();
				break;
			case TaskType.WAN_TRAINING: // wan训练
				initPromise = this.initWanTraining();
				break;
			default:
				console.warn("未知任务类型", this.taskData.task_type);
				initPromise = Promise.resolve();
		}

		return initPromise;
	}

	/** 打标初始化 */
	private async initTag() {
		const { status } = this.taskData as ManualTagInfoResult;
		if (status === "complete" || status === "failed") return;

		const { tagMonitor } = useTag();

		return tagMonitor.setInitData({
			taskId: this.taskData.id
		});
	}

	/** flux 训练初始化 */
	private async initFluxTraining() {
		const { status } = this.taskData as LoRATrainingInfoResult;
		if (status === "complete" || status === "failed") return;
		const { fluxLoraMonitor } = useFluxLora();

		return fluxLoraMonitor.setInitData({
			taskId: this.taskData.id
		});
	}

	/** 混元视频训练初始化 */
	private async initHyVideoTraining() {
		const { status } = this.taskData as HyVideoTrainingInfoResult;
		if (status === "complete" || status === "failed") return;
		const { hyLoraMonitor } = useHYLora();

		return hyLoraMonitor.setInitData({
			taskId: this.taskData.id
		});
	}

	/** wan 训练初始化 */
	private async initWanTraining() {
		const { status } = this.taskData as WanVideoTrainingInfoResult;
		if (status === "complete" || status === "failed") return;

		const { wanLoraMonitor } = useWanLora();

		return wanLoraMonitor.setInitData({
			taskId: this.taskData.id
		});
	}
}

export async function initTask() {
	try {
		const taskData = await currentTask(8000);
		const taskInitializer = new TaskInitializer(taskData);
		await taskInitializer.init();
	} catch (error) {
		// 404 当前没有任务
		if ((error as AxiosError).status === 404) return;
		console.error("任务初始化失败", error);
	}
}
