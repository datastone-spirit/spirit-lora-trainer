/*
 * @Author: mulingyuer
 * @Date: 2025-01-21 09:12:05
 * @LastEditTime: 2025-03-10 17:47:04
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
			dangerouslyUseHTMLString: true,
			customClass: "login-401-message",
			message:
				"<p>尊敬的用户，您好！</p><p>当前登录会话已失效，虽然页面可能无法正常显示训练状态，但训练过程仍将继续正常运行。</p><p>如需继续观察训练情况，请按照以下步骤操作：</p><ol><li>重新登录智灵平台</li><li>选择用于训练的GPU实例</li><li>重新打开智灵训练器</li></ol><p>感谢您的理解与配合。</p>"
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

/** 网络错误code值 */
const NETWORK_ERROR_CODES = new Set([
	"ECONNABORTED", // 请求被中止。常与请求超时有关
	"ECONNREFUSED", // 连接被目标服务器拒绝
	"ECONNRESET", // 连接被重置。这通常表示远程服务器意外关闭了连接
	"ENOTFOUND", // DNS 查询失败，域名无法找到
	"ETIMEDOUT", // 请求超时
	"EHOSTUNREACH", // 网络无法到达主机
	"ERR_NETWORK", // 网络错误，一般是因为网络请求失败
	"ERR_INTERNET_DISCONNECTED", // 网络连接已断开
	"ERR_NETWORK_CHANGED", // 网络连接发生了变化
	"ERR_CONNECTION_TIMED_OUT", // 连接超时
	"ERR_NAME_NOT_RESOLVED" //DNS 解析失败
]);

/** 判断请求是不是网络不通的错误 */
export function isNetworkError(error: any) {
	if (!Object.hasOwn(error, "code")) return false;

	return NETWORK_ERROR_CODES.has(error.code);
}
