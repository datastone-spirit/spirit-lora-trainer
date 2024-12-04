/*
 * @Author: mulingyuer
 * @Date: 2024-09-26 17:38:16
 * @LastEditTime: 2024-12-04 10:32:40
 * @LastEditors: mulingyuer
 * @Description: 仪表盘
 * @FilePath: \frontend\src\router\route-modules\dashboard.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "/dashboard",
	name: "Dashboard",
	component: () => import("@/views/dashboard/index.vue"),
	meta: {
		title: "仪表盘",
		icon: "ri-dashboard-3-line",
		auth: "public",
		affix: true,
		sort: 1
	}
} as RouteRecordRaw;
