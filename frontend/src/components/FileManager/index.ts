/*
 * @Author: mulingyuer
 * @Date: 2025-04-02 11:40:32
 * @LastEditTime: 2025-04-02 11:41:32
 * @LastEditors: mulingyuer
 * @Description: 文件管理器入口
 * @FilePath: \frontend\src\components\FileManager\index.ts
 * 怎么可能会有bug！！！
 */
import { FileType } from "@/utils/file-manager";
import ImageFile from "./FileItem/ImageFile.vue";
import TextFile from "./FileItem/TextFile.vue";
import VideoFile from "./FileItem/VideoFile.vue";

/** 组件map */
export const FileItemMap: Record<FileType, any> = {
	[FileType.IMAGE]: ImageFile,
	[FileType.TEXT]: TextFile,
	[FileType.VIDEO]: VideoFile
};
