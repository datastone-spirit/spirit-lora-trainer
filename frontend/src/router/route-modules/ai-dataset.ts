/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:59:42
 * @LastEditTime: 2024-12-04 10:44:25
 * @LastEditors: mulingyuer
 * @Description: AI数据集路由模块
 * @FilePath: \frontend\src\router\route-modules\ai-dataset.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "/ai-dataset",
	name: "AIDataset",
	component: () => import("@/views/ai-dataset/index.vue"),
	meta: {
		title: "AI数据集",
		auth: "public",
		icon: "ri-database-2-line",
		sort: 3
	}
} as RouteRecordRaw;
