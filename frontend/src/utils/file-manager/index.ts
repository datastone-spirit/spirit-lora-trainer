/*
 * @Author: mulingyuer
 * @Date: 2025-04-02 11:25:07
 * @LastEditTime: 2025-04-03 08:51:48
 * @LastEditors: mulingyuer
 * @Description: 文件管理器
 * @FilePath: \frontend\src\utils\file-manager\index.ts
 * 怎么可能会有bug！！！
 */
import type { DirectoryFilesResult } from "@/api/common";
import type { FileList, ImageFileItem, TextFileItem, VideoFileItem } from "./types";
export type * from "./types";
import { FileType } from "./enums";
export * from "./enums";

export class FileManager {
	/** 格式化api目录下的列表数据 */
	public formatDirectoryFiles(data: DirectoryFilesResult): FileList {
		const list: FileList = [];

		// HACK: 接口有时候返回的不是数组
		if (!Array.isArray(data)) return list;

		data.forEach((item) => {
			const { mime_type } = item;
			if (this.isImage(mime_type)) {
				list.push(...this.createImageFileItem(item));
			} else if (this.isVideo(mime_type)) {
				list.push(...this.createVideoFileItem(item));
			}
		});

		return list;
	}

	/** 是否存在text文件 */
	private hasText(item: DirectoryFilesResult[number]): boolean {
		const { txt_path } = item;
		return !!txt_path;
	}

	/** 是否是图片文件 */
	private isImage(mime: string): boolean {
		return /image\//.test(mime);
	}

	/** 是否是视频文件 */
	private isVideo(mime: string): boolean {
		return /video\//.test(mime);
	}

	/** 拼接图片url */
	private joinImageUrl(imagePath: string): string {
		return `${import.meta.env.VITE_APP_API_BASE_URL}/image${imagePath}`;
	}

	/** 生成图片文件对象 */
	private createImageFileItem(
		item: DirectoryFilesResult[number]
	): Array<ImageFileItem | TextFileItem> {
		const list: Array<ImageFileItem | TextFileItem> = [];

		const imgItem: ImageFileItem = {
			type: FileType.IMAGE,
			name: item.image_name,
			path: item.image_path,
			value: this.joinImageUrl(item.image_path),
			mime: item.mime_type,
			raw: item,
			hasTagText: false
		};
		list.push(imgItem);

		// 存在打标文件
		if (this.hasText(item)) {
			list.push(this.createTextFileItem(item));
			imgItem.hasTagText = true;
		}

		return list;
	}

	/** 生成视频文件对象 */
	private createVideoFileItem(
		item: DirectoryFilesResult[number]
	): Array<VideoFileItem | TextFileItem> {
		const list: Array<VideoFileItem | TextFileItem> = [];

		const videoItem: VideoFileItem = {
			type: FileType.VIDEO,
			name: item.image_name,
			path: item.image_path,
			value: this.joinImageUrl(item.image_path),
			mime: item.mime_type,
			raw: item,
			hasTagText: false
		};
		list.push(videoItem);

		// 存在打标文件
		if (this.hasText(item)) {
			list.push(this.createTextFileItem(item));
			videoItem.hasTagText = true;
		}

		return list;
	}

	/** 生成打标文件对象 */
	private createTextFileItem(item: DirectoryFilesResult[number]): TextFileItem {
		return {
			type: FileType.TEXT,
			name: item.txt_name,
			path: item.txt_path,
			value: item.txt_content,
			mime: item.mime_type,
			raw: item
		};
	}
}
