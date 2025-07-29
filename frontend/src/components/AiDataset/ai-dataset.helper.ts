/*
 * @Author: mulingyuer
 * @Date: 2025-04-07 14:26:10
 * @LastEditTime: 2025-07-28 09:54:47
 * @LastEditors: mulingyuer
 * @Description: 数据集帮助
 * @FilePath: \frontend\src\components\AiDataset\ai-dataset.helper.ts
 * 怎么可能会有bug！！！
 */
import { LoRAValidator } from "@/utils/lora/lora.validator";
import type { UploadUserFile } from "element-plus";

export class AiDatasetHelper {
	/** 最大视频时长 */
	public readonly MAX_VIDEO_DURATION = 2 * 60; // 2分钟

	/** 校验上传的目录 */
	public async validateUploadPath(path: string) {
		try {
			// 检测目录是否存在
			if (typeof path === "string" && path.trim() === "") {
				ElMessage.error("请先选择目录");
				return false;
			}
			const { valid } = await LoRAValidator.validateDirectory({ path });
			if (!valid) {
				ElMessage.error("目录不存在");
				return false;
			}

			return true;
		} catch (error) {
			ElMessage.error(`"校验上传的目录失败：${(error as Error)?.message}`);
			console.error("校验上传的目录失败：", error);

			return false;
		}
	}

	/** 过滤不合规的视频文件 */
	public async filterVideoFiles(fileList: UploadUserFile[]): Promise<UploadUserFile[]> {
		const videoList = fileList.filter((file) => file.raw?.type?.startsWith("video/"));
		if (videoList.length === 0) return fileList;

		const filterResult = await this.filterVideoDuration(videoList);
		if (filterResult.failList.length <= 0) return fileList;

		if (filterResult.failList.length > 0) {
			ElMessage.error(`视频时长超过${this.MAX_VIDEO_DURATION}秒的视频文件已被过滤，请重新选择`);
		}

		return fileList.filter((file) => !filterResult.failList.includes(file));
	}

	/** 根据视频时长过滤文件列表 */
	public async filterVideoDuration(fileList: UploadUserFile[]) {
		const successList: UploadUserFile[] = [];
		const failList: UploadUserFile[] = [];

		for (const file of fileList) {
			const duration = await this.getVideoDuration(file.raw!);
			if (duration > this.MAX_VIDEO_DURATION) {
				failList.push(file);
			} else {
				successList.push(file);
			}
		}

		return { successList, failList };
	}

	/** 获取视频的时长，单位：s */
	public getVideoDuration(file: File) {
		return new Promise<number>((resolve, reject) => {
			const videoElement = document.createElement("video");
			videoElement.preload = "metadata";

			// 2. 监听 loadedmetadata 事件
			videoElement.onloadedmetadata = function () {
				// 5. 读取时长
				const duration = videoElement.duration;

				URL.revokeObjectURL(videoElement.src);
				videoElement.remove();

				return resolve(duration);
			};

			// 3. 监听 error 事件
			videoElement.onerror = function (event) {
				URL.revokeObjectURL(videoElement.src);
				videoElement.remove();

				console.error(`计算视频时长失败：`, event);
				return reject(new Error(`计算视频时长失败：${file.name}`));
			};

			const objectURL = URL.createObjectURL(file);
			videoElement.src = objectURL;
		});
	}
}
