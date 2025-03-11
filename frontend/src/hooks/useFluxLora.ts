/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 10:17:35
 * @LastEditTime: 2025-03-11 10:28:43
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
import { Log, serializeError } from "@/utils/log";
import { isNetworkError } from "@/request";

export type Events = {
	complete: void;
	failed: void;
};

interface FirstGetConfig {
	open: boolean;
	callbackList: Array<(res: LoRATrainingInfoResult) => void>;
}

export interface FluxLoraOptions {
	/** 是否首次获取训练配置 */
	isFirstGetConfig?: FirstGetConfig["open"];
	/** 首次获取训练配置的回调 */
	firstGetConfigCallback?: FirstGetConfig["callbackList"][number];
}

export const useFluxLora = (() => {
	/** 事件订阅 */
	const fluxLoraEvents = mitt<Events>();
	// 弹窗状态
	let showCompleteMessage = false;
	let showErrorMessage = false;
	// 首次获取配置
	const firstGetConfig: FirstGetConfig = {
		open: false,
		callbackList: []
	};
	//

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
		let detail = data?.detail ?? {};
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

	return function useFluxLora(options: FluxLoraOptions = {}) {
		const trainingStore = useTrainingStore();
		const { monitorFluxLoraData } = storeToRefs(trainingStore);
		firstGetConfig.open = options.isFirstGetConfig ?? firstGetConfig.open;
		if (typeof options.firstGetConfigCallback === "function") {
			firstGetConfig.callbackList.push(options.firstGetConfigCallback);
		}

		/** 获取lora训练信息 */
		function getFluxLoraData() {
			const taskId = monitorFluxLoraData.value.taskId;
			if (taskId.trim() === "") return;
			loRATrainingInfo({
				task_id: taskId,
				show_config: firstGetConfig.open ? true : false
			})
				.then((res) => {
					// 首次获取配置
					if (firstGetConfig.open) {
						firstGetConfig.open = false;
						firstGetConfig.callbackList.forEach((callback) => callback(res));
						firstGetConfig.callbackList = [];
					}
					// 更新网络弹窗
					if (trainingStore.isOffline) trainingStore.setIsOffline(false);

					return updateFluxLoraData(res);
				})
				.catch((error) => {
					const status = error?.status ?? 0;
					const is5xxError = status >= 500 && status < 600;
					if (isNetworkError(error) || is5xxError) {
						trainingStore.setIsOffline(true);
						return;
					}
					// 错误处理
					fluxLoraFailed({ showMessage: status === 404 });
					// TODO: 加一个缓存日志
					Log.log("useFluxLora1", {
						createTime: Date.now(),
						source: "getFluxLoraData -> loRATrainingInfo -> catch",
						message: error.message,
						error: serializeError(error)
					});
				});
		}

		/** 更新训练信息 */
		function updateFluxLoraData(res: LoRATrainingInfoResult) {
			trainingStore.setFluxLoraData(formatData(res));
			trainingStore.setFluxLoraTaskStatus(res.status);

			if (!res?.detail) return;
			if (isEmptyObject(res?.detail)) return;

			switch (res.status) {
				case "created":
				case "running":
					break;
				case "complete": // 完成
					fluxLoraComplete();
					break;
				case "failed": // 出错
					fluxLoraFailed();
					// TODO: 加一个缓存日志
					Log.log("useFluxLora2", {
						createTime: Date.now(),
						source: "updateFluxLoraData -> switch -> failed",
						message: res
					});
					break;
				// default:
				// 	fluxLoraFailed();
			}
		}

		/** LoRA训练完成 */
		function fluxLoraComplete(options: { showMessage: boolean } = { showMessage: true }) {
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
			if (showCompleteMessage || !options.showMessage) return;
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
		function fluxLoraFailed(options: { showMessage: boolean } = { showMessage: true }) {
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
			if (showErrorMessage || !options.showMessage) return;
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
