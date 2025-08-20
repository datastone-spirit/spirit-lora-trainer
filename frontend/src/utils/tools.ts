/*
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:31:33
 * @LastEditTime: 2025-08-20 15:28:16
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: \frontend\src\utils\tools.ts
 * 怎么可能会有bug！！！
 */
import type { FormInstance, FormValidateFailure } from "element-plus";
import { v4 as uuidV4 } from "uuid";

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
		message += `${errors?.map((error) => error.message).join("、")}\n`;
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

/** 拼接应用前缀的key */
export function joinPrefixKey(key: string, prefix?: string) {
	prefix = prefix ?? import.meta.env.VITE_APP_LOCAL_KEY_PREFIX;

	return `${prefix}${key}`;
}
