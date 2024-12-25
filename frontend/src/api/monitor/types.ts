/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 15:22:11
 * @LastEditTime: 2024-12-25 10:26:55
 * @LastEditors: mulingyuer
 * @Description: 监控api类型
 * @FilePath: \frontend\src\api\monitor\types.ts
 * 怎么可能会有bug！！！
 */

import type { TaskStatus } from "../types";

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
	/** GPU 总功耗（瓦特） */
	power_total_watts: number;
}>;

/** 监听训练信息响应 */
export interface LoRATrainingInfoResult {
	/** 任务 ID */
	id: string;
	/** 任务状态 */
	status: TaskStatus;
	/** 任务类型 */
	task_type: "training";
	/** 详情，没数据的时候是空对象 */
	detail:
		| {
				num_train_images: number;
				num_reg_images: number;
				num_batches_per_epoch: number;
				num_epochs: number;
				batch_size_per_device: number;
				gradient_accumulation_steps: number;
				total_optimization_steps: number;
				/** 进度百分比。例：50 */
				progress?: number;
				/** 总图片数量 */
				total?: number;
				/** 已经耗时 */
				elapsed?: string;
				/** 剩余时间 */
				remaining?: string;
				/** 当前第几个 */
				current?: number;
				/** 损失平均值 */
				loss_avr?: number;
				/** 损失当前 */
				loss?: number;
				/** unet学习率 */
				lr_unet?: number;
				/** 每秒速度 */
				speed?: number;
		  }
		| Record<string, never>;
}

/** 监听训练信息参数 */
export interface LoRATrainingInfoParams {
	/** 任务id */
	task_id: string;
}

/** 监听打标信息参数 */
export interface ManualTagInfoParams {
	/** 任务id */
	task_id: string;
}

/** 监听打标信息响应值 */
export interface ManualTagInfoResult {
	/** 任务 ID */
	id: string;
	/** 任务状态 */
	status: TaskStatus;
	/** 任务类型 */
	task_type: "captioning";
	/** 打标输出目录 */
	output_dir: string;
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
		current: number;
	};
}
