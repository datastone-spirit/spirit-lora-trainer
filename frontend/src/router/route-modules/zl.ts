/*
 * @Author: mulingyuer
 * @Date: 2024-12-30 14:08:23
 * @LastEditTime: 2025-08-06 17:47:54
 * @LastEditors: mulingyuer
 * @Description: 智灵外链
 * @FilePath: \frontend\src\router\route-modules\zl.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes({
	path: "https://serverless.datastone.cn/sprite/app/",
	name: "ZL",
	component: h("div"),
	meta: {
		auth: "public",
		title: "智灵GPU服务",
		icon: "ri-link-m",
		sort: 60
	}
});
