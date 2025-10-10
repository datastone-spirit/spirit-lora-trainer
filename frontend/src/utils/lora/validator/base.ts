/*
 * @Author: mulingyuer
 * @Date: 2025-10-09 16:25:24
 * @LastEditTime: 2025-10-09 16:40:04
 * @LastEditors: mulingyuer
 * @Description: 校验器基类
 * @FilePath: \frontend\src\utils\lora\validator\base.ts
 * 怎么可能会有bug！！！
 */
import type { ErrorMessageOptions } from "./types";

export class ValidatorBase {
	/** 显示错误消息 */
	static showErrorMessage(options: ErrorMessageOptions): void {
		if (!options.type) options.type = "error";
		if (!("showClose" in options)) options.showClose = true;
		ElMessage(options);
	}
}
