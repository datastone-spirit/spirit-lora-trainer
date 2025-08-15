/*
 * @Author: mulingyuer
 * @Date: 2025-08-14 09:10:18
 * @LastEditTime: 2025-08-15 10:23:20
 * @LastEditors: mulingyuer
 * @Description: gpu相关api类型定义
 * @FilePath: \frontend\src\api\gpu\types.ts
 * 怎么可能会有bug！！！
 */

/** 获取gpu信息返回值 */
export interface GpuInfo {
	/** gpu列表 */
	gpus: Array<{
		/** gpu序号 */
		index: number;
		/** gpu名称 */
		name: string;
		/** 已使用内存大小（MB） */
		memory_used_mb: number;
		/** 可用内存大小（MB） */
		memory_free_mb: number;
		/** 总内存大小（MB） */
		memory_total_mb: number;
		/** 当前功耗（瓦） */
		power_draw_watts: number;
		/** 总功耗限制（瓦） */
		power_limit_watts: number;
		/** 温度（摄氏度），可能为空 */
		temperature_celsius: number | null;
		/** 总利用率（百分比），可能为空 */
		utilization_percent: number | null;
		/** 内存利用率（百分比） */
		memory_utilization_percent: number;
		/** 功耗利用率（百分比） */
		power_utilization_percent: number;
		/** gpu uuid */
		uuid: string | null;
		/** 驱动版本 */
		driver_version: string | null;
	}>;
	/** 系统信息 */
	system_info: {
		/** 驱动版本 */
		driver_version: string;
		/** cuda版本 */
		cuda_version: string;
		/** gpu计数 */
		gpu_count: number;
		/** 总gpu内存 */
		total_gpu_memory_mb: number;
	};
	/** 总gpu数量 */
	total_gpus: number;
}
