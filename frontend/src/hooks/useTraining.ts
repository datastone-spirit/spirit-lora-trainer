/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 16:06:24
 * @LastEditTime: 2024-12-31 17:20:53
 * @LastEditors: mulingyuer
 * @Description: 训练lora hooks
 * @FilePath: \frontend\src\hooks\useTraining.ts
 * 怎么可能会有bug！！！
 */
import type { TaskStatus } from "@/api/types";
import { useTrainingStore } from "@/stores";
import type { LoraTaskStatus, LoraData } from "@/stores";
import { loRATrainingInfo } from "@/api/monitor";
import type { LoRATrainingInfoResult } from "@/api/monitor";
import { isEmptyObject, sleep } from "@/utils/tools";

type EventType = Extract<TaskStatus, "complete" | "failed">;
type EventCallback = () => void;

export const useTraining = (() => {
	const events: Record<EventType, Array<EventCallback>> = {
		/** 训练完成回调数组 */
		complete: [],
		/** 训练失败回调数组 */
		failed: []
	};

	return function useTraining() {
		const trainingStore = useTrainingStore();
		const trainingRefs = storeToRefs(trainingStore);

		/** 是否监听了lora训练 */
		const isListenLora = trainingRefs.isListenLora;
		/** 训练任务id */
		const loraTaskId = trainingRefs.loraTaskId;
		/** lora训练的信息 */
		const loraData = trainingRefs.loraData;
		/** 训练监听间隔时间 */
		const loraSleepTime = trainingRefs.loraSleepTime;
		/** 是否开启了训练轮询 */
		const isLoraPolling = trainingRefs.isLoraPolling;
		/** 训练任务状态 */
		const loraTaskStatus = trainingRefs.loraTaskStatus;

		/** 订阅lora训练 */
		function addLoraEventListener(type: EventType, callback: EventCallback) {
			const eventList = events[type];
			if (!eventList) return;
			// 防止重复添加
			const isExist = eventList.includes(callback);
			if (isExist) return;

			eventList.push(callback);
		}

		/** 取消订阅lora训练 */
		function removeLoraEventListener(type: EventType, callback: EventCallback) {
			const eventList = events[type];
			if (!eventList) return;
			const index = eventList.findIndex((item) => item === callback);
			if (index === -1) return;
			eventList.splice(index, 1);
		}

		/** 根据任务状态判断是否已经结束 */
		function isLoraTaskEnd(status: LoraTaskStatus) {
			return ["complete", "failed", "none"].includes(status);
		}

		/** 计算百分比 */
		function calculatePercentage(current: number, total: number) {
			if (total <= 0) return 0;
			if (current <= 0) return 0;
			const value = Math.floor((current / total) * 100);
			return value > 100 ? 100 : value;
		}

		/** 格式化数据 */
		function formatData(data: LoRATrainingInfoResult): LoraData {
			let detail = data.detail ?? {};
			if (typeof detail === "string") detail = {};
			const loraData: LoraData = {
				current: detail.current ?? 0,
				elapsed: detail.elapsed ?? "00:00",
				loss: detail.loss ?? 0,
				loss_avr: detail.loss_avr ?? 0,
				remaining: detail.remaining ?? "00:00",
				speed: detail.speed ?? 0,
				total: detail.total ?? 0,
				progress: 0,
				raw: data
			};
			loraData.progress = calculatePercentage(loraData.current, loraData.total);
			return loraData;
		}

		/** 轮询获取lora训练信息 */
		function updateLoraData() {
			if (!isListenLora.value) return;
			if (loraTaskId.value.trim() === "") return;

			loRATrainingInfo({
				task_id: loraTaskId.value
			})
				.then((res) => {
					if (!res.detail) return;
					if (isEmptyObject(res.detail)) return;
					trainingStore.setLoraData(formatData(res));
					trainingStore.setLoraTaskStatus(res.status);

					switch (res.status) {
						case "complete": // 完成
							loraComplete();
							break;
						case "failed": // 出错
							loraFailed();
							break;
					}
				})
				.finally(() => {
					isListenLora.value && sleep(loraSleepTime.value).then(updateLoraData);
				});
		}

		/** LoRA训练完成 */
		function loraComplete() {
			// 关闭轮询
			trainingStore.setIsLoraPolling(false);
			trainingStore.setIsListenLora(false);
			loraTaskStatus.value = "none";
			// 触发回调
			events.complete.forEach((callback) => callback());

			ElMessageBox({
				title: "训练完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练成功，请检查保存目录下的LoRA模型文件"
			});
		}

		/** LoRA训练失败 */
		function loraFailed() {
			// 关闭轮询
			trainingStore.setIsLoraPolling(false);
			trainingStore.setIsListenLora(false);
			loraTaskStatus.value = "none";
			// 触发回调
			events.failed.forEach((callback) => callback());

			ElMessageBox({
				title: "训练失败",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练失败，请检查日志或者重新训练"
			});
		}

		/** 开始监听 */
		function startLoraListen(taskId?: string) {
			if (isLoraPolling.value) return;
			taskId && (loraTaskId.value = taskId);
			if (isLoraTaskEnd(loraTaskStatus.value)) {
				trainingStore.resetLoraData();
				loraTaskStatus.value = "none";
			}
			if (loraTaskStatus.value === "none") {
				loraTaskStatus.value = "created";
			}
			trainingStore.setIsListenLora(true);
			trainingStore.setIsLoraPolling(true);
			updateLoraData();
		}

		/** 停止监听 */
		function stopLoraListen() {
			if (!isLoraPolling.value) return;
			trainingStore.setIsLoraPolling(false);
			trainingStore.setIsListenLora(false);
			// 如果已经完成或者失败，就停止
			// 如果没有完成或者失败，就暂停轮询
			if (isLoraTaskEnd(loraTaskStatus.value)) {
				loraTaskId.value = "";
				trainingStore.resetLoraData();
				loraTaskStatus.value = "none";
			}
		}

		return {
			isListenLora,
			loraTaskId,
			loraData,
			loraTaskStatus,
			addLoraEventListener,
			removeLoraEventListener,
			isLoraTaskEnd,
			startLoraListen,
			stopLoraListen
		};
	};
})();

