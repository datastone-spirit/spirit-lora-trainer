/*
 * @Author: mulingyuer
 * @Date: 2024-09-26 14:55:57
 * @LastEditTime: 2025-03-28 10:17:02
 * @LastEditors: mulingyuer
 * @Description: 路由类型
 * @FilePath: \frontend\types\router.d.ts
 * 怎么可能会有bug！！！
 */
import type { AuthType } from "@/router/router-auth";

declare module "vue-router" {
	/** 路由配置项 */
	interface RouteMeta {
		/** 页面标题 */
		title?: string;
		/** 页面图标 */
		icon?: string;
		/** 是否隐藏菜单 */
		isHide?: boolean;
		/** 菜单排序 */
		sort?: number;
		/** 是否开启keepAlive */
		keepAlive?: boolean;
		/** 是否是访客页面 */
		auth?: AuthType;
		/** 是否固定（不允许关闭） */
		affix?: boolean;
		/** 是否显示footer-bar */
		showFooter?: boolean;
		/** 外链地址 */
		iframeLink?: string;
		/** 当前页面的任务类型 */
		loRATaskType?: TaskType;
	}
}

export {};
