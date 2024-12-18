/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:18:08
 * @LastEditTime: 2024-09-25 16:54:57
 * @LastEditors: mulingyuer
 * @Description: 请求封装
 * @FilePath: \spirit-app-microservice-admin\src\request\index.ts
 * 怎么可能会有bug！！！
 */
import { instance, setBaseUrl } from "./core";
import type { RequestConfig } from "./types";
export type * from "./types";

/** 请求函数 */
export function request<T>(config: RequestConfig): Promise<T> {
	return instance.request(config);
}

export { setBaseUrl };
