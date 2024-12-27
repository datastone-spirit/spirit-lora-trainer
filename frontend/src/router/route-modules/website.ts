/*
 * @Author: mulingyuer
 * @Date: 2024-12-27 10:35:37
 * @LastEditTime: 2024-12-27 10:35:37
 * @LastEditors: mulingyuer
 * @Description: 官网介绍路由模块
 * @FilePath: \frontend\src\router\route-modules\website.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "/website",
	name: "Website",
	component: () => import("@/views/website/index.vue"),
	meta: {
		auth: "public",
		title: "官网介绍",
		isHide: true
	}
} as RouteRecordRaw;
