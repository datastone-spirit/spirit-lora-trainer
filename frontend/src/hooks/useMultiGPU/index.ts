/*
 * @Author: mulingyuer
 * @Date: 2025-08-14 09:23:33
 * @LastEditTime: 2025-08-15 10:43:02
 * @LastEditors: mulingyuer
 * @Description: 多GPU hooks
 * @FilePath: \frontend\src\hooks\useMultiGPU\index.ts
 * 怎么可能会有bug！！！
 */
import { gpuInfo } from "@/api/gpu";
import { generateUUID } from "@/utils/tools";
import type { FormattedGPUItem, GetGpuInfoData, GpuInfoResult, IsGpuDisabledParams } from "./types";
export type * from "./types";

export function useMultiGPU() {
	/** 判断GPU是否满足可使用条件 */
	function isGpuAvailable(params: IsGpuDisabledParams): boolean {
		// 如果gpu显存满足最低要求，且温度和利用率都符合要求
		const { gpuInfo, min_memory_required_mb } = params;
		const memoryFree = gpuInfo.memory_free_mb ?? 0; // 可用显存
		const temperature = gpuInfo.temperature_celsius ?? 0; // 温度
		const utilization = gpuInfo.utilization_percent ?? 0; // GPU利用率

		return memoryFree >= min_memory_required_mb && temperature < 85 && utilization < 90;
	}

	/** 格式化内存 */
	function formatMemory(mb: number): string {
		if (!mb || isNaN(mb)) return "0 MB";
		if (mb >= 1024) {
			return `${(mb / 1024).toFixed(1)} GB`;
		}
		return `${Math.round(mb)} MB`;
	}

	/** 获取gpu信息 */
	async function getGpuInfo(data: GetGpuInfoData): Promise<GpuInfoResult> {
		try {
			const { min_memory_required_mb } = data;
			const result = await gpuInfo();

			const formattedResult: GpuInfoResult["data"] = {
				gpus: result.gpus.map((gpu): FormattedGPUItem => {
					const is_available = isGpuAvailable({
						gpuInfo: gpu,
						min_memory_required_mb
					});
					const uuid =
						typeof gpu.uuid !== "string" || gpu.uuid.trim() === "" ? generateUUID() : gpu.uuid;
					const formatted_temperature_celsius =
						typeof gpu.temperature_celsius === "number" ? `${gpu.temperature_celsius}°C` : "N/A";
					const formatted_utilization_percent =
						typeof gpu.utilization_percent === "number" ? ` ${gpu.utilization_percent}%` : "N/A";
					const formatted_power_draw_watts =
						typeof gpu.power_draw_watts === "number" ? `${gpu.power_draw_watts}W` : "N/A";
					const formatted_power_limit_watts =
						typeof gpu.power_limit_watts === "number" ? `${gpu.power_limit_watts}W` : "N/A";
					const formatted_gpu_available_text = `需要: ${formatMemory(min_memory_required_mb)} | 可用: ${formatMemory(gpu.memory_free_mb ?? 0)}`;

					return {
						...gpu,
						uuid,
						formatted_power_draw_watts,
						formatted_power_limit_watts,
						formatted_temperature_celsius,
						formatted_utilization_percent,
						formatted_gpu_available_text,
						is_available
					};
				}),
				system_info: result.system_info,
				total_gpus: result.total_gpus
			};

			return { data: formattedResult, message: null };
		} catch (error: any) {
			let message = "无法加载实时GPU信息。使用默认配置。";
			if (
				error.message?.includes("fetch") ||
				error.message?.includes("Network") ||
				error.code === "ECONNREFUSED"
			) {
				message = "GPU监控服务不可用。使用默认配置。";
			}

			return { data: null, message };
		}
	}

	return {
		isGpuAvailable,
		formatMemory,
		getGpuInfo
	};
}
