/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 10:20:37
 * @LastEditTime: 2024-12-25 10:26:09
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
 *  - training: 训练
 */
export type TaskType = "captioning" | "training";
