/*
 * @Author: mulingyuer
 * @Date: 2025-08-06 17:18:09
 * @LastEditTime: 2025-08-06 17:43:28
 * @LastEditors: mulingyuer
 * @Description: 监控面板
 * @FilePath: \frontend\src\router\route-modules\dashboard.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes({
	path: "/dashboard",
	name: "Dashboard",
	component: () => import("@/views/dashboard/index.vue"),
	meta: {
		auth: "public",
		title: "监控面板",
		icon: "ri-dashboard-3-line",
		sort: 10
	}
});
