/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 17:05:19
 * @LastEditTime: 2024-12-23 16:30:08
 * @LastEditors: mulingyuer
 * @Description: 数据集帮助工具
 * @FilePath: \frontend\src\components\AiDataset\ai-dataset.helper.ts
 * 怎么可能会有bug！！！
 */
import type { DirectoryFilesResult } from "@/api/common";
import { type FileList, FileType, type ImageFileItem } from "./types";

/** 是否存在text文件 */
function hasText(item: DirectoryFilesResult[number]): boolean {
	const { txt_path } = item;
	return !!txt_path;
}

/** 拼接图片url */
const isDev = import.meta.env.DEV;
function joinImageUrl(imagePath: string): string {
	let prefix = "";
	if (isDev) {
		prefix = `${import.meta.env.VITE_APP_API_BASE_URL}/image`;
	} else {
		prefix = location.origin;
	}
	return `${prefix}${imagePath}`;
}

/** 格式化api目录下的列表数据 */
export function formatDirectoryFiles(data: DirectoryFilesResult): FileList {
	const list: FileList = [];

	// HACK: 接口有时候返回的不是数组
	if (!Array.isArray(data)) return list;

	data.forEach((item) => {
		const imgItem: ImageFileItem = {
			type: FileType.IMAGE,
			name: item.image_name,
			path: item.image_path,
			value: joinImageUrl(item.image_path),
			raw: item,
			hasTagText: false
		};
		list.push(imgItem);
		// 打标文件
		if (hasText(item)) {
			imgItem.hasTagText = true;
			list.push({
				type: FileType.TEXT,
				name: item.txt_name,
				path: item.txt_path,
				value: item.txt_content,
				raw: item
			});
		}
	});

	return list;
}
