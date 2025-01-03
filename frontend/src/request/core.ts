/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:18:26
 * @LastEditTime: 2025-01-03 16:07:34
 * @LastEditors: mulingyuer
 * @Description: 请求核心
 * @FilePath: \frontend\src\request\core.ts
 * 怎么可能会有bug！！！
 */
import { useUserStore } from "@/stores";
import axios, { AxiosError } from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import type { RequestConfig, RequestResult } from "./types";

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
		// 错误消息提示
		errorMessage(error);
	}
});

/** 请求前拦截器 */
instance.interceptors.request.use((config) => {
	if (!userStore) userStore = useUserStore();

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
		const result: RequestResult = response.data;
		// 是否报错
		const resultSuccess = response.data?.success;
		if (typeof resultSuccess === "boolean" && resultSuccess === false) {
			const config = response.config as RequestConfig;
			if (config.showErrorMessage) {
				ElNotification({
					type: "error",
					title: "请求失败",
					message: result.data?.error ?? result.message ?? "请求失败"
				});
			}
			throw new Error(result.message);
		}

		// 解包
		return result.data;
	},
	(error) => {
		// 是否允许失败重试
		let isRetry = true;
		if (error instanceof AxiosError) {
			// @ts-expect-error 临时修复一下
			isRetry = error.response?.config?.enableRetry ?? true;
		}
		// 是否是重试的错误
		const isRetryError = isNetworkOrIdempotentRequestError(error);
		if (!isRetry || !isRetryError) {
			errorMessage(error);
		}

		return Promise.reject(error as Error);
	}
);

/** 设置请求的baseUrl */
function setBaseUrl(baseUrl: string) {
	instance.defaults.baseURL = baseUrl;
}

/** 获取错误消息 */
function getErrorMessage(error: any): string {
	let message = "未知错误";

	if (axios.isCancel(error)) {
		// 请求被取消
		message = error.message ?? "请求被取消";
	} else if (error instanceof AxiosError) {
		// AxiosError
		message = error.response?.data?.message ?? error.message;
	} else if (error instanceof Error) {
		// Error
		message = error.message;
	}

	return message;
}

/** 错误消息提示 */
function errorMessage(error: any) {
	let showErrorMessage = true;
	const message = getErrorMessage(error);

	if (error instanceof AxiosError) {
		// @ts-expect-error 去除ts类型警告
		showErrorMessage = error.config?.showErrorMessage ?? showErrorMessage;
	}

	// 消息提示
	if (showErrorMessage) {
		ElNotification({
			type: "error",
			title: "请求失败",
			message
		});
	}
}

export { instance, setBaseUrl };
