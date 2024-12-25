/*
 * @Author: mulingyuer
 * @Date: 2024-12-23 17:08:46
 * @LastEditTime: 2024-12-24 16:38:25
 * @LastEditors: mulingyuer
 * @Description: 事件类型
 * @FilePath: \frontend\src\utils\event-bus\events.ts
 * 怎么可能会有bug！！！
 */

// export enum EventType {
// 	/** 开始监听LoRA训练 */
// 	LORA_TRAIN_START = "lora_train_start",
// 	/** 停止监听LoRA训练 */
// 	LORA_TRAIN_STOP = "lora_train_stop",
// 	/** LoRA训练完成 */
// 	LORA_TRAIN_COMPLETE = "lora_train_complete",
// 	/** LoRA训练异常 */
// 	LORA_TRAIN_ERROR = "lora_train_error"
// }

export type Events = {
	/** 开始监听GPU */
	gpu_monitor_start: void;
	/** 停止监听GPU */
	gpu_monitor_stop: void;
	/** 开始监听LoRA训练 */
	lora_monitor_train_start: void;
	/** 停止监听LoRA训练 */
	lora_monitor_train_stop: void;
	/** LoRA训练完成 */
	lora_train_complete: void;
	/** LoRA训练异常 */
	lora_train_failed: void;
	/** 开始监听打标 */
	tag_monitor_start: void;
	/** 停止监听打标 */
	tag_monitor_stop: void;
	/** 打标完成 */
	tag_complete: void;
	/** 打标异常 */
	tag_failed: void;
};
