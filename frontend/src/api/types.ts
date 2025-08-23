/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 10:20:37
 * @LastEditTime: 2025-08-14 15:49:02
 * @LastEditors: mulingyuer
 * @Description: 通用类型
 * @FilePath: \frontend\src\api\types.ts
 * 怎么可能会有bug！！！
 */

/** 任务状态
 *  - created: 启动中，打标或训练启动中
 *  - running: 运行中，打标或训练运行中
 *  - failed: 失败，打标或训练失败
 *  - complete: 完成，打标或训练完成
 */
export type TaskStatus = "complete" | "created" | "running" | "failed";

/** 任务类型
 *  - captioning: 打标
 *  - training: flux 训练
 */
export enum TaskType {
	/** 打标 */
	CAPTIONING = "captioning",
	/** flux训练 */
	TRAINING = "training",
	/** 混元视频训练 */
	HUNYUAN_TRAINING = "hunyuan_training",
	/** wan视频训练 */
	WAN_TRAINING = "wan_training",
	/** flux kontext训练 */
	FLUX_KONTEXT_TRAINING = "kontext_training",
	/** qwen image 训练 */
	QWENIMAGE_TRAINING = "qwenimage_training"
}

/** 多gpu训练配置 */
export interface MultiGpuConfig {
	/** 启用多GPU训练 */
	multi_gpu_enabled: boolean;
	/** GPU数量 */
	num_gpus: number;
	/** 指定使用的GPU ID列表 */
	gpu_ids: number[];
	/** 分布式后端，默认："nccl" */
	distributed_backend: string;
	/** 自动选择最优GPU （取消了该表单配置，但是后端代码里还是有相关逻辑，所以还需要提供，默认写死true） */
	auto_gpu_selection: true;
	/** 内存需求（MB）,默认：8000 */
	memory_requirement_mb: number;
	/** 显存优化技术，通过累积多个小批次的梯度来等效大batch_size训练，默认：4 */
	gradient_accumulation_steps: number;
	/** 梯度同步间隔步数，默认：1 */
	gradient_sync_every_n_steps: number;
}
