/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 08:48:27
 * @LastEditTime: 2024-09-27 08:51:03
 * @LastEditors: mulingyuer
 * @Description: 路由鉴权类型
 * @FilePath: \spirit-app-microservice-admin\src\router\router-auth\types.ts
 * 怎么可能会有bug！！！
 */
import { RouterAuthContext } from "./context";

/** 策略模式接口 */
export interface AuthStrategy {
	execute(context: RouterAuthContext): void;
}

/** 鉴权类型 */
export type AuthType =
	| "public" // 公开路由
	| "guest" // 访客路由
	| "required"; // 需要登录路由
