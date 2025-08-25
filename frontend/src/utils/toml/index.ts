/*
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:17:12
 * @LastEditTime: 2025-08-25 14:56:19
 * @LastEditors: mulingyuer
 * @Description: toml相关工具
 * @FilePath: \frontend\src\utils\toml\index.ts
 * 怎么可能会有bug！！！
 */
import { stringify, parse } from "smol-toml";
import { formatDate } from "@/utils/dayjs";
import { downloadFile, removeEmptyFields } from "@/utils/tools";
import type { DownloadTomlFileOptions } from "./types";

/** 生成toml字符串 */
export function tomlStringify(obj: any): string {
	return stringify(removeEmptyFields(obj));
}

/** toml字符串转对象 */
export function tomlParse<T = any>(text: string): T {
	return parse(text) as T;
}

/** 获取toml的file文件的文本内容 */
export function readTomlFile<T = string>(file: File): Promise<T> {
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
export function downloadTomlFile(options: DownloadTomlFileOptions) {
	const { text, fileNamePrefix } = options;
	let { fileName } = options;
	fileName = fileName ?? `${formatDate(new Date(), "YYYY-MM-DD HH-mm-ss")}.toml`;
	if (fileNamePrefix) fileName = `${fileNamePrefix}_${fileName}`;

	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);

	downloadFile(url, fileName);
}
