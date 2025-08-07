/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:51:44
 * @LastEditTime: 2025-08-06 17:46:57
 * @LastEditors: mulingyuer
 * @Description: lora路由模块
 * @FilePath: \frontend\src\router\route-modules\lora.ts
 * 怎么可能会有bug！！！
 */
import { defineRoutes } from "../helpers";

export default defineRoutes({
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
		{
			path: "/lora/flux",
			name: "LoRA-Flux",
			component: () => import("@/views/lora/flux/index.vue"),
			meta: {
				title: "Flux",
				loRATaskType: "flux"
			}
		},
		{
			path: "/lora/flux-kontext",
			name: "LoRA-FluxKontext",
			component: () => import("@/views/lora/flux-kontext/index.vue"),
			meta: {
				title: "Flux Kontext",
				loRATaskType: "flux-kontext"
			}
		},
		{
			path: "/lora/hunyuan-video",
			name: "LoRA-HunyuanVideo",
			component: () => import("@/views/lora/hunyuan-video/index.vue"),
			meta: {
				title: "混元视频",
				loRATaskType: "hunyuan-video"
			}
		},
		{
			path: "/lora/wan-video",
			name: "LoRA-WanVideo",
			component: () => import("@/views/lora/wan-video/index.vue"),
			meta: {
				title: "Wan2.1",
				loRATaskType: "wan-video"
			}
		}
	]
});
