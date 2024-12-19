/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:21:59
 * @LastEditTime: 2024-12-19 09:55:38
 * @LastEditors: mulingyuer
 * @Description: 请求类型
 * @FilePath: \frontend\src\request\types.ts
 * 怎么可能会有bug！！！
 */
import type { AxiosRequestConfig } from "axios";

/** 请求配置 */
export interface RequestConfig extends AxiosRequestConfig {
	/** 是否允许失败重试 */
	enableRetry?: boolean;
	/** 是否允许显示错误弹窗 */
	showErrorMessage?: boolean;
}

/** 请求结果的结构 */
export interface RequestResult<T = any> {
	code: number;
	message: string;
	success: boolean;
	data: T;
}
