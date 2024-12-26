/*
 * @Author: mulingyuer
 * @Date: 2024-12-26 11:22:30
 * @LastEditTime: 2024-12-26 11:29:18
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
		sort: 5
	}
} as RouteRecordRaw;
