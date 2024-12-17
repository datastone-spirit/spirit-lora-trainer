/*
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:17:12
 * @LastEditTime: 2024-12-17 17:44:00
 * @LastEditors: mulingyuer
 * @Description: toml相关工具
 * @FilePath: \frontend\src\utils\toml.ts
 * 怎么可能会有bug！！！
 */
import { stringify, parse } from "smol-toml";
import { formatDate } from "@/utils/dayjs";

/** 生成toml字符串 */
export function tomlStringify(obj: any): string {
	// 用easyDeepClone进行深度克隆，JSON会对对象的key进行排序
	return stringify(obj);
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
export function downloadTomlFile(text: string, fileName?: string) {
	fileName = fileName || `${formatDate(new Date(), "YYYY-MM-DD HH-mm-ss")}.toml`;

	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);

	// 创建一个临时a标签来触发下载
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;

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
