/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 08:51:31
 * @LastEditTime: 2024-09-27 08:51:31
 * @LastEditors: mulingyuer
 * @Description: 公开路由策略
 * @FilePath: \spirit-app-microservice-admin\src\router\router-auth\strategy\public-strategy.ts
 * 怎么可能会有bug！！！
 */
import { RouterAuthContext } from "../context";
import type { AuthStrategy } from "../types";

export class PublicStrategy implements AuthStrategy {
	execute(context: RouterAuthContext): void {
		const { next } = context;
		next();
	}
}
