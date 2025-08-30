/*
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:31:33
 * @LastEditTime: 2025-08-29 11:41:43
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

/** 生成随机种子数
 * 范围：0 - 4294967296
 * @returns 返回一个随机的种子数
 */
export function generateSeed(): number {
	const MAX_UINT32 = 4294967295;

	return Math.floor(Math.random() * (MAX_UINT32 + 1));
}

/** 是否是空字符串 */
export function isEmptyString(value: unknown): boolean {
	return typeof value === "string" && value.trim() === "";
}

/** 去除提交表单中值为null|undefined|''的字段 */
export function removeEmptyFields(form: any): any {
	// 使用 void 0 代替 undefined，避免 undefined 被重新赋值的问题
	// 检查是否为空值：null、undefined、空字符串（trim后为空）
	if (form === null || form === void 0) {
		return void 0;
	}

	// 检查空字符串：必须是 string 类型且 trim 后为空
	if (typeof form === "string" && form.trim() === "") {
		return void 0;
	}

	// 使用 Object.prototype.toString.call 精确判断类型
	const type = Object.prototype.toString.call(form);

	// 如果不是数组也不是普通对象，原样返回
	if (type !== "[object Array]" && type !== "[object Object]") {
		return form;
	}

	// 数组处理
	if (type === "[object Array]") {
		const filteredArray = form
			.map((item: any) => removeEmptyFields(item))
			.filter((item: any) => item !== void 0);
		return filteredArray;
	}

	// 普通对象处理（只处理 {} 这种键值对象）
	const newObj: Record<string, any> = {};
	Object.keys(form).forEach((key) => {
		const processedValue = removeEmptyFields(form[key]);
		// 只有当处理后的值不是 undefined 时才添加到新对象中
		if (processedValue !== void 0) {
			newObj[key] = processedValue;
		}
	});

	return newObj;
}

/**
 * 获取一个值的精确类型字符串。
 * @param value - 任何 JavaScript 值。
 * @returns 类型的字符串表示，例如 "object", "array", "string"。
 */
export function getPreciseType(value: any): string {
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/** 深度合并数据 */
export function deepMerge(template: any, data: any) {
	// 如果源数据为 null 或 undefined，则直接返回目标数据
	if (data === null || data === void 0) return template;
	// 如果目标数据为 null 或 undefined，则直接返回源数据
	if (template === null || template === void 0) return data;

	const templateType = getPreciseType(template);
	const dataType = getPreciseType(data);

	// 如果两者都是对象，进行属性合并
	if (templateType === "object" && dataType === "object") {
		Object.keys(template).forEach((key) => {
			if (!Object.hasOwn(data, key)) return;
			const target = template[key];
			const source = data[key];

			const targetType = getPreciseType(target);
			const sourceType = getPreciseType(source);

			if (targetType === "object" && sourceType === "object") {
				template[key] = deepMerge(target, source);
			} else if (targetType === "array" && sourceType === "array") {
				template[key] = deepMerge(target, source);
			} else {
				template[key] = source;
			}
		});

		return template;
	}

	// 如果两者都是数组，进行元素合并
	if (templateType === "array" && dataType === "array") {
		// 以缓存优先，让form的数组长度与data的数组长度一致
		template.length = data.length;

		// 遍历源数组，合并或追加元素
		data.forEach((item: any, index: number) => {
			const target = template[index];
			const source = item;

			const targetType = getPreciseType(target);
			const sourceType = getPreciseType(source);

			if (typeof target === "undefined") {
				// 如果目标数组在当前索引没有元素，直接追加源元素
				template[index] = source;
			} else if (targetType === "object" && sourceType === "object") {
				template[index] = deepMerge(target, source);
			} else if (targetType === "array" && sourceType === "array") {
				template[index] = deepMerge(target, source);
			} else {
				template[index] = source;
			}
		});

		return template;
	}

	// 如果类型不匹配或不是可合并的复杂类型（对象/数组），则直接用源数据覆盖目标数据
	return data;
}

/** 序列化方法
 * 用于将undefined也正确存储为string
 */
export class SerializeUndefined {
	/** undefined 占位符 */
	static readonly UNDEFINED_PLACEHOLDER = "__undefined__";

	/** 递归地将 undefined 转换为占位符 */
	public static serialize(obj: any): any {
		if (typeof obj === "undefined") return SerializeUndefined.UNDEFINED_PLACEHOLDER;

		if (Array.isArray(obj)) {
			return obj.map(SerializeUndefined.serialize);
		}

		if (getPreciseType(obj) === "object") {
			return Object.fromEntries(
				Object.entries(obj).map(([key, value]) => [key, SerializeUndefined.serialize(value)])
			);
		}

		return obj;
	}

	/** 递归地将占位符还原为 undefined */
	public static deserialize(obj: any): any {
		if (obj === SerializeUndefined.UNDEFINED_PLACEHOLDER) return undefined;

		if (Array.isArray(obj)) {
			return obj.map(SerializeUndefined.deserialize);
		}

		if (getPreciseType(obj) === "object") {
			return Object.fromEntries(
				Object.entries(obj).map(([key, value]) => [key, SerializeUndefined.deserialize(value)])
			);
		}

		return obj;
	}
}
