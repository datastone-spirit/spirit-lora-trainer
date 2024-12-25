/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:07
 * @LastEditTime: 2024-12-25 15:58:05
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据
 * @FilePath: \frontend\src\stores\modules\training\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type { GPUData, LoraData, LoraTaskStatus, TagData, TagTaskStatus } from "./types";
export type * from "./types";

export const useTrainingStore = defineStore("training", () => {
	/** 是否监听gpu */
	const isListenGPU = ref(false);
	function setIsListenGPU(value: boolean) {
		isListenGPU.value = value;
	}
	/** gpu监听信息 */
	const gpuData = ref<GPUData>({
		gpuPower: 0,
		gpuMemory: 0
	});
	function setGpuData(data: GPUData) {
		gpuData.value = data;
	}
	function resetGpuData() {
		gpuData.value = {
			gpuPower: 0,
			gpuMemory: 0
		};
	}
	/** gpu监听间隔时间 */
	const gpuSleepTime = ref(3000);
	/** 是否开启了gpu轮询 */
	const isGpuPolling = ref(false);
	function setIsGpuPolling(value: boolean) {
		isGpuPolling.value = value;
	}

	/** 是否监听打标 */
	const isListenTag = ref(false);
	function setIsListenTag(value: boolean) {
		isListenTag.value = value;
	}
	/** 打标的任务id */
	const tagTaskId = ref<string>("");
	function setTagTaskId(taskId: string) {
		tagTaskId.value = taskId;
	}
	/** 打标监听信息 */
	const tagData = ref<TagData>({
		current: 0,
		total: 0,
		percentage: 0
	});
	function setTagData(data: TagData) {
		tagData.value = data;
	}
	function resetTagData() {
		tagData.value = {
			current: 0,
			total: 0,
			percentage: 0
		};
	}
	/** 当前打标的任务状态 */
	const tagTaskStatus = ref<TagTaskStatus>("none");
	function setTagTaskStatus(status: TagTaskStatus) {
		tagTaskStatus.value = status;
	}
	/** 打标监听间隔时间 */
	const tagSleepTime = ref(3000);
	/** 是否开启了打标轮询 */
	const isTagPolling = ref(false);
	function setIsTagPolling(value: boolean) {
		isTagPolling.value = value;
	}

	/** 是否监听lora训练 */
	const isListenLora = ref(false);
	function setIsListenLora(value: boolean) {
		isListenLora.value = value;
	}
	/** lora训练的任务id */
	const loraTaskId = ref<string>("");
	function setLoraTaskId(taskId: string) {
		loraTaskId.value = taskId;
	}
	/** lora训练监听信息 */
	const loraData = ref<LoraData>({
		current: 0,
		elapsed: "",
		loss: 0,
		loss_avr: 0,
		remaining: "",
		speed: 0,
		total: 0,
		progress: 0
	});
	function setLoraData(data: LoraData) {
		loraData.value = data;
	}
	function resetLoraData() {
		loraData.value = {
			current: 0,
			elapsed: "",
			loss: 0,
			loss_avr: 0,
			remaining: "",
			speed: 0,
			total: 0,
			progress: 0
		};
	}
	/** lora训练的任务状态 */
	const loraTaskStatus = ref<LoraTaskStatus>("none");
	function setLoraTaskStatus(status: LoraTaskStatus) {
		loraTaskStatus.value = status;
	}
	/** lora训练监听间隔时间 */
	const loraSleepTime = ref(3000);
	/** 是否开启了lora训练轮询 */
	const isLoraPolling = ref(false);
	function setIsLoraPolling(value: boolean) {
		isLoraPolling.value = value;
	}

	return {
		isListenGPU,
		setIsListenGPU,
		gpuData,
		setGpuData,
		resetGpuData,
		gpuSleepTime,
		isGpuPolling,
		setIsGpuPolling,
		isListenTag,
		setIsListenTag,
		tagTaskId,
		setTagTaskId,
		tagData,
		setTagData,
		resetTagData,
		tagTaskStatus,
		setTagTaskStatus,
		tagSleepTime,
		isTagPolling,
		setIsTagPolling,
		isListenLora,
		setIsListenLora,
		loraTaskId,
		setLoraTaskId,
		loraData,
		setLoraData,
		resetLoraData,
		loraTaskStatus,
		setLoraTaskStatus,
		loraSleepTime,
		isLoraPolling,
		setIsLoraPolling
	};
});
