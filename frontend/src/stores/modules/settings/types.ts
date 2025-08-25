/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:17:03
 * @LastEditTime: 2025-08-25 10:10:57
 * @LastEditors: mulingyuer
 * @Description: 设置数据仓库的类型
 * @FilePath: \frontend\src\stores\modules\settings\types.ts
 * 怎么可能会有bug！！！
 */

/** 训练器设置 */
export interface TrainerSettings {
	/** 是否开启动态站点图标 */
	openAnimatedFavicon: boolean;
	/** 是否开启训练工具栏进度条背景 */
	openFooterBarProgress: boolean;
	/** 是否开启恢复训练中的任务表单数据 */
	enableTrainingTaskDataRecovery: boolean;
	/** 是否显示菜单新功能提示 */
	showAsideNewBadge: boolean;
}
