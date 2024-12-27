/*
 * @Author: mulingyuer
 * @Date: 2024-12-13 17:41:25
 * @LastEditTime: 2024-12-27 16:35:59
 * @LastEditors: mulingyuer
 * @Description: 右键菜单帮助工具
 * @FilePath: \frontend\src\components\AiDataset\context-menu.helper.ts
 * 怎么可能会有bug！！！
 */
import type { FileItem } from "./types";
import { FileType } from "./types";

export enum ContextMenuKeyEnum {
	/** 编辑 */
	EDIT = "edit",
	/** 打标 */
	TAG = "tag",
	/** 删除 */
	DELETE = "delete"
}

export interface ContextMenuItem {
	label: string;
	key: ContextMenuKeyEnum;
	/** 是否显示 */
	show: boolean;
	/** 禁用 */
	disabled: boolean;
}
export type ContextMenu = ContextMenuItem[];

/** 菜单数据 */
export const menuList = ref<ContextMenu>([
	{
		label: "编辑",
		key: ContextMenuKeyEnum.EDIT,
		show: true,
		disabled: false
	},
	{
		label: "手动打标",
		key: ContextMenuKeyEnum.TAG,
		show: true,
		disabled: false
	},
	{
		label: "删除",
		key: ContextMenuKeyEnum.DELETE,
		show: true,
		disabled: false
	}
]);

export function updateMenuList(data: FileItem) {
	// 先重置状态
	menuList.value.forEach((item) => {
		item.show = true;
		item.disabled = false;
	});

	// 根据文件类型更新菜单
	switch (data.type) {
		case FileType.IMAGE:
			menuList.value[0].show = false;
			break;
		case FileType.TEXT:
			menuList.value[1].show = false;
			break;
	}
}
