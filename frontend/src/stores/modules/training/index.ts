/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:07
 * @LastEditTime: 2025-01-09 11:09:32
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据
 * @FilePath: \frontend\src\stores\modules\training\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type {
	FluxLoraData,
	FluxLoraTaskStatus,
	GPUData,
	MonitorFluxLoraData,
	MonitorGPUData,
	MonitorTagData,
	TagData,
	TagTaskStatus
} from "./types";
export type * from "./types";

export const useTrainingStore = defineStore("training", () => {
	/** 监听GPU相关数据 */
	const monitorGPUData = ref<MonitorGPUData>({
		isListen: false,
		sleepTime: 3000,
		isPolling: false,
		data: {
			gpuPower: 0,
			gpuMemory: 0
		}
	});
	function setGPUIsListen(val: boolean) {
		monitorGPUData.value.isListen = val;
	}
	function setGPUIsPolling(val: boolean) {
		monitorGPUData.value.isPolling = val;
	}
	function setGPUData(data: GPUData) {
		monitorGPUData.value.data = data;
	}
	function resetGPUData() {
		monitorGPUData.value.data = {
			gpuPower: 0,
			gpuMemory: 0
		};
	}

	/** 监听打标数据 */
	const monitorTagData = ref<MonitorTagData>({
		isListen: false,
		taskId: "",
		taskStatus: "none",
		sleepTime: 3000,
		isPolling: false,
		data: {
			current: 0,
			total: 0,
			percentage: 0
		}
	});
	function setTagIsListen(val: boolean) {
		monitorTagData.value.isListen = val;
	}
	function setTagTaskId(taskId: string) {
		monitorTagData.value.taskId = taskId;
	}
	function setTagTaskStatus(status: TagTaskStatus) {
		monitorTagData.value.taskStatus = status;
	}
	function isTagTaskEnd(status?: TagTaskStatus) {
		status = status ?? monitorTagData.value.taskStatus;
		return ["complete", "failed", "none"].includes(status);
	}
	function setTagIsPolling(val: boolean) {
		monitorTagData.value.isPolling = val;
	}
	function setTagData(data: TagData) {
		monitorTagData.value.data = data;
	}
	function resetTagData() {
		monitorTagData.value.data = {
			current: 0,
			total: 0,
			percentage: 0
		};
	}

	/** 监听flux lora训练 */
	const monitorFluxLoraData = ref<MonitorFluxLoraData>({
		isListen: false,
		taskId: "",
		taskStatus: "none",
		sleepTime: 3000,
		isPolling: false,
		data: {
			current: 0,
			elapsed: "",
			loss: 0,
			loss_avr: 0,
			remaining: "",
			speed: 0,
			total: 0,
			progress: 0
		}
	});
	function setFluxLoraIsListen(val: boolean) {
		monitorFluxLoraData.value.isListen = val;
	}
	function setFluxLoraTaskId(taskId: string) {
		monitorFluxLoraData.value.taskId = taskId;
	}
	function setFluxLoraTaskStatus(status: FluxLoraTaskStatus) {
		monitorFluxLoraData.value.taskStatus = status;
	}
	function isFluxLoraTaskEnd(status?: FluxLoraTaskStatus) {
		status = status ?? monitorFluxLoraData.value.taskStatus;
		return ["complete", "failed", "none"].includes(status);
	}
	function setFluxLoraIsPolling(val: boolean) {
		monitorFluxLoraData.value.isPolling = val;
	}
	function setFluxLoraData(data: FluxLoraData) {
		monitorFluxLoraData.value.data = data;
	}
	function resetFluxLoraData() {
		monitorFluxLoraData.value.data = {
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

	/** gpu是否在使用中 */
	const useGPU = computed(() => {
		return !isTagTaskEnd() || !isFluxLoraTaskEnd();
	});

	return {
		monitorGPUData,
		setGPUIsListen,
		setGPUData,
		resetGPUData,
		setGPUIsPolling,
		monitorTagData,
		setTagIsListen,
		setTagTaskId,
		setTagTaskStatus,
		isTagTaskEnd,
		setTagIsPolling,
		setTagData,
		resetTagData,
		monitorFluxLoraData,
		setFluxLoraIsListen,
		setFluxLoraTaskId,
		setFluxLoraTaskStatus,
		isFluxLoraTaskEnd,
		setFluxLoraIsPolling,
		setFluxLoraData,
		resetFluxLoraData,
		useGPU
	};
});
