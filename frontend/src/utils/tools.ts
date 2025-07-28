/*
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:31:33
 * @LastEditTime: 2025-07-28 15:58:45
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: \frontend\src\utils\tools.ts
 * 怎么可能会有bug！！！
 */
import type { FormInstance, FormValidateFailure } from "element-plus";
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

/** 秒转HH:MM:SS */
export function secondsToHHMMSS(totalSeconds: number): string {
	console.log("🚀 ~ secondsToHHMMSS ~ totalSeconds:", totalSeconds);
	totalSeconds = Math.ceil(totalSeconds);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const hoursStr = String(hours).padStart(2, "0");
	const minutesStr = String(minutes).padStart(2, "0");
	const secondsStr = String(seconds).padStart(2, "0");

	return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

/** 将element-plus的表单校验结果转换成提示信息
 *  多个字段的错误信息会合并成一条
 *  字段名和错误信息之间用换行符分隔
 */
export function formatFormValidateMessage(invalidFields: FormValidateFailure["fields"]): string {
	let message = "";

	Object.keys(invalidFields).forEach((field) => {
		const errors = invalidFields[field];
		message += `${errors.map((error) => error.message).join("、")}\n`;
	});

	return message;
}

/** 计算百分比 */
export function calculatePercentage(num: number, total: number): number {
	if (total <= 0) return 0;
	if (num <= 0) return 0;
	const value = Math.floor((num / total) * 100);
	return value > 100 ? 100 : value;
}

/** 通过文件后缀来判断是不是图片文件 */
export function isImageFile(filename: string): boolean {
	const extension = filename.split(".").pop()?.toLowerCase() ?? "";
	if (extension.trim() === "") return false;

	const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tif", "tiff"];
	return imageExtensions.includes(extension);
}
