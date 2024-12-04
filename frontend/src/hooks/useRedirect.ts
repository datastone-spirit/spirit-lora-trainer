/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 15:40:01
 * @LastEditTime: 2024-09-27 15:40:01
 * @LastEditors: mulingyuer
 * @Description: 重定向跳转hooks
 * @FilePath: \spirit-app-microservice-admin\src\hooks\useRedirect.ts
 * 怎么可能会有bug！！！
 */
// useRedirect.ts
import type { RouteLocationRaw } from "vue-router";

export type RedirectMethod = "push" | "replace";

export function useRedirect() {
	const router = useRouter();
	const route = useRoute();

	/** 重定向跳转 */
	function handleRedirect(method: RedirectMethod, to: RouteLocationRaw) {
		const redirectStr = route.query.redirect;

		if (redirectStr) {
			const { redirectPath, redirectQuery } = parseRedirect(redirectStr as string);
			const { redirect: _redirect, ...otherQuery } = route.query;
			return router[method]({
				path: redirectPath,
				query: {
					...otherQuery,
					...redirectQuery
				}
			});
		}

		return router[method](to);
	}

	/** 解析redirect字符串 */
	function parseRedirect(redirect: string) {
		const url = new URL(redirect, window.location.origin);
		const redirectPath = url.pathname;
		const redirectQuery = Object.fromEntries(url.searchParams.entries());
		return {
			redirectPath,
			redirectQuery
		};
	}

	return {
		push: (to: RouteLocationRaw) => handleRedirect("push", to),
		replace: (to: RouteLocationRaw) => handleRedirect("replace", to),
		go: router.go.bind(router),
		back: router.back.bind(router),
		forward: router.forward.bind(router),
		$router: router
	};
}
