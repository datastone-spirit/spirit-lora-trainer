/*
 * @Author: mulingyuer
 * @Date: 2025-01-13 10:24:35
 * @LastEditTime: 2025-02-10 08:33:30
 * @LastEditors: mulingyuer
 * @Description: 训练混元视频 lora hooks
 * @FilePath: \frontend\src\hooks\useHYLora.ts
 * 怎么可能会有bug！！！
 */
import type { HyVideoTrainingInfoResult } from "@/api/monitor";
import { hyVideoTrainingInfo } from "@/api/monitor";
import type { MonitorHYLoraData } from "@/stores";
import { useTrainingStore } from "@/stores";
import { isEmptyObject } from "@/utils/tools";
import mitt from "mitt";
import BigNumber from "bignumber.js";

type EventType = Extract<MonitorHYLoraData["taskStatus"], "complete" | "failed">;
export type Events = Record<EventType, void>;

export const useHYLora = (() => {
	/** 事件订阅 */
	const hyLoraEvents = mitt<Events>();

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
	function formatData(data: HyVideoTrainingInfoResult): MonitorHYLoraData["data"] {
		const detail = typeof data.detail === "string" ? {} : (data.detail ?? {});

		const loraData: MonitorHYLoraData["data"] = {
			current: detail.current ?? 0,
			total: "??",
			elapsed: detail.elapsed ?? 0,
			epoch_elapsed: 0,
			estimate_elapsed: 0,
			loss: detail.loss ?? 0,
			epoch_loss: detail.epoch_loss ?? 0,
			progress: 0,
			current_epoch: detail.current_epoch ?? "??",
			total_epoch: detail.total_epoch ?? "??",
			raw: data
		};

		// 只有第一轮结束后才有预估每轮步数 estimate_steps_per_epoch
		// 第一轮是用轮数算百分比
		// 第二轮有预估每轮步数后用步数来算百分比
		const isPerEpoch = "current_epoch" in detail;
		let current = 0;
		let total = 0;
		if (!isPerEpoch) {
			// 第一轮
			current = 1;
			total = detail.total_epoch ?? 0;
			loraData.current_epoch = 1;
		} else {
			// current = detail.current ?? 0;
			// const steps = detail.estimate_steps_per_epoch ?? 0;
			// const total_epoch = detail.total_epoch ?? 0;
			// total = steps * total_epoch;
			current = detail.current ?? 0;
			const current_epoch = detail.current_epoch ?? 0;
			const steps = Math.ceil(current / current_epoch); //每轮的步数
			const total_epoch = detail.total_epoch ?? 0;
			total = steps * total_epoch;

			loraData.total = total;
			loraData.epoch_elapsed = new BigNumber(loraData.elapsed)
				.dividedBy(detail.current_epoch ?? 1)
				.toNumber();
			loraData.estimate_elapsed = new BigNumber(loraData.epoch_elapsed)
				.multipliedBy(detail.total_epoch ?? 1)
				.toNumber();
		}

		loraData.progress = calculatePercentage(current, total);

		return loraData;
	}

	return function useHYLora() {
		const trainingStore = useTrainingStore();
		const { monitorHYLoraData } = storeToRefs(trainingStore);

		/** 获取lora训练信息 */
		function getHYLoraData() {
			const taskId = monitorHYLoraData.value.taskId;
			if (taskId.trim() === "") return;

			hyVideoTrainingInfo({
				task_id: taskId
			})
				.then(updateHYLoraData)
				.catch(() => {
					hyLoraFailed();
				});
		}

		/** 更新训练信息 */
		function updateHYLoraData(res: HyVideoTrainingInfoResult) {
			trainingStore.setHYLoraData(formatData(res));
			trainingStore.setHYLoraTaskStatus(res.status);

			if (!res.detail) return;
			if (isEmptyObject(res.detail)) return;

			switch (res.status) {
				case "created":
				case "running":
					break;
				case "complete": // 完成
					hyLoraComplete();
					break;
				case "failed": // 出错
					hyLoraFailed();
					break;
				default:
					hyLoraFailed();
			}
		}

		/** LoRA训练完成 */
		function hyLoraComplete() {
			// 关闭轮询
			if (timer) clearTimer();

			// 重置状态
			trainingStore.setHYLoraIsListen(false);
			trainingStore.setHYLoraIsPolling(false);
			trainingStore.setHYLoraTaskStatus("none");
			trainingStore.resetHYLoraData();

			// 触发回调
			hyLoraEvents.emit("complete");

			ElMessageBox({
				title: "训练完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练成功，请检查保存目录下的LoRA模型文件"
			});
		}

		/** LoRA训练失败 */
		function hyLoraFailed() {
			// 关闭轮询
			if (timer) clearTimer();

			// 重置状态
			trainingStore.setHYLoraIsListen(false);
			trainingStore.setHYLoraIsPolling(false);
			trainingStore.setHYLoraTaskStatus("none");
			trainingStore.resetHYLoraData();

			// 触发回调
			hyLoraEvents.emit("failed");

			ElMessageBox({
				title: "训练失败",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练失败，请检查日志或者重新训练"
			});
		}

		/** 开始监听 */
		function startHYLoraListen(taskId?: string) {
			if (monitorHYLoraData.value.isPolling) return; // 已经开启了轮询
			if (timer) clearTimer(); // 清理定时器

			taskId && trainingStore.setHYLoraTaskId(taskId);
			if (trainingStore.isHYLoraTaskEnd()) {
				trainingStore.resetHYLoraData();
				trainingStore.setHYLoraTaskStatus("none");
			}

			// 如果任务状态是none，表示是这是旧任务状态，我们应该改成created
			if (monitorHYLoraData.value.taskStatus === "none") {
				trainingStore.setHYLoraTaskStatus("created");
			}

			trainingStore.setHYLoraIsListen(true);
			trainingStore.setHYLoraIsPolling(true);

			timer = setInterval(getHYLoraData, monitorHYLoraData.value.sleepTime);
		}

		/** 停止监听 */
		function stopHYLoraListen(isErrorStop = false) {
			if (!monitorHYLoraData.value.isPolling) return; // 没有开启轮询
			if (timer) clearTimer(); // 清理定时器

			trainingStore.setHYLoraIsListen(false);
			trainingStore.setHYLoraIsPolling(false);

			// 如果任务已经结束就重置数据
			if (trainingStore.isHYLoraTaskEnd() || isErrorStop) {
				trainingStore.setHYLoraTaskId("");
				trainingStore.setHYLoraTaskStatus("none");
				trainingStore.resetHYLoraData();
			}
		}

		return {
			hyLoraEvents,
			monitorHYLoraData: readonly(monitorHYLoraData),
			startHYLoraListen,
			stopHYLoraListen,
			isHYLoraTaskEnd: trainingStore.isHYLoraTaskEnd,
			setHYLoraTaskId: trainingStore.setHYLoraTaskId,
			setHYLoraStatus: trainingStore.setHYLoraTaskStatus,
			updateHYLoraData
		};
	};
})();
