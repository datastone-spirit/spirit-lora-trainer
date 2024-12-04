<!--
 * @Author: mulingyuer
 * @Date: 2024-09-29 16:06:23
 * @LastEditTime: 2024-12-04 17:33:30
 * @LastEditors: mulingyuer
 * @Description: 顶栏
 * @FilePath: \frontend\src\layout\admin-layout\components\Header\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-header class="admin-header" :class="[headerClass]">
		<div class="admin-header-left">
			<MenuCollapse />
			<Breadcrumb />
		</div>
		<div class="admin-header-right">
			<ComplexitySetting />
			<LightDarkToggle />
			<FullScreen />
		</div>
	</el-header>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import MenuCollapse from "./MenuCollapse.vue";
import Breadcrumb from "./Breadcrumb.vue";
import FullScreen from "./FullScreen.vue";
import ComplexitySetting from "./ComplexitySetting.vue";
import LightDarkToggle from "./LightDarkToggle.vue";

const appStore = useAppStore();
const headerClass = computed(() => {
	if (appStore.isMobile) {
		// 移动端
		return appStore.isCollapse ? "is-mobile-collapse" : "is-mobile";
	} else {
		return appStore.isCollapse ? "is-collapse" : "";
	}
});
</script>

<style lang="scss" scoped>
.admin-header {
	position: fixed;
	top: 0;
	left: $aside-width;
	right: 0;
	height: $header-height;
	background-color: var(--el-bg-color);
	padding: 0;
	display: flex;
	justify-content: space-between;
	transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 3;
	&.is-mobile-collapse,
	&.is-mobile {
		left: $aside-mobile-width;
	}
	&.is-collapse {
		left: $aside-mini-width;
	}
}
.admin-header-left,
.admin-header-right {
	height: 100%;
	display: flex;
	align-items: center;
}
.admin-header-right {
	padding-right: $padding;
}
</style>
