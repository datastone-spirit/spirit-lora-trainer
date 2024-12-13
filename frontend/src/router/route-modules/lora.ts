/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:44
 * @LastEditTime: 2024-12-13 09:34:47
 * @LastEditors: mulingyuer
 * @Description: lora路由模块
 * @FilePath: \spirit-lora-trainer\frontend\src\router\route-modules\lora.ts
 * 怎么可能会有bug！！！
 */
import type { RouteRecordRaw } from "vue-router";

export default {
	path: "/lora",
	component: () => import("@/layout/admin-layout/index.vue"),
	meta: {
		auth: "public",
		title: "LoRA 训练",
		icon: "ri-quill-pen-ai-line",
		sort: 2,
		showFooter: true
	},
	children: [
		// {
		// 	path: "/lora/sdxl",
		// 	name: "LoRA-SDXL",
		// 	component: () => import("@/views/lora/sdxl/index.vue"),
		// 	meta: {
		// 		title: "SDXL"
		// 	}
		// },
		{
			path: "/lora/flux",
			name: "LoRA-Flux",
			component: () => import("@/views/lora/flux/index.vue"),
			meta: {
				title: "Flux"
			}
		}
	]
} as RouteRecordRaw;
