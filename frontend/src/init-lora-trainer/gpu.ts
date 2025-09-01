/*
 * @Author: mulingyuer
 * @Date: 2025-09-01 14:32:04
 * @LastEditTime: 2025-09-01 14:45:51
 * @LastEditors: mulingyuer
 * @Description: gpu初始化操作
 * @FilePath: \frontend\src\init-lora-trainer\gpu.ts
 * 怎么可能会有bug！！！
 */
import { useGPU } from "@/hooks/task/useGPU";
import { useTrainingStore } from "@/stores";

export async function initGPU() {
	const { gpuMonitor } = useGPU();
	const trainingStore = useTrainingStore();

	watch(
		() => trainingStore.useGPU,
		(val) => {
			if (val) {
				gpuMonitor.start();
			} else {
				gpuMonitor.stop();
			}
		},
		{
			immediate: true
		}
	);
}
