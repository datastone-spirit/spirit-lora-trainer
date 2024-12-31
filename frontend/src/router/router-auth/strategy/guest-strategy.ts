/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 08:52:42
 * @LastEditTime: 2024-12-31 09:13:09
 * @LastEditors: mulingyuer
 * @Description: 访客路由策略
 * @FilePath: \frontend\src\router\router-auth\strategy\guest-strategy.ts
 * 怎么可能会有bug！！！
 */
import { RouterAuthContext } from "../context";
import type { AuthStrategy } from "../types";

export class GuestStrategy implements AuthStrategy {
	execute(context: RouterAuthContext): void {
		const { isLogin, next } = context;

		if (isLogin) {
			next({ path: "/" });
		} else {
			next();
		}
	}
}
