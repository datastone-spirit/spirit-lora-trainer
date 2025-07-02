/*
 * @Author: mulingyuer
 * @Date: 2025-06-30 14:56:34
 * @LastEditTime: 2025-07-01 17:17:05
 * @LastEditors: mulingyuer
 * @Description: 多gpu训练辅助函数
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\DistributedTrainingOptions\distributed-training.helper.ts
 * 怎么可能会有bug！！！
 */
import type { GPUInfo } from "@/api/gpu";

/** 当前gpu是否合适参数 */
export interface IsGpuSuitableOptions {
	/** 当前gpu信息 */
	gpuInfo: GPUInfo;
	/** 需要的内存 */
	memoryRequired: number;
	/** ？？？是否强制覆盖 */
	forceMemoryOverride: boolean;
}

/** gpu是否合适 */
export function isGPUSuitable(options: IsGpuSuitableOptions) {
	const { gpuInfo, memoryRequired, forceMemoryOverride } = options;
	if (!gpuInfo) return false;

	const memoryFree = gpuInfo.memory_free_mb || 0;
	const temperature = gpuInfo.temperature_celsius;
	const utilization = gpuInfo.utilization_percent;

	// If force override is enabled, only check critical constraints
	if (forceMemoryOverride) {
		return (
			memoryFree >= 2000 && // Minimum 2GB
			(temperature === undefined || temperature === null || temperature < 85) &&
			(utilization === undefined || utilization === null || utilization < 95)
		);
	}

	return (
		memoryFree >= memoryRequired &&
		(temperature === undefined || temperature === null || temperature < 85) &&
		(utilization === undefined || utilization === null || utilization < 90)
	);
}

export interface IsGpuSelectableOptions {
	/** 当前gpu信息 */
	gpuInfo: GPUInfo;
	shouldDisableValidation: boolean;
	/** 需要的内存 */
	memoryRequired: number;
	/** ？？？是否强制覆盖 */
	forceMemoryOverride: boolean;
}

/** gpu是否可选 */
export function isGPUSelectable(options: IsGpuSelectableOptions): boolean {
	const { gpuInfo, shouldDisableValidation, forceMemoryOverride, memoryRequired } = options;

	if (!gpuInfo) return false;

	// During training, disable manual GPU selection but allow programmatic selection for restoration
	if (shouldDisableValidation) {
		return false;
	}

	const memoryFree = gpuInfo.memory_free_mb || 0;
	const temperature = gpuInfo.temperature_celsius;
	const utilization = gpuInfo.utilization_percent;

	// Always allow selection if force override is enabled (with minimal safety checks)
	if (forceMemoryOverride) {
		return (
			memoryFree >= 2000 && // Minimum 2GB
			(temperature === undefined || temperature === null || temperature < 90) &&
			(utilization === undefined || utilization === null || utilization < 98)
		);
	}

	// Otherwise use the normal suitability check
	return isGPUSuitable({
		gpuInfo,
		forceMemoryOverride,
		memoryRequired
	});
}

/** 格式化内存 */
export function formatMemory(mb: number): string {
	if (!mb || isNaN(mb)) return "0 MB";
	if (mb >= 1024) {
		return `${(mb / 1024).toFixed(1)} GB`;
	}
	return `${Math.round(mb)} MB`;
}
