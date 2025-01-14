/*
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:31:33
 * @LastEditTime: 2025-01-14 10:22:05
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: \frontend\src\utils\tools.ts
 * 怎么可能会有bug！！！
 */
import type { FormInstance } from "element-plus";
import { v4 as uuidV4 } from "uuid";

/** 生成一个键值对对象，键为接口的键，值为键名 */
export function generateKeyMapFromInterface<
	T extends Record<string, any>,
	R extends Record<keyof T, any> = Record<keyof T, string>
>(instance: T): R {
	return Object.keys(instance).reduce((acc, key) => {
		// 这里我们需要确保 `key` 被正确地断言为 `keyof T`
		const typedKey = key as keyof T;
		// 使用类型断言来满足 R 的类型要求
		// @ts-expect-error 由于 TypeScript 类型系统的限制，这里使用类型断言
		acc[typedKey] = key;
		return acc;
	}, {} as R);
}

/** 简单深度克隆 */
export function easyDeepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

/** 生成uuid */
export function generateUUID() {
	return uuidV4();
}

/** 等待指定时间： ms */
export function sleep(time: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}

/** 是否是一个空对象 */
export function isEmptyObject(obj: any): boolean {
	return Object.keys(obj).length === 0;
}

/** 判断对象里是否存在指定的key */
export function objectHasKeys(obj: any, key: string | string[]): boolean {
	return Array.isArray(key) ? key.every((k) => k in obj) : key in obj;
}

/** 将element-plus的表单校验转换成promise形式 */
export function validateForm(form: FormInstance): Promise<boolean> {
	return new Promise((resolve) => {
		if (!form) return resolve(false);
		form.validate(resolve);
	});
}

/** a链接下载文件 */
export function downloadFile(url: string, filename?: string) {
	// 创建一个临时a标签来触发下载
	const link = document.createElement("a");
	link.href = url;
	link.download = filename ?? "";
	link.target = "_blank";

	// 使用MouseEvent初始化点击事件
	const clickEvent = new MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: false
	});
	link.dispatchEvent(clickEvent);

	// 销毁
	link.remove();
}

/** 秒转换成时分秒 */
export function formatSeconds(seconds: number) {
	const days = Math.floor(seconds / 86400); // 1天 = 86400秒
	seconds %= 86400;

	const hours = Math.floor(seconds / 3600); // 1小时 = 3600秒
	seconds %= 3600;

	const minutes = Math.floor(seconds / 60); // 1分钟 = 60秒
	seconds %= 60;

	let result = "";
	if (days > 0) {
		result += `${days}天`;
	}
	if (hours > 0) {
		result += `${hours}小时`;
	}
	if (minutes > 0) {
		result += `${minutes}分钟`;
	}
	if (seconds > 0) {
		result += `${Math.ceil(seconds)}秒`;
	}

	return result.trim();
}
