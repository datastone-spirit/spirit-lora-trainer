/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 17:32:12
 * @LastEditTime: 2024-09-30 17:10:54
 * @LastEditors: mulingyuer
 * @Description: routes
 * @FilePath: \spirit-app-microservice-admin\src\router\routes\index.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";
import AdminLayout from "@/layout/admin-layout/index.vue";

/** 根路由 */
export const rootRoute: RouteRecordRaw = {
	path: "/",
	name: "Root",
	component: AdminLayout,
	redirect: { path: "/dashboard" }, // HACK: 一定要用path重定向，name会导致守卫不触发
	children: []
};

/** 不存在的路由 */
export const notFoundRoute: RouteRecordRaw = {
	path: "/:pathMatch(.*)*",
	name: "NotFound",
	component: AdminLayout,
	children: [
		{
			path: "404",
			name: "NotFound404",
			component: () => import("@/views/error/404.vue"),
			meta: {
				title: "404",
				icon: "ri-calendar-close-line"
			}
		}
	]
};
