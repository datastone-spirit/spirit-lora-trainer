/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 11:34:06
 * @LastEditTime: 2025-03-27 16:23:41
 * @LastEditors: mulingyuer
 * @Description: 用户数据模块
 * @FilePath: \frontend\src\stores\modules\user\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";

export const useUserStore = defineStore(
	"user",
	() => {
		const token = ref("");
		function setToken(newToken: string) {
			token.value = newToken;
		}
		function clearToken() {
			token.value = "";
		}

		/** 是否登录 */
		const isLogin = computed(() => Boolean(token.value));

		return {
			token,
			setToken,
			clearToken,
			isLogin
		};
	},
	{
		persist: true
	}
);

export type UseUserStore = ReturnType<typeof useUserStore>;
