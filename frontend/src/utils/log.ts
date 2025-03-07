/*
 * @Author: mulingyuer
 * @Date: 2025-03-07 15:30:07
 * @LastEditTime: 2025-03-07 15:42:56
 * @LastEditors: mulingyuer
 * @Description: 日志
 * @FilePath: \frontend\src\utils\log.ts
 * 怎么可能会有bug！！！
 */
import localforage from "localforage";
export { serializeError } from "serialize-error";

export class Log {
	public static log(key: string, value: any) {
		return localforage.setItem(key, value);
	}
}
