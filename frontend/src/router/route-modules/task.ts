/*
 * @Author: mulingyuer
 * @Date: 2024-12-26 11:22:30
 * @LastEditTime: 2025-01-09 11:27:00
 * @LastEditors: mulingyuer
 * @Description: 任务列表
 * @FilePath: \frontend\src\router\route-modules\task.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "/task",
	name: "TaskList",
	component: () => import("@/views/task/index.vue"),
	meta: {
		auth: "public",
		title: "任务列表",
		icon: "ri-list-check-3",
		sort: 40
	}
} as RouteRecordRaw;
