/*
 * @Author: mulingyuer
 * @Date: 2025-04-01 17:15:31
 * @LastEditTime: 2025-07-31 15:18:49
 * @LastEditors: mulingyuer
 * @Description: 弹窗数据管理器的类型
 * @FilePath: \frontend\src\stores\modules\modal-manager\types.ts
 * 怎么可能会有bug！！！
 */

/** 视频预览弹窗数据 */
export interface VideoPreviewModalData {
	/** 是否打开 */
	open: boolean;
	/** 标题 */
	title: string;
	/** 视频地址 */
	src: string;
}

/** lora任务日志弹窗数据 */
export interface LoraTaskLogModalData {
	/** 是否打开 */
	open: boolean;
	/** 任务id */
	taskId: string;
}

/** 查看采样数据抽屉数据 */
export interface ViewSamplingDrawerModalData {
	/** 是否打开 */
	open: boolean;
	/** 采样数据路径 */
	filePath: string;
}
