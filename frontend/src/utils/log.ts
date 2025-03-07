/*
 * @Author: mulingyuer
 * @Date: 2025-03-07 15:30:07
 * @LastEditTime: 2025-03-07 15:56:48
 * @LastEditors: mulingyuer
 * @Description: 日志
 * @FilePath: \frontend\src\utils\log.ts
 * 怎么可能会有bug！！！
 */
import localforage from "localforage";
export { serializeError } from "serialize-error";

// 配置 localforage 只使用 localStorage
const logStorage = localforage.createInstance({
	driver: localforage.LOCALSTORAGE, // 指定使用 localStorage
	name: "spirit-lora-trainer", // 可选：数据库名称
	storeName: "logs" // 可选：存储名称
});

export class Log {
	public static log(key: string, value: any) {
		return logStorage.setItem(key, value);
	}
}
