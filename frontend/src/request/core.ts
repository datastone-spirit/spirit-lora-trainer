/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:18:26
 * @LastEditTime: 2025-03-11 09:33:22
 * @LastEditors: mulingyuer
 * @Description: 请求核心
 * @FilePath: \frontend\src\request\core.ts
 * 怎么可能会有bug！！！
 */
import { useUserStore } from "@/stores";
import axios from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import {
	showMaxRetryErrorMessage,
	showRequestErrorMessage,
	showResponseErrorMessage
} from "./helper";

const isDev = import.meta.env.MODE === "development";

const instance = axios.create({
	baseURL: isDev ? "/api" : import.meta.env.VITE_APP_API_BASE_URL,
	enableRetry: true,
	showErrorMessage: true,
	// showCancelErrorMessage: true, // 这里配置无效，索性注释了
	timeout: 15000 // ms
});
let userStore: ReturnType<typeof useUserStore>;

// 失败重试
axiosRetry(instance, {
	retries: 3,
	retryCondition(error) {
		const config = error?.config;
		if (!config) return false;
		if (config.enableRetry && isNetworkOrIdempotentRequestError(error)) {
			return true;
		}
		return false;
	},
	retryDelay: () => {
		return 2000;
	},
	onMaxRetryTimesExceeded: (error) => {
		// 显示错误消息
		showMaxRetryErrorMessage(error);
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
		// 响应错误弹窗
		showResponseErrorMessage(response);

		return response;
	},
	(error) => {
		// 显示错误消息
		showRequestErrorMessage(error);

		return Promise.reject(error as Error);
	}
);

export { instance };

