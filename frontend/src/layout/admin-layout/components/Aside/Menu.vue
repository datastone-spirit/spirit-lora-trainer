<!--
 * @Author: mulingyuer
 * @Date: 2024-09-27 16:40:03
 * @LastEditTime: 2025-08-25 10:00:36
 * @LastEditors: mulingyuer
 * @Description: 菜单
 * @FilePath: \frontend\src\layout\admin-layout\components\Aside\Menu.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-scrollbar>
		<el-menu
			:default-active="activeMenu"
			class="admin-menu"
			:collapse="appStore.isCollapse"
			popper-effect="dark"
			:unique-opened="false"
			:collapse-transition="false"
			:default-openeds="defaultOpeneds"
			@select="onMenuSelect"
		>
			<MenuItem v-for="item in menuList" :key="item.path" :menu="item" />
		</el-menu>
	</el-scrollbar>
</template>

<script setup lang="ts">
import MenuItem from "./MenuItem.vue";

import { useAppStore } from "@/stores";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

/** 当前选择的菜单 */
const activeMenu = computed(() => router.currentRoute.value.path);
/** 菜单列表 */
const menuList = computed(() => appStore.menuList);
/** 菜单事件 */
function onMenuSelect(path: string) {
	if (/http(s)?:/.test(path)) {
		window.open(path, "_blank");
	} else {
		router.push(path);
	}

	appStore.addOpenedPath(path);
}

/** 默认打开的菜单：目前全部打开算了 */
const defaultOpeneds = computed(() => {
	return menuList.value
		.filter((item) => item.children)
		.map((item) => {
			return item.path;
		});
});

onMounted(() => {
	appStore.addOpenedPath(route.path);
});
</script>

<style lang="scss" scoped>
.admin-menu {
	width: 100%;
	border-width: 0;
	@include no-select();
}
</style>
