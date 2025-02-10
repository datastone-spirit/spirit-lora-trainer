/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 10:17:35
 * @LastEditTime: 2025-02-10 10:57:23
 * @LastEditors: mulingyuer
 * @Description: 训练 flux lora hooks
 * @FilePath: \frontend\src\hooks\useFluxLora.ts
 * 怎么可能会有bug！！！
 */
import { loRATrainingInfo, type LoRATrainingInfoResult } from "@/api/monitor";
import type { MonitorFluxLoraData } from "@/stores";
import { useTrainingStore } from "@/stores";
import { isEmptyObject } from "@/utils/tools";
import mitt from "mitt";

type EventType = Extract<MonitorFluxLoraData["taskStatus"], "complete" | "failed">;
export type Events = Record<EventType, void>;

export const useFluxLora = (() => {
	/** 事件订阅 */
	const fluxLoraEvents = mitt<Events>();
	// 弹窗状态
	let showCompleteMessage = false;
	let showErrorMessage = false;

	/** 定时器 */
	let timer: number | null = null;
	/** 清理定时器 */
	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	/** 计算百分比 */
	function calculatePercentage(current: number, total: number) {
		if (total <= 0) return 0;
		if (current <= 0) return 0;
		const value = Math.floor((current / total) * 100);
		return value > 100 ? 100 : value;
	}

	/** 格式化数据 */
	function formatData(data: LoRATrainingInfoResult): MonitorFluxLoraData["data"] {
		let detail = data.detail ?? {};
		if (typeof detail === "string") detail = {};
		const loraData: MonitorFluxLoraData["data"] = {
			current: detail.current ?? 0,
			elapsed: detail.elapsed ?? "00:00",
			loss: detail.loss ?? 0,
			loss_avr: detail.loss_avr ?? 0,
			remaining: detail.remaining ?? "00:00",
			speed: detail.speed ?? 0,
			total: detail.total ?? 0,
			progress: 0,
			showSampling: data.is_sampling ?? false,
			samplingPath: data.sampling_path ?? "",
			raw: data
		};
		loraData.progress = calculatePercentage(loraData.current, loraData.total);
		return loraData;
	}

	return function useFluxLora() {
		const trainingStore = useTrainingStore();
		const { monitorFluxLoraData } = storeToRefs(trainingStore);

		/** 获取lora训练信息 */
		function getFluxLoraData() {
			const taskId = monitorFluxLoraData.value.taskId;
			if (taskId.trim() === "") return;

			loRATrainingInfo({
				task_id: taskId
			})
				.then(updateFluxLoraData)
				.catch(() => {
					fluxLoraFailed();
				});
		}

		/** 更新训练信息 */
		function updateFluxLoraData(res: LoRATrainingInfoResult) {
			trainingStore.setFluxLoraData(formatData(res));
			trainingStore.setFluxLoraTaskStatus(res.status);

			if (!res.detail) return;
			if (isEmptyObject(res.detail)) return;

			switch (res.status) {
				case "created":
				case "running":
					break;
				case "complete": // 完成
					fluxLoraComplete();
					break;
				case "failed": // 出错
					fluxLoraFailed();
					break;
				default:
					fluxLoraFailed();
			}
		}

		/** LoRA训练完成 */
		function fluxLoraComplete() {
			// 关闭轮询
			if (timer) clearTimer();
			if (monitorFluxLoraData.value.taskStatus === "none") return;

			// 重置状态
			trainingStore.setFluxLoraIsListen(false);
			trainingStore.setFluxLoraIsPolling(false);
			trainingStore.setFluxLoraTaskStatus("none");
			trainingStore.resetFluxLoraData();

			// 触发回调
			fluxLoraEvents.emit("complete");

			// 防止重复弹窗
			if (showCompleteMessage) return;
			showCompleteMessage = true;
			ElMessageBox({
				title: "训练完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练成功，请检查保存目录下的LoRA模型文件"
			}).finally(() => {
				showCompleteMessage = false;
			});
		}

		/** LoRA训练失败 */
		function fluxLoraFailed() {
			// 关闭轮询
			if (timer) clearTimer();
			if (monitorFluxLoraData.value.taskStatus === "none") return;

			// 重置状态
			trainingStore.setFluxLoraIsListen(false);
			trainingStore.setFluxLoraIsPolling(false);
			trainingStore.setFluxLoraTaskStatus("none");
			trainingStore.resetFluxLoraData();

			// 触发回调
			fluxLoraEvents.emit("failed");

			// 防止重复弹窗
			if (showErrorMessage) return;
			showErrorMessage = true;
			ElMessageBox({
				title: "训练失败",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练失败，请检查日志或者重新训练"
			}).finally(() => {
				showErrorMessage = false;
			});
		}

		/** 开始监听 */
		function startFluxLoraListen(taskId?: string) {
			if (monitorFluxLoraData.value.isPolling) return; // 已经开启了轮询
			if (timer) clearTimer(); // 清理定时器

			taskId && trainingStore.setFluxLoraTaskId(taskId);
			if (trainingStore.isFluxLoraTaskEnd()) {
				trainingStore.resetFluxLoraData();
				trainingStore.setFluxLoraTaskStatus("none");
			}

			// 如果任务状态是none，表示是这是旧任务状态，我们应该改成created
			if (monitorFluxLoraData.value.taskStatus === "none") {
				trainingStore.setFluxLoraTaskStatus("created");
			}

			trainingStore.setFluxLoraIsListen(true);
			trainingStore.setFluxLoraIsPolling(true);

			timer = setInterval(getFluxLoraData, monitorFluxLoraData.value.sleepTime);
		}

		/** 停止监听 */
		function stopFluxLoraListen(isErrorStop = false) {
			if (!monitorFluxLoraData.value.isPolling) return; // 没有开启轮询
			if (timer) clearTimer(); // 清理定时器

			trainingStore.setFluxLoraIsListen(false);
			trainingStore.setFluxLoraIsPolling(false);

			// 如果任务已经结束就重置数据
			if (trainingStore.isFluxLoraTaskEnd() || isErrorStop) {
				trainingStore.setFluxLoraTaskId("");
				trainingStore.setFluxLoraTaskStatus("none");
				trainingStore.resetFluxLoraData();
			}
		}

		return {
			fluxLoraEvents,
			monitorFluxLoraData: readonly(monitorFluxLoraData),
			startFluxLoraListen,
			stopFluxLoraListen,
			isFluxLoraTaskEnd: trainingStore.isFluxLoraTaskEnd,
			setFluxTaskId: trainingStore.setFluxLoraTaskId,
			setFluxStatus: trainingStore.setFluxLoraTaskStatus,
			updateFluxLoraData
		};
	};
})();
