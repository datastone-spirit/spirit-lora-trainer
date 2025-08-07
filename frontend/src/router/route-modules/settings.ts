/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 10:01:30
 * @LastEditTime: 2025-08-06 17:47:14
 * @LastEditors: mulingyuer
 * @Description: 设置页面路由
 * @FilePath: \frontend\src\router\route-modules\settings.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes({
	path: "/settings",
	name: "Settings",
	component: () => import("@/views/settings/index.vue"),
	meta: {
		title: "设置",
		auth: "public",
		icon: "ri-settings-4-line",
		sort: 50
	}
});
