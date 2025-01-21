/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:18:08
 * @LastEditTime: 2025-01-21 09:13:42
 * @LastEditors: mulingyuer
 * @Description: 请求封装
 * @FilePath: \frontend\src\request\index.ts
 * 怎么可能会有bug！！！
 */
import { instance } from "./core";
import type { AxiosRequestConfig } from "axios";

/** 请求函数 */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
	return instance.request(config);
}
