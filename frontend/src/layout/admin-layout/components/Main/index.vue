<!--
 * @Author: mulingyuer
 * @Date: 2024-09-29 17:00:46
 * @LastEditTime: 2024-12-05 15:17:55
 * @LastEditors: mulingyuer
 * @Description: main
 * @FilePath: \frontend\src\layout\admin-layout\components\Main\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-main class="admin-main" :class="[mainClass]">
		<div class="admin-main-content">
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
</script>

<style lang="scss" scoped>
.admin-main {
	padding: 0;
	padding-top: calc($header-height);
	padding-left: $aside-width;
	transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	&.is-mobile-collapse,
	&.is-mobile {
		padding-left: $aside-mobile-width;
	}
	&.is-collapse {
		padding-left: $aside-mini-width;
	}
}
.admin-main-content {
	padding: $padding;
	height: 100%;
	overflow: hidden;
}
</style>
