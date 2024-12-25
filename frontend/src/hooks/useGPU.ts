/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 17:37:15
 * @LastEditTime: 2024-12-25 15:12:44
 * @LastEditors: mulingyuer
 * @Description: gpu hooks
 * @FilePath: \frontend\src\hooks\useGPU.ts
 * 怎么可能会有bug！！！
 */
import { gpuMonitorInfo } from "@/api/monitor";
import type { GPUMonitorInfoResult } from "@/api/monitor";
import { sleep } from "@/utils/tools";
import { useTrainingStore } from "@/stores";
import type { GPUData } from "@/stores";

export function useGPU() {
	const trainingStore = useTrainingStore();
	const trainingRefs = storeToRefs(trainingStore);

	/** 是否监听gpu */
	const isListenGPU = readonly(trainingRefs.isListenGPU);
	/** gpu数据 */
	const gpuData = readonly(trainingRefs.gpuData);
	/** gpu监听间隔时间 */
	const gpuSleepTime = readonly(trainingRefs.gpuSleepTime);
	/** 是否开启了gpu轮询 */
	const isGpuPolling = readonly(trainingRefs.isGpuPolling);

	/** 计算百分比 */
	function calculatePercentage(current: number, total: number) {
		return Math.floor((current / total) * 100);
	}

	/** 格式化数据 */
	function formatData(data: GPUMonitorInfoResult[number]): GPUData {
		return {
			gpuMemory: calculatePercentage(data.memory_used_mb, data.memory_total_mb),
			gpuPower: calculatePercentage(data.power_draw_watts, data.power_total_watts)
		};
	}

	/** 轮询获取gpu数据 */
	function updateGpuData() {
		if (!isListenGPU.value) return;
		gpuMonitorInfo()
			.then((res) => {
				const result = res[0];
				if (!result) return;

				isListenGPU.value && trainingStore.setGpuData(formatData(result));
			})
			.finally(() => {
				isListenGPU.value && sleep(gpuSleepTime.value).then(updateGpuData);
			});
	}

	/** 开始监听 */
	function startGPUListen() {
		if (isGpuPolling.value) return;
		trainingStore.resetGpuData();
		trainingStore.setIsGpuPolling(true);
		trainingStore.setIsListenGPU(true);
		updateGpuData();
	}

	/** 停止监听 */
	function stopGPUListen() {
		if (!isGpuPolling.value) return;
		trainingStore.setIsGpuPolling(false);
		trainingStore.setIsListenGPU(false);
		trainingStore.resetGpuData();
	}

	return {
		isListenGPU,
		gpuData,
		startGPUListen,
		stopGPUListen
	};
}
