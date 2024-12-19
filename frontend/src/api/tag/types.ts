/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 17:33:00
 * @LastEditTime: 2024-12-19 17:35:53
 * @LastEditors: mulingyuer
 * @Description: 打标api类型
 * @FilePath: \frontend\src\api\tag\types.ts
 * 怎么可能会有bug！！！
 */

/** 一键打标参数 */
export interface BatchTagData {
	/** 模型名称，用于选择相应的打标方式 */
	model_name: string;
	/** 要打标的图片文件夹路径 */
	image_path: string;
}

/** 一键打标参数响应 */
export type BatchTagResult = Array<{
	image_path: string;
	marking_file: string;
	marking_text: string;
}>;

/** 手动打标参数 */
export interface ManualTagData {
	/** 打标图片的完整路径 */
	image_path: string;
	/** 图片标注文本 */
	caption_text: string;
}

/** 手动打标参数响应 */
export interface ManualTagResult {
	caption_text: string;
	image_path: string;
	txt_path: string;
}
