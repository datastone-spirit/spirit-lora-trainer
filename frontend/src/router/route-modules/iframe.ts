/*
 * @Author: mulingyuer
 * @Date: 2025-02-08 15:28:15
 * @LastEditTime: 2025-08-06 17:51:19
 * @LastEditors: mulingyuer
 * @Description: iframe路由
 * @FilePath: \frontend\src\router\route-modules\iframe.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes([
	{
		path: "/tensorBoard",
		name: "TensorBoard",
		component: () => import("@/views/iframe/index.vue"),
		meta: {
			title: "TensorBoard",
			icon: "ri-line-chart-line",
			auth: "public",
			affix: true,
			sort: 11,
			iframeLink: (() => {
				const path = "/tensorboard/";
				const isDev = import.meta.env.MODE === "development";
				if (isDev) {
					return `${import.meta.env.VITE_APP_API_BASE_URL.replace(/\/api$/, "")}${path}`;
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
]);
