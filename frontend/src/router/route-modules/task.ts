/*
 * @Author: mulingyuer
 * @Date: 2024-12-26 11:22:30
 * @LastEditTime: 2025-08-06 17:47:22
 * @LastEditors: mulingyuer
 * @Description: 任务列表
 * @FilePath: \frontend\src\router\route-modules\task.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes({
	path: "/task",
	name: "TaskList",
	component: () => import("@/views/task/index.vue"),
	meta: {
		auth: "public",
		title: "任务列表",
		icon: "ri-list-check-3",
		sort: 40
	}
});