// import { startFluxTraining } from "@/api/lora";
// import type { StartFluxTrainingData } from "@/api/lora";

// type TrainingStatus = "complete" | "created" | "running" | "failed" | "null";

// /** 是否在训练 */
// const isTraining = ref(false);
// /** 训练的状态 */
// const trainingStatus = ref<TrainingStatus>("null");
// /** 训练任务id */
// const trainingTaskId = ref<string | null>(null);

// export function useTraining() {
// 	/** 更新是否在训练 */
// 	function updateIsTraining(value: boolean) {
// 		isTraining.value = value;
// 	}

// 	/** 更新训练状态 */
// 	function updateTrainingStatus(status: TrainingStatus) {
// 		trainingStatus.value = status;
// 	}

// 	/** 更新任务id */
// 	function updateTaskId(taskId: string | null) {
// 		trainingTaskId.value = taskId;
// 	}

// 	/** 开始训练 */
// 	async function startTraining(data: StartFluxTrainingData) {
// 		const { task_id } = await startFluxTraining(data);

// 		// 更新数据
// 		trainingTaskId.value = task_id;
// 		trainingStatus.value = "running";
// 		isTraining.value = true;

// 		return task_id;
// 	}

// 	/** 停止训练 */
// 	function stopTraining() {
// 		trainingTaskId.value = null;
// 		trainingStatus.value = "null";
// 		isTraining.value = false;
// 	}

// 	return {
// 		isTraining: readonly(isTraining),
// 		trainingStatus: readonly(trainingStatus),
// 		trainingTaskId: readonly(trainingTaskId),
// 		updateIsTraining,
// 		updateTrainingStatus,
// 		updateTaskId,
// 		startTraining,
// 		stopTraining
// 	};
// }
