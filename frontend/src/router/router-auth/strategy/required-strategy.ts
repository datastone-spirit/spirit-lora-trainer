/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 08:55:34
 * @LastEditTime: 2024-09-27 08:56:44
 * @LastEditors: mulingyuer
 * @Description: 必须登录的策略
 * @FilePath: \spirit-app-microservice-admin\src\router\router-auth\strategy\required-strategy.ts
 * 怎么可能会有bug！！！
 */
import { RouterAuthContext } from "../context";
import type { AuthStrategy } from "../types";

export class RequiredStrategy implements AuthStrategy {
	execute(context: RouterAuthContext): void {
		const { isLogin, to, next } = context;

		if (!isLogin) {
			// 未登录，跳转到登录页面
			next({ name: "Login", query: { redirect: to.fullPath } });
		} else {
			// 已登录，正常访问
			next();
		}
	}
}
