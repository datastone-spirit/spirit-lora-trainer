/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 14:54:45
 * @LastEditTime: 2025-01-13 17:01:32
 * @LastEditors: mulingyuer
 * @Description: 任务初始化处理
 * @FilePath: \frontend\src\init-lora-trainer\task.ts
 * 怎么可能会有bug！！！
 */
import { currentTask } from "@/api/task";
import type { CurrentTaskResult } from "@/api/task";
import { useTag } from "@/hooks/useTag";
import { useFluxLora } from "@/hooks/useFluxLora";
import { useHYLora } from "@/hooks/useHYLora";
import type { AxiosError } from "axios";
import type {
	HyVideoTrainingInfoResult,
	LoRATrainingInfoResult,
	ManualTagInfoResult
} from "@/api/monitor";

class TaskInitializer {
	constructor(private readonly taskData: CurrentTaskResult) {}

	/** 初始化 */
	async init() {
		let initPromise: Promise<void>;

		switch (this.taskData.task_type) {
			case "captioning": // 打标
				initPromise = this.initTag();
				break;
			case "training": // flux 训练
				initPromise = this.initFluxTraining();
				break;
			case "hunyuan_training": // 混元视频训练
				initPromise = this.initHyVideoTraining();
				break;
			default:
				console.warn("未知任务类型", this.taskData.task_type);
				initPromise = Promise.resolve();
		}

		return initPromise;
	}

	/** 打标初始化 */
	private async initTag() {
		const { id, status } = this.taskData;
		const { isTagTaskEnd, setTagTaskId, updateTagData } = useTag();

		// 如果当前任务已经完成或者失败，不做任何操作
		if (isTagTaskEnd(status)) return;
		// 未完成只更新状态数据，轮询请求由页面来控制
		setTagTaskId(id);
		updateTagData(this.taskData as ManualTagInfoResult);

		ElMessage({
			message: "当前正在打标...",
			type: "info"
		});
	}

	/** flux 训练初始化 */
	private async initFluxTraining() {
		const { id, status } = this.taskData;
		const { isFluxLoraTaskEnd, setFluxTaskId, updateFluxLoraData } = useFluxLora();

		// 如果已经完成或者失败，不做任何操作
		if (isFluxLoraTaskEnd(status)) return;
		// 未完成只更新状态数据，轮询请求由页面来控制
		setFluxTaskId(id);
		updateFluxLoraData(this.taskData as LoRATrainingInfoResult);

		ElMessage({
			message: "当前正在训练LoRA...",
			type: "info"
		});
	}

	/** 混元视频训练初始化 */
	private async initHyVideoTraining() {
		const { id, status } = this.taskData;
		const { isHYLoraTaskEnd, setHYLoraTaskId, updateHYLoraData } = useHYLora();

		// 如果已经完成或者失败，不做任何操作
		if (isHYLoraTaskEnd(status)) return;
		// 未完成只更新状态数据，轮询请求由页面来控制
		setHYLoraTaskId(id);
		updateHYLoraData(this.taskData as HyVideoTrainingInfoResult);

		ElMessage({
			message: "当前正在训练混元视频LoRA...",
			type: "info"
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
