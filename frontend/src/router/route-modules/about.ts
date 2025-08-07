/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 10:03:14
 * @LastEditTime: 2025-08-06 17:46:04
 * @LastEditors: mulingyuer
 * @Description: 关于路由模块
 * @FilePath: \frontend\src\router\route-modules\about.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes({
	path: "/about",
	name: "About",
	component: () => import("@/views/about/index.vue"),
	meta: {
		title: "关于",
		auth: "public",
		icon: "ri-question-line",
		sort: 150
	}
});
