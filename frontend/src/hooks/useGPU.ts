/*
 * @Author: mulingyuer
 * @Date: 2024-12-24 17:37:15
 * @LastEditTime: 2025-01-13 17:02:37
 * @LastEditors: mulingyuer
 * @Description: gpu hooks
 * @FilePath: \frontend\src\hooks\useGPU.ts
 * 怎么可能会有bug！！！
 */
import { gpuMonitorInfo } from "@/api/monitor";
import type { GPUMonitorInfoResult } from "@/api/monitor";
import { useTrainingStore } from "@/stores";
import type { GPUData } from "@/stores";

export function useGPU() {
	const trainingStore = useTrainingStore();
	const { monitorGPUData } = storeToRefs(trainingStore);
	/** 定时器 */
	let timer: number | null = null;

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

	/** 清理定时器 */
	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	/** 获取gpu数据 */
	function updateGPUData() {
		gpuMonitorInfo().then((res) => {
			const result = res[0];
			if (!result) return;

			trainingStore.setGPUData(formatData(result));
		});
	}

	/** 开始监听 */
	function startGPUListen() {
		if (monitorGPUData.value.isPolling) return; // 已经开启了轮询
		if (timer) clearTimer(); // 清理定时器

		trainingStore.resetGPUData();
		trainingStore.setGPUIsListen(true);
		trainingStore.setGPUIsPolling(true);

		if (!timer) updateGPUData(); // 第一次更新
		timer = setInterval(updateGPUData, monitorGPUData.value.sleepTime);
	}

	/** 停止监听 */
	function stopGPUListen() {
		if (!monitorGPUData.value.isPolling) return; // 没有开启轮询
		if (timer) clearTimer(); // 清理定时器

		trainingStore.setGPUIsListen(false);
		trainingStore.setGPUIsPolling(false);
		trainingStore.resetGPUData();
	}

	return {
		monitorGPUData: readonly(monitorGPUData),
		startGPUListen,
		stopGPUListen
	};
}
