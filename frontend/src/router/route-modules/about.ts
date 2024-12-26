/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 10:03:14
 * @LastEditTime: 2024-12-26 11:28:41
 * @LastEditors: mulingyuer
 * @Description: 关于路由模块
 * @FilePath: \frontend\src\router\route-modules\about.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "/about",
	name: "About",
	component: () => import("@/views/about/index.vue"),
	meta: {
		title: "关于",
		auth: "public",
		icon: "ri-question-line",
		sort: 6
	}
} as RouteRecordRaw;
