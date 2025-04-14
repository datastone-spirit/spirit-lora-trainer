/*
 * @Author: mulingyuer
 * @Date: 2024-09-26 11:22:25
 * @LastEditTime: 2025-03-27 16:23:58
 * @LastEditors: mulingyuer
 * @Description: 应用配置
 * @FilePath: \frontend\src\stores\modules\app\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type { RouteAnimateType } from "./types";

export const useAppStore = defineStore(
	"app",
	() => {
		/** 语言 */
		const language = ref("zh-CN");
		function setLanguage(lang: string) {
			language.value = lang;
		}

		/** 是否折叠侧边栏 */
		const isCollapse = ref(false);
		function setIsCollapse(collapse: boolean) {
			isCollapse.value = collapse;
		}

		/** 是否用户触发折叠侧边栏 */
		const isUserCollapse = ref(false);
		function setIsUserCollapse(collapse: boolean) {
			isUserCollapse.value = collapse;
		}

		/** 是否移动端 */
		const isMobile = ref(false);
		function setIsMobile(mobile: boolean) {
			isMobile.value = mobile;
		}

		/** 是否初始化路由 */
		const isInitRoute = ref(false);
		function setInitRoute(init: boolean) {
			isInitRoute.value = init;
		}

		/** 菜单列表 */
		const menuList = ref<Array<AdminApp.Menu>>([]);
		function setMenuList(list: Array<AdminApp.Menu>) {
			menuList.value = list;
		}

		/** keep-alive缓存名单 */
		const keepAliveList = ref<Array<string>>([]);
		function setKeepAliveList(list: Array<string>) {
			keepAliveList.value = list;
		}
		function addKeepAlive(name: string) {
			keepAliveList.value.push(name);
		}
		function removeKeepAlive(name: string) {
			const findIndex = keepAliveList.value.findIndex((item) => item === name);
			if (findIndex !== -1) {
				keepAliveList.value.splice(findIndex, 1);
			}
		}

		/** 是否清理keep-alive缓存 */
		const reloadFlag = ref(true);
		function setReloadFlag() {
			reloadFlag.value = false;
			nextTick(() => {
				reloadFlag.value = true;
			});
		}

		/** 路由动画 */
		const routeAnimate = ref<RouteAnimateType>("zoom-fade");
		function setRouteAnimate(animate: RouteAnimateType) {
			routeAnimate.value = animate;
		}

		/** 是否暗色模式，useDark自己有持久化 */
		const isDark = useDark({
			storageKey: `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}color-scheme`,
			valueDark: "dark",
			valueLight: "light"
		});

		/** 是否显示footer-bar */
		const showFooter = ref(false);
		function setShowFooter(show: boolean) {
			showFooter.value = show;
		}

		return {
			language,
			setLanguage,
			isCollapse,
			setIsCollapse,
			isUserCollapse,
			setIsUserCollapse,
			isMobile,
			setIsMobile,
			isInitRoute,
			setInitRoute,
			menuList,
			setMenuList,
			keepAliveList,
			setKeepAliveList,
			addKeepAlive,
			removeKeepAlive,
			reloadFlag,
			setReloadFlag,
			routeAnimate,
			setRouteAnimate,
			isDark,
			showFooter,
			setShowFooter
		};
	},
	{
		persist: {
			pick: ["language", "isCollapse"]
		}
	}
);

export type UseAppStore = ReturnType<typeof useAppStore>;
