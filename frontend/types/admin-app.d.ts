/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 17:02:33
 * @LastEditTime: 2025-08-25 09:39:16
 * @LastEditors: mulingyuer
 * @Description: 应用全局类型定义
 * @FilePath: \frontend\types\admin-app.d.ts
 * 怎么可能会有bug！！！
 */

declare namespace AdminApp {
	/** 菜单数据类型 */
	interface Menu {
		path: string;
		name: string;
		title: string;
		icon?: string;
		loRATaskType?: TaskType;
		children?: Menu[];
		/** 是否显示新增badge */
		showNewBadge: boolean;
	}
	/** navTab数据类型 */
	interface NavTabData {
		fullPath: string;
		name?: string;
		title?: string;
		icon?: string;
		/** 是否固定（不允许关闭） */
		affix?: boolean;
	}
}

declare module "vuefinder/dist/vuefinder";
declare module "vuefinder";
