/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 14:54:45
 * @LastEditTime: 2025-04-02 15:27:16
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
import { useFluxLora } from "@/hooks/useFluxLora";
import { useHYLora } from "@/hooks/useHYLora";
import { useTag } from "@/hooks/useTag";
import type { AxiosError } from "axios";
import { useWanLora } from "@/hooks/useWanLora";

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
		const { initQueryTagTask } = useTag();

		return initQueryTagTask({
			tagTaskData: this.taskData as ManualTagInfoResult,
			showTaskStartPrompt: true
		});
	}

	/** flux 训练初始化 */
	private async initFluxTraining() {
		const { initQueryFluxTask } = useFluxLora();

		return initQueryFluxTask({
			taskData: this.taskData as LoRATrainingInfoResult,
			showTaskStartPrompt: true
		});
	}

	/** 混元视频训练初始化 */
	private async initHyVideoTraining() {
		const { initQueryHYTask } = useHYLora();

		return initQueryHYTask({
			wanTaskData: this.taskData as HyVideoTrainingInfoResult,
			showTaskStartPrompt: true
		});
	}

	/** wan 训练初始化 */
	private async initWanTraining() {
		const { initQueryWanTask } = useWanLora();

		return initQueryWanTask({
			wanTaskData: this.taskData as WanVideoTrainingInfoResult,
			showTaskStartPrompt: true
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
