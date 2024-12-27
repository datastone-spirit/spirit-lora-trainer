/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 15:22:11
 * @LastEditTime: 2024-12-27 09:17:39
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
	/** 开始时间 */
	start_time: number;
	/** 结束时间 */
	end_time: number | null;
	/** 详情，没数据的时候是空对象，任务失败的时候是字符串 */
	detail:
		| {
				/** 总计训练的图片数， 这个值是通过 图片数  * repeat_num 计算得出 */
				num_train_images?: number;
				/** 正则化图片数量， 我们没有启用正则化数据， 所以这里应该总是0 */
				num_reg_images?: number;
				/** 每轮的总批次数 num_train_images × 批次计算， 因为是批次为1, 所以这里是120 */
				num_batches_per_epoch?: number;
				/** 训练轮数 */
				num_epochs?: number;
				/** 每个设备上的批次数 总为1, 没有启用分布式训练 */
				batch_size_per_device?: number;
				/** 多少步累计梯度， 这里是1, 就是每一步的梯度都不累计 */
				gradient_accumulation_steps?: number;
				/** 总共优化步数，应该是 total / gradient_accumulation_steps 计算得出 */
				total_optimization_steps?: number;
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
		| string;
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
	/** 开始时间 */
	start_time: number;
	/** 结束时间 */
	end_time: number | null;
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
