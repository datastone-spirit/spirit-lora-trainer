/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 17:26:54
 * @LastEditTime: 2024-12-13 09:34:30
 * @LastEditors: mulingyuer
 * @Description: 路由守卫
 * @FilePath: \spirit-lora-trainer\frontend\src\router\guard\index.ts
 * 怎么可能会有bug！！！
 */
import type { Router } from "vue-router";
import { routerAuthMap, RouterAuthContext } from "../router-auth";
import { NProgress } from "@/utils/nprogress";
import { useAppStore } from "@/stores";
import { initRoutes } from "../helpers";
import { modulesRoutes } from "../route-modules";

export async function createRouterGuard(router: Router) {
	const appStore = useAppStore();

	/** 路由守卫 */
	router.beforeEach((to, from, next) => {
		/** 进度条 */
		NProgress.start();
		/** 初始化路由 */
		if (!appStore.isInitRoute) {
			initRoutes(router, modulesRoutes, appStore);
			return next({ path: to.fullPath, replace: true, query: to.query, hash: to.hash });
		}

		/** 不存在的页面 */
		if (to.name === "NotFound") return next({ name: "NotFound404" });

		/** 记录是否显示footer-bar */
		const showFooter = to.meta.showFooter ?? false;
		appStore.setShowFooter(showFooter);

		/** 鉴权策略 */
		const authType = to.meta.auth ?? "required";
		const strategy = routerAuthMap[authType];
		if (strategy) {
			const routerAuthContext = new RouterAuthContext(to, from, next);
			strategy.execute(routerAuthContext);
			return;
		}

		/** 无鉴权时 */
		next();
	});

	router.afterEach((_to, _from) => {
		/** 进度条 */
		NProgress.done();
	});
}
