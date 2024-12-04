/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 08:33:40
 * @LastEditTime: 2024-09-27 09:03:01
 * @LastEditors: mulingyuer
 * @Description: 路由鉴权
 * @FilePath: \spirit-app-microservice-admin\src\router\router-auth\index.ts
 * 怎么可能会有bug！！！
 */
import { PublicStrategy } from "./strategy/public-strategy";
import { GuestStrategy } from "./strategy/guest-strategy";
import { RequiredStrategy } from "./strategy/required-strategy";
import type { AuthStrategy, AuthType } from "./types";
export type * from "./types";
export * from "./context";

/** 路由策略map */
export const routerAuthMap: Record<AuthType, AuthStrategy> = {
	public: new PublicStrategy(),
	guest: new GuestStrategy(),
	required: new RequiredStrategy()
};
