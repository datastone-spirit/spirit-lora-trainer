/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 15:38:33
 * @LastEditTime: 2025-03-27 10:50:03
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

/** 过滤并转换对象中的键值对 */
export function filterAndConvertKeysToNumber(
	data: Record<string, any>, // 接收一个任意键值对的对象
	keys: string[] // 接收一个key数组
): Record<string, number> {
	// 返回一个新的对象，值为number类型
	const result: Record<string, number> = {};

	keys.forEach((key) => {
		if (key in data) {
			// 判断key是否在对象中
			const value = data[key];
			// 尝试将值转换为数字，如果值不是数字或者不能转换，返回NaN
			result[key] = Number(value);
		}
	});

	return result;
}
