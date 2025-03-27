/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:44
 * @LastEditTime: 2025-03-27 16:14:16
 * @LastEditors: mulingyuer
 * @Description: lora路由模块
 * @FilePath: \frontend\src\router\route-modules\lora.ts
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
		sort: 20,
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
		},
		{
			path: "/lora/hunyuan-video",
			name: "LoRA-HunyuanVideo",
			component: () => import("@/views/lora/hunyuan-video/index.vue"),
			meta: {
				title: "混元视频"
			}
		},
		{
			path: "/lora/wan-video",
			name: "LoRA-WanVideo",
			component: () => import("@/views/lora/wan-video/index.vue"),
			meta: {
				title: "Wan2.1"
			}
		}
	]
} as RouteRecordRaw;
