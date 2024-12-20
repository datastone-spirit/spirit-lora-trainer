/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 15:22:11
 * @LastEditTime: 2024-12-20 17:03:28
 * @LastEditors: mulingyuer
 * @Description: 监控api类型
 * @FilePath: \frontend\src\api\monitor\types.ts
 * 怎么可能会有bug！！！
 */

/** 监控系统：GPU 响应 */
export type GPUMonitorInfoResult = Array<{
	/** GPU 的索引 */
	gpu_index: number;
	/** GPU 名称 */
	gpu_name: string;
	/** GPU 剩余的显存大小（MB） */
	memory_free_mb: number;
	/** GPU 总显存大小（MB） */
	memory_total_mb: number;
	/** GPU 已使用的显存大小（MB） */
	memory_used_mb: number;
	/** GPU 当前功耗（瓦特） */
	power_draw_watts: number;
}>;

/** 监听训练信息响应 */
export interface LoRATrainingInfoResult {
	/** 任务 ID */
	id: string;
	/** 任务状态 */
	status: string;
	/** 任务类型 */
	task_type: "training";
	/** 详情 */
	detail: {
		/** 当前进度 */
		current: number;
		/** 已经耗时 */
		elapsed: string;
		/** 损失 */
		loss: number;
		/** 进度 */
		progress: number;
		/** 剩余时间 */
		remaining: string;
		/** 每秒速度 */
		speed: number;
		/** 总进度 */
		total: number;
	};
}

/** 监听打标信息响应值 */
export interface ManualTagInfoResult {
	/** 任务 ID */
	id: string;
	/** 任务状态 */
	status: string;
	/** 任务类型 */
	task_type: "captioning";
	/** 打标输出目录 */
	output_dir: string;
	/** 当前第几个 */
	current: number;
	/** 图片素材数组 */
	image_paths: string[];
	/** 详情 */
	detail: {
		/** 打标结果 */
		captions: Array<{
			image: string;
			caption: string;
			path: string;
			success: boolean;
		}>;
		/** 总文件数量 */
		total: number;
		/** 当前进度??? */
		current: unknown;
	};
}
