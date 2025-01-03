/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:18:26
 * @LastEditTime: 2025-01-03 18:19:34
 * @LastEditors: mulingyuer
 * @Description: 请求核心
 * @FilePath: \frontend\src\request\core.ts
 * 怎么可能会有bug！！！
 */
import { useUserStore } from "@/stores";
import axios, { AxiosError } from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import type { RequestConfig } from "./types";

const instance = axios.create({
	baseURL: import.meta.env.VITE_APP_API_BASE_URL,
	enableRetry: true,
	showErrorMessage: true
} as RequestConfig);
let userStore: ReturnType<typeof useUserStore>;

// 失败重试
axiosRetry(instance, {
	retries: 3,
	retryDelay: axiosRetry.exponentialDelay,
	retryCondition: (error: AxiosError) => {
		const config: RequestConfig | undefined = error?.config;
		if (!config) return false;
		if (config.enableRetry && isNetworkOrIdempotentRequestError(error)) {
			return true;
		}
		return false;
	},
	onMaxRetryTimesExceeded: (error, _retryCount) => {
		showErrorMessage(error);
	}
});

/** 请求前拦截器 */
instance.interceptors.request.use((config) => {
	userStore = userStore || useUserStore();

	// 请求头
	if (userStore.token && !config.headers.Authorization) {
		config.headers.set("Authorization", `Bearer ${userStore.token}`);
	}

	return config;
});

/** 响应后拦截器 */
instance.interceptors.response.use(
	(response) => {
		if (!response.data) return null;

		const { success, data, message } = response.data;

		// 是否报错
		if (success === false) {
			handleError(response.config, message);
			throw new Error(message);
		}

		return data;
	},
	(error) => {
		if (!shouldRetry(error)) {
			showErrorMessage(error);
		}

		return Promise.reject(error as Error);
	}
);

/** 设置请求的baseUrl */
function setBaseUrl(baseUrl: string) {
	instance.defaults.baseURL = baseUrl;
}

/** 响应成功但是获取内容出现错误 */
function handleError(config: RequestConfig, message: string) {
	if (config?.showErrorMessage) {
		ElNotification({
			type: "error",
			title: "请求失败",
			message: message ?? "请求失败"
		});
	}
}

/** 获取错误消息 */
function getErrorMessage(error: any): string {
	if (axios.isCancel(error)) return error.message ?? "请求被取消";
	if (error instanceof AxiosError) return error.response?.data?.message ?? error.message;
	if (error instanceof Error) return error.message;

	return "未知错误";
}

/** 错误消息弹窗 */
function showErrorMessage(error: any) {
	const message = getErrorMessage(error);
	if (shouldShowErrorMessage(error)) {
		ElNotification({
			type: "error",
			title: "请求失败",
			message
		});
	}
}

/** 是否是重试错误 */
function shouldRetry(error: any): boolean {
	if (error instanceof AxiosError) {
		const isRetry = (error.response?.config as RequestConfig)?.enableRetry ?? true;
		return isRetry && isNetworkOrIdempotentRequestError(error);
	}
	return true;
}

/** 是否显示错误消息弹窗 */
function shouldShowErrorMessage(error: any): boolean {
	if (axios.isCancel(error) && "config" in error) {
		return (error.config as RequestConfig)?.showErrorMessage ?? true;
	}
	return true;
}

export { instance, setBaseUrl };
