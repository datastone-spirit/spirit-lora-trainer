/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 15:26:11
 * @LastEditTime: 2025-01-03 17:38:02
 * @LastEditors: mulingyuer
 * @Description: 打标hooks
 * @FilePath: \frontend\src\hooks\useTag.ts
 * 怎么可能会有bug！！！
 */
import type { ManualTagInfoResult } from "@/api/monitor";
import { manualTagInfo } from "@/api/monitor";
import type { TaskStatus } from "@/api/types";
import type { TagData, TagTaskStatus } from "@/stores";
import { useTrainingStore } from "@/stores";

type EventType = Extract<TaskStatus, "complete" | "failed">;
type EventCallback = () => void;

export const useTag = (() => {
	const events: Record<EventType, Array<EventCallback>> = {
		/** 打标完成回调数组 */
		complete: [],
		/** 打标失败回调数组 */
		failed: []
	};

	return function useTag() {
		const trainingStore = useTrainingStore();
		const trainingRefs = storeToRefs(trainingStore);

		/** 是否监听打标 */
		const isListenTag = trainingRefs.isListenTag;
		/** 打标任务id */
		const tagTaskId = trainingRefs.tagTaskId;
		/** 打标的信息 */
		const tagData = trainingRefs.tagData;
		/** 打标监听间隔时间 */
		const tagSleepTime = trainingRefs.tagSleepTime;
		/** 是否开启了打标轮询 */
		const isTagPolling = trainingRefs.isTagPolling;
		/** 当前打标任务状态 */
		const tagTaskStatus = trainingRefs.tagTaskStatus;
		/** 定时器 */
		let timer: number | null = null;

		/** 订阅打标完成 */
		function addTagEventListener(type: EventType, callback: EventCallback) {
			const eventList = events[type];
			if (!eventList) return;
			// 防止重复添加
			const isExist = eventList.includes(callback);
			if (isExist) return;

			eventList.push(callback);
		}

		/** 取消订阅打标完成 */
		function removeTagEventListener(type: EventType, callback: EventCallback) {
			const eventList = events[type];
			if (!eventList) return;
			const index = eventList.findIndex((item) => item === callback);
			if (index === -1) return;
			eventList.splice(index, 1);
		}

		/** 根据任务状态判断是否已经结束 */
		function isTagTaskEnd(status?: TagTaskStatus) {
			status = status ?? tagTaskStatus.value;
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
		function formatData(data: ManualTagInfoResult): TagData {
			const current = data.detail.current >= 0 ? data.detail.current : 0;
			return {
				current,
				total: data.detail.total,
				percentage: calculatePercentage(current, data.detail.total)
			};
		}

		/** 清理定时器 */
		function clearTimer() {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		}

		/** 轮询获取打标信息 */
		function updateTagData() {
			if (!isListenTag.value) return;
			if (tagTaskId.value.trim() === "") return;

			manualTagInfo({
				task_id: tagTaskId.value
			}).then((res) => {
				if (!res.detail) return;
				trainingStore.setTagData(formatData(res));
				trainingStore.setTagTaskStatus(res.status);

				switch (res.status) {
					case "complete": // 完成
						tagComplete();
						break;
					case "failed": // 出错
						tagFailed();
						break;
				}
			});
		}

		/** 打标完成 */
		function tagComplete() {
			// 关闭轮询
			if (timer) clearTimer();
			trainingStore.setIsTagPolling(false);
			trainingStore.setIsListenTag(false);
			tagTaskStatus.value = "none";
			// 触发回调
			events.complete.forEach((callback) => callback());

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
			trainingStore.setIsTagPolling(false);
			trainingStore.setIsListenTag(false);
			tagTaskStatus.value = "none";
			// 触发回调
			events.failed.forEach((callback) => callback());

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
			if (isTagPolling.value) return;
			if (timer) clearTimer();
			taskId && (tagTaskId.value = taskId);
			if (isTagTaskEnd(tagTaskStatus.value)) {
				trainingStore.resetTagData();
				tagTaskStatus.value = "none";
			}
			if (tagTaskStatus.value === "none") {
				tagTaskStatus.value = "created";
			}
			trainingStore.setIsListenTag(true);
			trainingStore.setIsTagPolling(true);
			timer = setInterval(updateTagData, tagSleepTime.value);
		}

		/** 停止监听 */
		function stopTagListen() {
			if (!isTagPolling.value) return;
			if (timer) clearTimer();
			trainingStore.setIsTagPolling(false);
			trainingStore.setIsListenTag(false);
			// 如果已经完成或者失败，就停止
			// 如果没有完成或者失败，就暂停轮询
			if (isTagTaskEnd(tagTaskStatus.value)) {
				tagTaskId.value = "";
				trainingStore.resetTagData();
				tagTaskStatus.value = "none";
			}
		}

		return {
			isListenTag,
			tagTaskId,
			tagData,
			tagTaskStatus,
			addTagEventListener,
			removeTagEventListener,
			isTagTaskEnd,
			startTagListen,
			stopTagListen
		};
	};
})();
