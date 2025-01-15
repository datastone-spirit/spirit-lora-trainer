/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 15:38:33
 * @LastEditTime: 2025-01-15 14:30:34
 * @LastEditors: mulingyuer
 * @Description: lora helper
 * @FilePath: \frontend\src\utils\lora.helper.ts
 * 怎么可能会有bug！！！
 */
import { checkDirectoryExists, hyCheckDirectoryExists } from "@/api/common";

/** 检测目录是否存在 */
export async function checkDirectory(path: string): Promise<boolean> {
	try {
		const result = await checkDirectoryExists({
			path,
			has_data: false
		});

		return result.exists;
	} catch (_error) {
		return false;
	}
}

/** 检测目录下是否存在数据 */
export async function checkData(path: string): Promise<boolean> {
	try {
		const result = await checkDirectoryExists({
			path,
			has_data: true
		});

		return result.has_data;
	} catch (_error) {
		return false;
	}
}

/** 混元视频，检测目录下是否存在数据 */
export async function checkHYData(path: string): Promise<boolean> {
	try {
		const result = await hyCheckDirectoryExists({
			path,
			has_data: true
		});

		return result.has_data;
	} catch (_error) {
		return true;
	}
}
