/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 16:12:05
 * @LastEditTime: 2025-08-12 15:54:22
 * @LastEditors: mulingyuer
 * @Description: 全局lora类型定义
 * @FilePath: \frontend\types\task.d.ts
 * 怎么可能会有bug！！！
 */

/** lora训练任务 */
type TaskType =
	| "none"
	| "tag"
	| "flux"
	| "hunyuan-video"
	| "wan-video"
	| "flux-kontext"
	| "qwen-image";
