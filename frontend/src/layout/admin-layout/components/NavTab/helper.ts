/*
 * @Author: mulingyuer
 * @Date: 2024-09-30 16:21:12
 * @LastEditTime: 2024-09-30 17:14:32
 * @LastEditors: mulingyuer
 * @Description: nav tab 帮助函数
 * @FilePath: \spirit-app-microservice-admin\src\layout\admin-layout\components\NavTab\helper.ts
 * 怎么可能会有bug！！！
 */
import { useNavTabStore, useAppStore } from "@/stores";

export interface NavTabToolsItem {
	icon: string;
	label: string;
	key: string;
	show: boolean;
	disabled: boolean;
}

let navTabStore: ReturnType<typeof useNavTabStore>;
let appStore: ReturnType<typeof useAppStore>;

/** nav tab 工具栏列表 */
export const navTabToolsList = ref<Array<NavTabToolsItem>>([
	{
		icon: "ri-refresh-line",
		label: "刷新页面",
		key: "refresh",
		show: true,
		disabled: false
	},
	{
		icon: "ri-close-line",
		label: "关闭当前",
		key: "closeCurrent",
		show: true,
		disabled: false
	},
	{
		icon: "ri-arrow-left-double-line",
		label: "关闭左侧",
		key: "closeLeft",
		show: true,
		disabled: false
	},
	{
		icon: "ri-arrow-right-double-line",
		label: "关闭右侧",
		key: "closeRight",
		show: true,
		disabled: false
	},
	{
		icon: "ri-arrow-left-right-line",
		label: "关闭其他",
		key: "closeOther",
		show: true,
		disabled: false
	},
	{
		icon: "ri-contract-left-right-line",
		label: "关闭所有",
		key: "closeAll",
		show: true,
		disabled: false
	}
]);

/** 根据传入的fullPath和affix来更新工具栏列表禁用状态 */
export function updateNavTabToolsList(fullPath: string, affix?: boolean) {
	if (!navTabStore) navTabStore = useNavTabStore();

	// 每次先重置状态
	navTabToolsList.value.forEach((item) => {
		item.disabled = false;
	});

	// 更新菜单列表状态
	const findIndex = navTabStore.navTabList.findIndex((item) => item.fullPath === fullPath);

	// 如果当前路由固定标签，则禁用关闭
	if (affix) {
		navTabToolsList.value[1].disabled = true;
	}

	// 如果已经是第一个了，禁用左侧关闭
	if (findIndex === 0) {
		navTabToolsList.value[2].disabled = true;
	}

	// 如果已经是最后一个了，禁用右侧关闭
	if (findIndex === navTabStore.navTabList.length - 1) {
		navTabToolsList.value[3].disabled = true;
	}

	// 如果只有一个标签，禁用其他关闭和全部关闭
	if (navTabStore.navTabList.length < 2) {
		navTabToolsList.value[4].disabled = true;
		navTabToolsList.value[5].disabled = true;
	}
}

/** 指令触发 */
export function navTabCommand(command: string, fullPath: string) {
	if (!appStore) appStore = useAppStore();

	switch (command) {
		case "refresh":
			appStore.setReloadFlag();
			break;
		case "closeCurrent":
			navTabStore.removeNavTab(fullPath);
			break;
		case "closeLeft":
			navTabStore.removeLeftNavTab(fullPath);
			break;
		case "closeRight":
			navTabStore.removeRightNavTab(fullPath);
			break;
		case "closeOther":
			navTabStore.removeOtherNavTab(fullPath);
			break;
		case "closeAll":
			navTabStore.removeAllNavTab();
			break;
		default:
			ElMessage.warning("未知指令");
			break;
	}
}
