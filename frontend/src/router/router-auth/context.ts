/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 08:40:21
 * @LastEditTime: 2024-09-27 08:53:07
 * @LastEditors: mulingyuer
 * @Description: 数据上下文
 * @FilePath: \spirit-app-microservice-admin\src\router\router-auth\context.ts
 * 怎么可能会有bug！！！
 */
import { useUserStore } from "@/stores";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

/** 路由鉴权数据上下文 */
export class RouterAuthContext {
	/** 是否已登录 */
	isLogin: boolean;

	constructor(
		public to: RouteLocationNormalized,
		public form: RouteLocationNormalized,
		public next: NavigationGuardNext
	) {
		const userStore = useUserStore();

		this.isLogin = userStore.isLogin;
	}
}
