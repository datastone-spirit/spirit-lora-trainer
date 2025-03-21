/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:18:08
 * @LastEditTime: 2025-03-11 09:17:25
 * @LastEditors: mulingyuer
 * @Description: 请求封装
 * @FilePath: \frontend\src\request\index.ts
 * 怎么可能会有bug！！！
 */
import { instance } from "./core";
import type { AxiosRequestConfig } from "axios";
import type { RequestResult } from "./types";
export { isNetworkError } from "./helper";

/** 请求函数 */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
	return instance.request(config).then((response) => {
		if (!response?.data) return null;

		const { success, data, message } = response.data as RequestResult;

		// 接口请求成功，但是响应业务是失败的，这里要抛出错误，防止走then处理
		if (success === false) throw new Error(message);

		return data;
	});
}
