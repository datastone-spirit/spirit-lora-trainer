/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 16:52:15
 * @LastEditTime: 2025-01-03 16:07:22
 * @LastEditors: mulingyuer
 * @Description: 初始化脚本
 * @FilePath: \frontend\src\init.ts
 * 怎么可能会有bug！！！
 */
import { currentTask } from "@/api/task";
import type { CurrentTaskResult } from "@/api/task";
import { useTag } from "@/hooks/useTag";
import { useTraining } from "@/hooks/useTraining";

/** 打标初始化 */
async function initTag(data: CurrentTaskResult) {
	const { id, status } = data;
	const { isTagTaskEnd, isListenTag, tagTaskId, tagTaskStatus } = useTag();

	// 如果已经完成或者失败，不做任何操作
	if (isTagTaskEnd(status)) return;
	// 未完成只更新状态数据，轮询请求由页面来控制
	isListenTag.value = true;
	tagTaskId.value = id;
	tagTaskStatus.value = status;

	ElMessage({
		message: "当前正在打标...",
		type: "info"
	});
}

/** 训练lora初始化 */
async function initTraining(data: CurrentTaskResult) {
	const { id, status } = data;
	const { isLoraTaskEnd, isListenLora, loraTaskId, loraTaskStatus } = useTraining();

	// 如果已经完成或者失败，不做任何操作
	if (isLoraTaskEnd(status)) return;
	// 未完成只更新状态数据，轮询请求由页面来控制
	isListenLora.value = true;
	loraTaskId.value = id;
	loraTaskStatus.value = status;

	ElMessage({
		message: "当前正在训练LoRA...",
		type: "info"
	});
}

export async function init() {
	try {
		const taskData = await currentTask(8000);
		let initPromise: Promise<void>;

		switch (taskData.task_type) {
			case "captioning": // 打标
				initPromise = initTag(taskData);
				break;
			case "training": // 训练lora
				initPromise = initTraining(taskData);
				break;
		}

		await initPromise;
	} catch (_error) {}
}
