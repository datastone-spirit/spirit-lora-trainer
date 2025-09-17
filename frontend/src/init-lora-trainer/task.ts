/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 14:54:45
 * @LastEditTime: 2025-09-04 16:32:43
 * @LastEditors: mulingyuer
 * @Description: 任务初始化处理
 * @FilePath: \frontend\src\init-lora-trainer\task.ts
 * 怎么可能会有bug！！！
 */
import type {
	FluxKontextTrainingInfoResult,
	HyVideoTrainingInfoResult,
	LoRATrainingInfoResult,
	ManualTagInfoResult,
	QwenImageTrainingInfoResult,
	WanVideoTrainingInfoResult
} from "@/api/monitor";
import { currentTask } from "@/api/task";
import { TaskType } from "@/api/types";
import { useFluxKontextLora } from "@/hooks/task/useFluxKontextLora";
import { useFluxLora } from "@/hooks/task/useFluxLora";
import { useHYLora } from "@/hooks/task/useHYLora";
import { useQwenImageLora } from "@/hooks/task/useQwenImage";
import { useTag } from "@/hooks/task/useTag";
import { useWanLora } from "@/hooks/task/useWanLora";
import type { AxiosError } from "axios";

export async function initTask() {
	try {
		const result = await currentTask();
		const { status, id, task_type } = result;
		const isFinish = status === "complete" || status === "failed";
		if (isFinish) return;

		// 监听任务
		switch (task_type) {
			case TaskType.CAPTIONING: // 打标
				const { tagMonitor } = useTag();
				tagMonitor.setInitData({
					taskId: id,
					result: result as ManualTagInfoResult
				});
				break;
			case TaskType.TRAINING: // flux 训练
				const { fluxLoraMonitor } = useFluxLora();
				fluxLoraMonitor.setInitData({
					taskId: id,
					result: result as LoRATrainingInfoResult
				});
				break;
			case TaskType.HUNYUAN_TRAINING: // 混元视频训练
				const { hyLoraMonitor } = useHYLora();
				hyLoraMonitor.setInitData({
					taskId: id,
					result: result as HyVideoTrainingInfoResult
				});
				break;
			case TaskType.WAN_TRAINING: // wan训练
				const { wanLoraMonitor } = useWanLora();
				wanLoraMonitor.setInitData({
					taskId: id,
					result: result as WanVideoTrainingInfoResult
				});
				break;
			case TaskType.FLUX_KONTEXT_TRAINING: // flux kontext 训练
				const { fluxKontextLoraMonitor } = useFluxKontextLora();
				fluxKontextLoraMonitor.setInitData({
					taskId: id,
					result: result as FluxKontextTrainingInfoResult
				});
				break;
			case TaskType.QWENIMAGE_TRAINING: // qwen image 训练
				const { qwenImageLoraMonitor } = useQwenImageLora();
				qwenImageLoraMonitor.setInitData({
					taskId: id,
					result: result as QwenImageTrainingInfoResult
				});
				break;
			default:
				console.warn("未知任务类型", task_type);
		}
	} catch (error) {
		// 404 当前没有任务
		if ((error as AxiosError).status === 404) return;
		console.error("任务初始化失败", error);
	}
}
