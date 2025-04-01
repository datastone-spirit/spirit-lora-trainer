/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 10:20:37
 * @LastEditTime: 2025-03-31 08:41:12
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
	WAN_TRAINING = "wan_training"
}
