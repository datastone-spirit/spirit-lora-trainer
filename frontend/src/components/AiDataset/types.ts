/*
 * @Author: mulingyuer
 * @Date: 2024-12-13 15:25:58
 * @LastEditTime: 2025-04-01 16:05:56
 * @LastEditors: mulingyuer
 * @Description: AI数据集类型
 * @FilePath: \frontend\src\components\AiDataset\types.ts
 * 怎么可能会有bug！！！
 */
import type { DirectoryFilesResult } from "@/api/common";

export enum FileType {
	IMAGE = "image",
	TEXT = "text",
	VIDEO = "video"
}

/** 基础数据 */
export interface BaseFileItem {
	name: string;
	/** 路径 */
	path: string;
	/**
	 * 图片的value是src
	 * video的value是src
	 * text的value是它的内容 */
	value: string;
	/** 文件mime */
	mime: string;
	/** 源数据 */
	raw: DirectoryFilesResult[number];
}

/** 图片数据 */
export interface ImageFileItem extends BaseFileItem {
	type: FileType.IMAGE;
	/** 是否存在打标文件 */
	hasTagText: boolean;
}

/** text数据 */
export interface TextFileItem extends BaseFileItem {
	type: FileType.TEXT;
}

/** 视频数据 */
export interface VideoFileItem extends BaseFileItem {
	type: FileType.VIDEO;
	/** 是否存在打标文件 */
	hasTagText: boolean;
}

export type FileItem = ImageFileItem | TextFileItem | VideoFileItem;

export type FileList = Array<FileItem>;

/** 文件组件基础props */
export interface BaseFileItemProps {
	/** 是否选中 */
	selected: boolean;
}
