/*
 * @Author: mulingyuer
 * @Date: 2024-12-13 15:25:58
 * @LastEditTime: 2024-12-16 10:30:01
 * @LastEditors: mulingyuer
 * @Description: AI数据集类型
 * @FilePath: \frontend\src\components\AiDataset\types.ts
 * 怎么可能会有bug！！！
 */

export enum FileType {
	IMAGE = "image",
	TEXT = "text"
}

/** 基础数据 */
export interface BaseFileItem {
	id: string;
	name: string;
	value: string;
}

/** 图片数据 */
export interface ImageFileItem extends BaseFileItem {
	type: FileType.IMAGE;
}

/** text数据 */
export interface TextFileItem extends BaseFileItem {
	type: FileType.TEXT;
}

export type FileItem = ImageFileItem | TextFileItem;

export type FileList = Array<FileItem>;

/** 文件组件基础props */
export interface BaseFileItemProps {
	/** 是否选中 */
	selected: boolean;
}
