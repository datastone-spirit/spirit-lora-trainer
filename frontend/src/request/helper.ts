/*
 * @Author: mulingyuer
 * @Date: 2025-01-21 09:12:05
 * @LastEditTime: 2025-01-21 09:12:06
 * @LastEditors: mulingyuer
 * @Description: 请求辅助函数
 * @FilePath: \frontend\src\request\helper.ts
 * 怎么可能会有bug！！！
 */
import { AxiosError } from "axios";
import axios from "axios";
import { isNetworkOrIdempotentRequestError } from "axios-retry";

/** 失败重试显示错误消息弹窗 */
export function showMaxRetryErrorMessage(error: AxiosError) {
	if (shouldShowErrorMessage(error)) {
		showErrorMessage(getErrorMessage(error));
	}
}

/** 显示请求错误消息弹窗 */
export function showRequestErrorMessage(error: any) {
	if (isRetryError(error)) return;
	if (shouldShowErrorMessage(error)) {
		showErrorMessage(getErrorMessage(error));
	}
}

/** 显示错误消息 */
export function showErrorMessage(message: string) {
	ElNotification({
		type: "error",
		title: "请求失败",
		message: message ?? "请求失败"
	});
}

/** 根据axios的config判断是否显示错误消息 */
function shouldShowErrorMessage(error: any) {
	if (!error.config) return true;
	const config = (error as AxiosError)?.config;
	const showErrorMessage = config?.showErrorMessage ?? true;
	const showCancelErrorMessage = config?.showCancelErrorMessage ?? true;
	// 取消请求
	if (axios.isCancel(error)) {
		return showErrorMessage && showCancelErrorMessage;
	}
	return showErrorMessage;
}

/** 是否是失败重试错误 */
function isRetryError(error: any) {
	if (error instanceof AxiosError) {
		const isRetry = error.config?.enableRetry ?? true;
		return isRetry && isNetworkOrIdempotentRequestError(error);
	}
	return true;
}

/** 获取错误消息 */
function getErrorMessage(error: any): string {
	if (axios.isCancel(error)) return error.message ?? "请求被取消";
	if (error instanceof AxiosError) return error.response?.data?.message ?? error.message;
	if (error instanceof Error) return error.message;

	return "未知错误";
}
