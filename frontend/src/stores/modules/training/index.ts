/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:07
 * @LastEditTime: 2025-03-27 10:38:34
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据
 * @FilePath: \frontend\src\stores\modules\training\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type {
	GPUData,
	MonitorFluxLoraData,
	MonitorGPUData,
	MonitorHYLoraData,
	MonitorTagData,
	TagData
} from "./types";
export type * from "./types";

export const useTrainingStore = defineStore("training", () => {
	/** 监听GPU相关数据 */
	const monitorGPUData = ref<MonitorGPUData>({
		isListen: false,
		sleepTime: 15000,
		isPolling: false,
		data: {
			gpuPower: 0,
			gpuMemory: 0,
			gpuList: []
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
			gpuMemory: 0,
			gpuList: []
		};
	}

	/** 监听打标数据 */
	const monitorTagData = ref<MonitorTagData>({
		isListen: false,
		// taskId: "", // 没什么作用
		// taskStatus: "none", // 没什么作用
		// sleepTime: 3000, // 没什么作用
		// isPolling: false, // 没什么作用
		data: {
			current: 0,
			total: 0,
			percentage: 0
		}
	});
	function setTagIsListen(val: boolean) {
		monitorTagData.value.isListen = val;
	}
	// function setTagTaskId(taskId: string) {
	// 	monitorTagData.value.taskId = taskId;
	// }
	// function setTagTaskStatus(status: MonitorTagData["taskStatus"]) {
	// 	monitorTagData.value.taskStatus = status;
	// }
	// function isTagTaskEnd(status?: MonitorTagData["taskStatus"]) {
	// 	status = status ?? monitorTagData.value.taskStatus;
	// 	return ["complete", "failed", "none"].includes(status);
	// }
	// function setTagIsPolling(val: boolean) {
	// 	monitorTagData.value.isPolling = val;
	// }
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
		sleepTime: 15000,
		isPolling: false,
		data: {
			current: 0,
			elapsed: "",
			loss: 0,
			loss_avr: 0,
			remaining: "",
			speed: 0,
			total: 0,
			progress: 0,
			samplingPath: "",
			showSampling: false
		}
	});
	function setFluxLoraIsListen(val: boolean) {
		monitorFluxLoraData.value.isListen = val;
	}
	function setFluxLoraTaskId(taskId: string) {
		monitorFluxLoraData.value.taskId = taskId;
	}
	function setFluxLoraTaskStatus(status: MonitorFluxLoraData["taskStatus"]) {
		monitorFluxLoraData.value.taskStatus = status;
	}
	function isFluxLoraTaskEnd(status?: MonitorFluxLoraData["taskStatus"]) {
		status = status ?? monitorFluxLoraData.value.taskStatus;
		return ["complete", "failed", "none"].includes(status);
	}
	function setFluxLoraIsPolling(val: boolean) {
		monitorFluxLoraData.value.isPolling = val;
	}
	function setFluxLoraData(data: MonitorFluxLoraData["data"]) {
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
			progress: 0,
			samplingPath: "",
			showSampling: false
		};
	}

	/** 监听混元视频 lora训练 */
	const monitorHYLoraData = ref<MonitorHYLoraData>({
		isListen: false,
		taskId: "",
		taskStatus: "none",
		sleepTime: 15000,
		isPolling: false,
		data: {
			current: 0,
			total: 0,
			progress: 0,
			elapsed: 0,
			epoch_elapsed: 0,
			epoch_loss: 0,
			estimate_elapsed: 0,
			loss: 0,
			current_epoch: "??",
			total_epoch: "??"
		}
	});
	function setHYLoraIsListen(val: boolean) {
		monitorHYLoraData.value.isListen = val;
	}
	function setHYLoraTaskId(taskId: string) {
		monitorHYLoraData.value.taskId = taskId;
	}
	function setHYLoraTaskStatus(status: MonitorHYLoraData["taskStatus"]) {
		monitorHYLoraData.value.taskStatus = status;
	}
	function isHYLoraTaskEnd(status?: MonitorHYLoraData["taskStatus"]) {
		status = status ?? monitorHYLoraData.value.taskStatus;
		return ["complete", "failed", "none"].includes(status);
	}
	function setHYLoraIsPolling(val: boolean) {
		monitorHYLoraData.value.isPolling = val;
	}
	function setHYLoraData(data: MonitorHYLoraData["data"]) {
		monitorHYLoraData.value.data = data;
	}
	function resetHYLoraData() {
		monitorHYLoraData.value.data = {
			current: 0,
			total: 0,
			progress: 0,
			elapsed: 0,
			epoch_elapsed: 0,
			epoch_loss: 0,
			estimate_elapsed: 0,
			loss: 0,
			current_epoch: "??",
			total_epoch: "??"
		};
	}

	/** gpu是否在使用中 */
	const useGPU = computed(() => {
		return monitorTagData.value.isListen || !isFluxLoraTaskEnd() || !isHYLoraTaskEnd();
	});

	return {
		monitorGPUData,
		setGPUIsListen,
		setGPUData,
		resetGPUData,
		setGPUIsPolling,
		monitorTagData,
		setTagIsListen,
		// setTagTaskId,
		// setTagTaskStatus,
		// isTagTaskEnd,
		// setTagIsPolling,
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
		monitorHYLoraData,
		setHYLoraIsListen,
		setHYLoraTaskId,
		setHYLoraTaskStatus,
		isHYLoraTaskEnd,
		setHYLoraIsPolling,
		setHYLoraData,
		resetHYLoraData,
		useGPU
	};
});
