<!--
 * @Author: mulingyuer
 * @Date: 2024-09-29 17:00:46
 * @LastEditTime: 2024-12-13 09:43:17
 * @LastEditors: mulingyuer
 * @Description: main
 * @FilePath: \spirit-lora-trainer\frontend\src\layout\admin-layout\components\Main\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-main class="admin-main" :class="[mainClass, footerBarClass]">
		<div class="admin-main-content" :class="[footerBarClass]">
			<router-view>
				<template #default="{ Component, route }">
					<el-backtop title="回到顶部" />
					<transition :name="appStore.routeAnimate" mode="out-in" appear>
						<keep-alive :include="appStore.keepAliveList">
							<component :is="Component" :key="route.fullPath" v-if="appStore.reloadFlag" />
						</keep-alive>
					</transition>
				</template>
			</router-view>
		</div>
	</el-main>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

const appStore = useAppStore();
const mainClass = computed(() => {
	if (appStore.isMobile) {
		// 移动端
		return appStore.isCollapse ? "is-mobile-collapse" : "is-mobile";
	} else {
		return appStore.isCollapse ? "is-collapse" : "";
	}
});

const footerBarClass = computed(() => {
	return appStore.showFooter ? "show-footer-bar" : "hide-footer-bar";
});
</script>

<style lang="scss" scoped>
.admin-main {
	padding: 0;
	padding-left: $zl-aside-width;
	transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	&.is-mobile-collapse,
	&.is-mobile {
		padding-left: $zl-aside-mobile-width;
	}
	&.is-collapse {
		padding-left: $zl-aside-mini-width;
	}
}
.admin-main-content {
	padding: $zl-padding 0 $zl-padding $zl-padding;
	height: 100%;
	overflow: hidden;
	&.show-footer-bar {
		padding-bottom: calc($zl-padding + $zl-footer-bar-height);
	}
}
</style>
