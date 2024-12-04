<template>
	<el-config-provider :locale="locale">
		<router-view></router-view>
	</el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { breakpointsTailwind } from "@vueuse/core";

const appStore = useAppStore();
const locale = computed(() => (appStore.language === "zh-CN" ? zhCn : en));

/** 首次运行判断是否是移动端 */
function isMobile() {
	const breakpoints = useBreakpoints(breakpointsTailwind);
	const status = unref(breakpoints.smaller("sm"));
	appStore.setIsCollapse(status);
	appStore.setIsMobile(status);
	return status;
}
isMobile();

/** 监听dom的size变化 */
function deviceDetection() {
	const target = document.documentElement;
	useResizeObserver(target, (entries) => {
		const { width } = entries[0].contentRect; // 获取宽度
		if (width <= 640) {
			appStore.setIsMobile(true);
			!appStore.isCollapse && !appStore.isUserCollapse && appStore.setIsCollapse(true);
		} else {
			appStore.setIsMobile(false);
			!appStore.isUserCollapse && appStore.setIsCollapse(false);
		}
	});
}
deviceDetection();
</script>

<style scoped></style>
