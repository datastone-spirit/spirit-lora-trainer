/*
 * @Author: mulingyuer
 * @Date: 2024-12-30 14:08:23
 * @LastEditTime: 2024-12-30 14:16:35
 * @LastEditors: mulingyuer
 * @Description: 智灵外链
 * @FilePath: \frontend\src\router\route-modules\zl.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "https://serverless.datastone.cn/sprite/app/",
	name: "ZL",
	component: h("div"),
	meta: {
		auth: "public",
		title: "智灵GPU服务",
		icon: "ri-link-m",
		sort: 6
	}
} as RouteRecordRaw;
