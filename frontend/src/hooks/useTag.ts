/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 15:26:11
 * @LastEditTime: 2025-01-14 14:17:48
 * @LastEditors: mulingyuer
 * @Description: 打标hooks
 * @FilePath: \frontend\src\hooks\useTag.ts
 * 怎么可能会有bug！！！
 */
import { manualTagInfo, type ManualTagInfoResult } from "@/api/monitor";
import type { TaskStatus } from "@/api/types";
import type { TagData } from "@/stores";
import { useTrainingStore } from "@/stores";
import mitt from "mitt";

export type EventType = Extract<TaskStatus, "complete" | "failed">;
export type Events = Record<EventType, void>;

export const useTag = (() => {
	/** 事件订阅 */
	const tagEvents = mitt<Events>();

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
	function formatData(data: ManualTagInfoResult): TagData {
		const current = data.detail.current >= 0 ? data.detail.current : 0;
		return {
			current,
			total: data.detail.total,
			percentage: calculatePercentage(current, data.detail.total)
		};
	}

	return function useTag() {
		const trainingStore = useTrainingStore();
		const { monitorTagData } = storeToRefs(trainingStore);

		/** 获取打标信息 */
		function getTagData() {
			const taskId = monitorTagData.value.taskId;
			if (taskId.trim() === "") return;

			manualTagInfo({
				task_id: taskId
			})
				.then(updateTagData)
				.catch(() => {
					tagFailed();
				});
		}

		/** 更新打标信息 */
		function updateTagData(res: ManualTagInfoResult) {
			if (!res.detail) return;

			trainingStore.setTagData(formatData(res));
			trainingStore.setTagTaskStatus(res.status);

			switch (res.status) {
				case "running":
				case "created":
					break;
				case "complete": // 完成
					tagComplete();
					break;
				case "failed": // 出错
					tagFailed();
					break;
				default:
					tagFailed();
			}
		}

		/** 打标完成 */
		function tagComplete() {
			// 关闭轮询
			if (timer) clearTimer();

			// 重置状态
			trainingStore.setTagIsListen(false);
			trainingStore.setTagIsPolling(false);
			trainingStore.setTagTaskStatus("none");

			// 触发回调
			tagEvents.emit("complete");

			ElMessageBox({
				title: "打标完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "打标完成，可以开始训练LoRA了"
			});
		}

		/** 打标失败 */
		function tagFailed() {
			// 关闭轮询
			if (timer) clearTimer();

			// 重置状态
			trainingStore.setTagIsListen(false);
			trainingStore.setTagIsPolling(false);
			trainingStore.setTagTaskStatus("none");

			// 触发回调
			tagEvents.emit("failed");

			ElMessageBox({
				title: "打标失败",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "打标失败，请检查日志或者重新打标"
			});
		}

		/** 开始监听 */
		function startTagListen(taskId?: string) {
			if (monitorTagData.value.isPolling) return; // 已经开启了轮询
			if (timer) clearTimer(); // 清理定时器

			taskId && trainingStore.setTagTaskId(taskId);
			if (trainingStore.isTagTaskEnd()) {
				trainingStore.resetTagData();
				trainingStore.setTagTaskStatus("none");
			}

			// 如果任务状态是none，表示是这是旧任务状态，我们应该改成created
			if (monitorTagData.value.taskStatus === "none") {
				trainingStore.setTagTaskStatus("created");
			}

			trainingStore.setTagIsListen(true);
			trainingStore.setTagIsPolling(true);

			timer = setInterval(getTagData, monitorTagData.value.sleepTime);
		}

		/** 停止监听 */
		function stopTagListen(isErrorStop = false) {
			if (!monitorTagData.value.isPolling) return; // 没有开启轮询
			if (timer) clearTimer(); // 清理定时器

			trainingStore.setTagIsListen(false);
			trainingStore.setTagIsPolling(false);

			// 如果任务已经结束就重置数据
			if (isErrorStop || trainingStore.isTagTaskEnd()) {
				trainingStore.setTagTaskId("");
				trainingStore.setTagTaskStatus("none");
				trainingStore.resetTagData();
			}
		}

		return {
			tagEvents,
			monitorTagData: readonly(monitorTagData),
			startTagListen,
			stopTagListen,
			isTagTaskEnd: trainingStore.isTagTaskEnd,
			setTagTaskId: trainingStore.setTagTaskId,
			setTagStatus: trainingStore.setTagTaskStatus,
			updateTagData
		};
	};
})();
