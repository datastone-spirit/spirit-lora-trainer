/*
 * @Author: mulingyuer
 * @Date: 2024-09-30 10:01:54
 * @LastEditTime: 2025-03-21 08:55:47
 * @LastEditors: mulingyuer
 * @Description: 登录退出通用处理hooks
 * @FilePath: \frontend\src\hooks\useAuth.ts
 * 怎么可能会有bug！！！
 */
import { useUserStore } from "@/stores";

export function useAuth() {
	const userStore = useUserStore();

	/** 登录通用处理 */
	async function login(token: string) {
		userStore.setToken(token);
	}

	/** 退出通用处理 */
	async function logout() {
		userStore.clearToken();
	}

	return {
		login,
		logout
	};
}
