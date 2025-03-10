/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:18:08
 * @LastEditTime: 2025-03-10 17:47:55
 * @LastEditors: mulingyuer
 * @Description: 请求封装
 * @FilePath: \frontend\src\request\index.ts
 * 怎么可能会有bug！！！
 */
import { instance } from "./core";
import type { AxiosRequestConfig } from "axios";
export { isNetworkError } from "./helper";

/** 请求函数 */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
	return instance.request(config);
}
