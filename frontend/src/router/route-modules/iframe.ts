/*
 * @Author: mulingyuer
 * @Date: 2025-02-08 15:28:15
 * @LastEditTime: 2025-02-08 16:07:41
 * @LastEditors: mulingyuer
 * @Description: iframe路由
 * @FilePath: \frontend\src\router\route-modules\iframe.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default [
	{
		path: "/dashboard",
		name: "Dashboard",
		component: () => import("@/views/iframe/index.vue"),
		meta: {
			title: "仪表盘",
			icon: "ri-dashboard-3-line",
			auth: "public",
			affix: true,
			sort: 10,
			iframeLink: (() => {
				const path = "/tensorboard/";
				const isDev = import.meta.env.MODE === "development";
				if (isDev) {
					return `${import.meta.env.VITE_APP_API_BASE_URL.replace(/\/api$/, import.meta.env.BASE_URL)}${path}`;
				}
				return `${location.origin}${path}`;
			})()
		}
	},
	{
		path: "https://serverless.datastone.cn/sprite/docs/zh/lora-trainer/quick-start",
		name: "ZLDocs",
		component: () => import("@/views/iframe/index.vue"),
		meta: {
			sort: 70,
			auth: "public",
			title: "训练器指南",
			icon: "ri-article-line"
		}
	}
] as RouteRecordRaw[];
