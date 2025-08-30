/*
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:17:12
 * @LastEditTime: 2025-08-29 15:59:23
 * @LastEditors: mulingyuer
 * @Description: toml相关工具
 * @FilePath: \frontend\src\utils\toml\index.ts
 * 怎么可能会有bug！！！
 */
import { stringify, parse } from "smol-toml";
import { formatDate } from "@/utils/dayjs";
import { downloadFile } from "@/utils/tools";
import type { DownloadTomlFileOptions } from "./types";

export class TomlUtils {
	/** 生成toml字符串 */
	public static tomlStringify(obj: any): string {
		return stringify(TomlUtils.removeUndefinedAndNull(obj));
	}

	/** toml字符串转对象 */
	public static tomlParse<T = any>(text: string): T {
		return parse(text) as T;
	}

	/** 获取toml的file文件的文本内容 */
	public static readTomlFile<T = string>(file: File): Promise<T> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = function (e) {
				resolve(e.target!.result as T);
			};

			reader.onerror = function (e) {
				reject(new Error("读取toml文件失败: " + e.target!.error));
			};

			reader.readAsText(file);
		});
	}

	/** 将toml字符串转成文件并下载 */
	public static downloadTomlFile(options: DownloadTomlFileOptions) {
		const { text, fileNamePrefix } = options;
		let { fileName } = options;
		fileName = fileName ?? `${formatDate(new Date(), "YYYY-MM-DD HH-mm-ss")}.toml`;
		if (fileNamePrefix) fileName = `${fileNamePrefix}_${fileName}`;

		const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);

		downloadFile(url, fileName);
	}

	/** 移除对象中的undefined和null值的字段 */
	public static removeUndefinedAndNull(data: any) {
		// 使用 void 0 代替 undefined，避免 undefined 被重新赋值的问题
		// 检查是否为空值：null、undefined、空字符串（trim后为空）
		if (data === null || data === void 0) {
			return void 0;
		}

		// 使用 Object.prototype.toString.call 精确判断类型
		const type = Object.prototype.toString.call(data);

		// 如果不是数组也不是普通对象，原样返回
		if (type !== "[object Array]" && type !== "[object Object]") {
			return data;
		}

		// 数组处理
		if (type === "[object Array]") {
			const filteredArray = data
				.map((item: any) => TomlUtils.removeUndefinedAndNull(item))
				.filter((item: any) => item !== void 0);
			return filteredArray;
		}

		// 普通对象处理（只处理 {} 这种键值对象）
		const newObj: Record<string, any> = {};
		Object.keys(data).forEach((key) => {
			const processedValue = TomlUtils.removeUndefinedAndNull(data[key]);
			// 只有当处理后的值不是 undefined 时才添加到新对象中
			if (processedValue !== void 0) {
				newObj[key] = processedValue;
			}
		});

		return newObj;
	}
}
