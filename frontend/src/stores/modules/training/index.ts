/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:07
 * @LastEditTime: 2025-04-02 15:32:09
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
	MonitorWanLoraData,
	TagData,
	WanLoraData
} from "./types";
export type * from "./types";

export const useTrainingStore = defineStore("training", () => {
	/** 监听GPU相关数据 */
	const monitorGPUData = ref<MonitorGPUData>({
		isListen: false,
		data: {
			gpuPower: 0,
			gpuMemory: 0,
			gpuList: []
		}
	});
	function setGPUIsListen(val: boolean) {
		monitorGPUData.value.isListen = val;
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
		data: {
			current: 0,
			total: 0,
			progress: 0
		}
	});
	function setTagIsListen(val: boolean) {
		monitorTagData.value.isListen = val;
	}
	function setTagData(data: TagData) {
		monitorTagData.value.data = data;
	}
	function resetTagData() {
		monitorTagData.value.data = {
			current: 0,
			total: 0,
			progress: 0
		};
	}

	/** 监听wan lora训练 */
	const monitorWanLoraData = ref<MonitorWanLoraData>({
		isListen: false,
		data: {
			current: 0,
			total: 0,
			elapsed: "",
			remaining: 0,
			current_loss: 0,
			average_loss: 0,
			current_epoch: "",
			total_epoch: "",
			showSampling: false,
			samplingPath: "",
			phase: "none",
			progress: 0
		}
	});
	function setWanLoraIsListen(val: boolean) {
		monitorWanLoraData.value.isListen = val;
	}
	function setWanLoraData(data: WanLoraData) {
		monitorWanLoraData.value.data = data;
	}
	function resetWanLoraData() {
		monitorWanLoraData.value.data = {
			current: 0,
			total: 0,
			elapsed: "",
			remaining: 0,
			current_loss: 0,
			average_loss: 0,
			current_epoch: "",
			total_epoch: "",
			showSampling: false,
			samplingPath: "",
			phase: "none",
			progress: 0
		};
	}

	/** 监听flux lora训练 */
	const monitorFluxLoraData = ref<MonitorFluxLoraData>({
		isListen: false,
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
		return (
			monitorTagData.value.isListen ||
			monitorFluxLoraData.value.isListen ||
			monitorHYLoraData.value.isListen ||
			monitorWanLoraData.value.isListen
		);
	});

	/** 当前训练的任务类型 */
	const currentTaskType = ref<LoRATaskType>("none");
	function setCurrentTaskType(type: LoRATaskType) {
		currentTaskType.value = type;
	}

	return {
		monitorGPUData,
		setGPUIsListen,
		setGPUData,
		resetGPUData,
		monitorTagData,
		setTagIsListen,
		setTagData,
		resetTagData,
		monitorFluxLoraData,
		setFluxLoraIsListen,
		setFluxLoraData,
		resetFluxLoraData,
		monitorHYLoraData,
		setHYLoraIsListen,
		setHYLoraData,
		resetHYLoraData,
		useGPU,
		currentTaskType,
		setCurrentTaskType,
		monitorWanLoraData,
		setWanLoraIsListen,
		setWanLoraData,
		resetWanLoraData
	};
});

export type UseTrainingStore = ReturnType<typeof useTrainingStore>;
