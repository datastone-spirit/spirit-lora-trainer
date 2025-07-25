/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 10:43:18
 * @LastEditTime: 2025-07-25 11:36:57
 * @LastEditors: mulingyuer
 * @Description: 公共的lora校验类型
 * @FilePath: \frontend\src\utils\lora\lora.validator\types.ts
 * 怎么可能会有bug！！！
 */
import type { MessageOptions } from "element-plus";

/** 错误消息选项 */
export interface ErrorMessageOptions extends MessageOptions {
	duration?: number;
}

/** Element-Plus 表单校验选项 */
export interface ValidateFormOptions {
	/** 是否显示错误消息弹窗 */
	shouldShowErrorDialog?: boolean;
}

/** 校验结果 */
export interface ValidationResult {
	valid: boolean;
	message?: string;
}

/** 校验目录参数 */
export interface ValidateDirectoryOptions {
	/** 目录路径 */
	path: string | string[];
	/** 是否校验是否存在图片和打标文件 */
	checkImageAndLabel?: boolean;
	/** 是否是混元视频校验 */
	isHY?: boolean;
	/** 是否显示错误消息弹窗 */
	shouldShowErrorDialog?: boolean;
}

/** LoRA保存路径校验参数 */
export interface ValidateLoRaSaveDirOptions {
	/** 目录路径 */
	path: string;
	/** 是否显示错误消息弹窗 */
	shouldShowErrorDialog?: boolean;
}
