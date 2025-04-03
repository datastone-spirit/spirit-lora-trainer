/*
 * @Author: mulingyuer
 * @Date: 2025-04-01 17:15:31
 * @LastEditTime: 2025-04-02 15:48:14
 * @LastEditors: mulingyuer
 * @Description: 弹窗数据管理器的类型
 * @FilePath: \frontend\src\stores\modules\modal-manager\types.ts
 * 怎么可能会有bug！！！
 */

/** 视频预览弹窗数据 */
export interface VideoPreviewModal {
	/** 是否打开 */
	open: boolean;
	/** 标题 */
	title: string;
	/** 视频地址 */
	src: string;
}

/** lora任务日志弹窗 */
export interface LoraTaskLogModal {
	/** 是否打开 */
	open: boolean;
	/** 任务id */
	taskId: string;
}
