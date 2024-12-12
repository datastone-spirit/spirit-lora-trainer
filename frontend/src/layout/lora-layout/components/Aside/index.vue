<!--
 * @Author: mulingyuer
 * @Date: 2024-09-27 16:00:24
 * @LastEditTime: 2024-12-12 08:45:53
 * @LastEditors: mulingyuer
 * @Description: 侧边栏
 * @FilePath: \frontend\src\layout\admin-layout\components\Aside\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-aside :class="['admin-layout-aside', asideClass]">
		<Logo />
		<Menu />
		<Footer />
	</el-aside>
	<div v-if="showAppMask" class="el-aside-mask" @click="onCloseAppMask"></div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import Logo from "./Logo.vue";
import Menu from "./Menu.vue";
import Footer from "./Footer/index.vue";

const appStore = useAppStore();

const asideClass = computed(() => {
	if (appStore.isMobile) {
		// 移动端
		return appStore.isCollapse ? "is-mobile-collapse" : "is-mobile";
	} else {
		return appStore.isCollapse ? "is-collapse" : "";
	}
});
const showAppMask = computed(() => appStore.isMobile && !appStore.isCollapse);
function onCloseAppMask() {
	appStore.setIsCollapse(true);
}
</script>

<style lang="scss" scoped>
.admin-layout-aside {
	position: fixed;
	top: $zl-padding;
	left: 0;
	bottom: calc($zl-padding + $zl-footer-bar-height);
	overflow: hidden;
	background-color: var(--el-bg-color);
	// box-shadow: 0 0 1px rgba(136, 136, 136);
	transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	display: flex;
	flex-direction: column;
	z-index: 5;
	width: $zl-aside-width;
	border-top-right-radius: $zl-border-radius;
	border-bottom-right-radius: $zl-border-radius;
	&.is-collapse {
		width: $zl-aside-mini-width;
	}
	&.is-mobile {
		width: $zl-aside-width;
	}
	&.is-mobile-collapse {
		width: $zl-aside-mobile-width;
	}
}
.el-aside-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 4;
}
</style>
