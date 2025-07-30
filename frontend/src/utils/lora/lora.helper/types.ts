/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 15:12:18
 * @LastEditTime: 2025-07-30 10:06:32
 * @LastEditors: mulingyuer
 * @Description: 公共的lora帮助方法类型定义
 * @FilePath: \frontend\src\utils\lora\lora.helper\types.ts
 * 怎么可能会有bug！！！
 */

/** 恢复表单数据参数 */
export interface RecoveryTaskFormDataOptions {
	/** 表单数据对象 */
	formData: Record<string, any>;
	/** 是显示弹窗提示 */
	showTip?: boolean;
}
