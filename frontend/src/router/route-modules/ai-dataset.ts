/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:59:42
 * @LastEditTime: 2025-08-06 17:46:21
 * @LastEditors: mulingyuer
 * @Description: AI数据集路由模块
 * @FilePath: \frontend\src\router\route-modules\ai-dataset.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes({
	path: "/ai-dataset",
	name: "AIDataset",
	component: () => import("@/views/ai-dataset/index.vue"),
	meta: {
		title: "AI数据集",
		auth: "public",
		icon: "ri-database-2-line",
		sort: 30
	}
});
