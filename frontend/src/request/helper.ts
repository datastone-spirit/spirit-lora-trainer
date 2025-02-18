/*
 * @Author: mulingyuer
 * @Date: 2025-01-21 09:12:05
 * @LastEditTime: 2025-02-18 15:40:42
 * @LastEditors: mulingyuer
 * @Description: 请求辅助函数
 * @FilePath: \frontend\src\request\helper.ts
 * 怎么可能会有bug！！！
 */
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import axios from "axios";
import { isNetworkOrIdempotentRequestError } from "axios-retry";
import type { RequestResult } from "./types";

/** 弹窗状态 */
const messageStatus = {
	/** 会话过期 */
	showUnauthorizedErrorMessage: false
};

/** 失败重试显示错误消息弹窗 */
export function showMaxRetryErrorMessage(error: AxiosError) {
	if (shouldShowErrorMessage(error)) {
		showErrorMessage(getErrorMessage(error));
	}
}

/** 显示请求错误消息弹窗 */
export function showRequestErrorMessage(error: any) {
	if (isRetryError(error)) return;
	// 如果是401错误则提示特殊信息
	if (error?.response?.status === 401) {
		if (messageStatus.showUnauthorizedErrorMessage) return;
		messageStatus.showUnauthorizedErrorMessage = true;
		ElMessageBox({
			title: "登录会话过期",
			type: "warning",
			showCancelButton: false,
			confirmButtonText: "知道了",
			message:
				"当前登录会话已过期，页面可能无法正常显示训练状态，但训练应在继续。若要继续查看训练进度，请重新登录智灵平台，选择所用的GPU实例，并重新打开智灵训练器"
		}).finally(() => {
			messageStatus.showUnauthorizedErrorMessage = false;
		});
		return;
	}
	// 其他错误
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

/** 成功响应的错误消息 */
export function showResponseErrorMessage(response: AxiosResponse) {
	const { success, message } = response.data as RequestResult;

	// 是否报错
	if (success === false && shouldShowErrorMessageByConfig(response.config)) {
		showErrorMessage(message);
	}
}

/** 根据axios的config判断是否显示错误消息 */
function shouldShowErrorMessageByConfig(config: AxiosRequestConfig) {
	if (!config) return true;
	return config?.showErrorMessage ?? true;
}

/** 根据axios的error判断是否显示错误消息 */
function shouldShowErrorMessage(error: any) {
	const showErrorMessage = shouldShowErrorMessageByConfig(error.config);
	// 取消请求相关错误
	const config = (error as AxiosError)?.config;
	const showCancelErrorMessage = config?.showCancelErrorMessage ?? true;
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
