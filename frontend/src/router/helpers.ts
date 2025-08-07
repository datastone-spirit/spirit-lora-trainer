/*
 * @Author: mulingyuer
 * @Date: 2024-09-26 17:54:10
 * @LastEditTime: 2025-08-06 17:43:07
 * @LastEditors: mulingyuer
 * @Description: 路由辅助函数
 * @FilePath: \frontend\src\router\helpers.ts
 * 怎么可能会有bug！！！
 */
import type { Router, RouteRecordRaw } from "vue-router";
import { useAppStore } from "@/stores";

/** 获取所有路由模块并转成routes数组并排序 */
export function getModulesRoutes(globData: Record<string, any>): RouteRecordRaw[] {
	const modulesRoutes: RouteRecordRaw[] = [];

	Object.keys(globData).forEach((key: string) => {
		const value = globData[key].default;
		if (Array.isArray(value)) {
			modulesRoutes.push(...value);
		} else {
			modulesRoutes.push(value);
		}
	});

	// 排序路由
	return sortRoutes(modulesRoutes);
}

/** 路由排序 */
export function sortRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
	return routes
		.toSorted((next, pre) => Number(next.meta?.sort) - Number(pre.meta?.sort))
		.map((item) => {
			if (item.children) sortRoutes(item.children);
			return item;
		});
}

/** 根据路由生成菜单 */
export function generateMenu(routes: RouteRecordRaw[]): AdminApp.Menu[] {
	const menus: AdminApp.Menu[] = [];

	routes.forEach((route) => {
		if (route.meta?.isHide) return;

		const menu: AdminApp.Menu = {
			path: route.path,
			name: (route.name as string) ?? "",
			title: route.meta?.title ?? "",
			icon: route.meta?.icon ?? ""
		};

		if (route.children && route.children.length > 0) {
			menu.children = generateMenu(route.children);
		}

		menus.push(menu);
	});

	return menus;
}

/** 初始化路由 */
export function initRoutes(
	router: Router,
	routes: RouteRecordRaw[],
	appStore: ReturnType<typeof useAppStore>
) {
	// 添加静态路由
	routes.forEach((route) => {
		route.children?.length ? router.addRoute(route) : router.addRoute("Root", route);
	});

	// 初始化菜单
	const menus = generateMenu(routes);
	appStore.setMenuList(menus);

	// 标记初始化路由完成
	appStore.setInitRoute(true);
}

/** 定义一个路由 */
export function defineRoutes(route: RouteRecordRaw | RouteRecordRaw[]) {
	return route;
}
