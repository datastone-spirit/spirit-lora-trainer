/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 10:01:30
 * @LastEditTime: 2024-12-24 09:41:33
 * @LastEditors: mulingyuer
 * @Description: 设置页面路由
 * @FilePath: \frontend\src\router\route-modules\settings.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "/settings",
	name: "Settings",
	component: () => import("@/views/settings/index.vue"),
	meta: {
		title: "设置",
		auth: "public",
		icon: "ri-settings-4-line",
		sort: 4,
		isHide: true
	}
} as RouteRecordRaw;
