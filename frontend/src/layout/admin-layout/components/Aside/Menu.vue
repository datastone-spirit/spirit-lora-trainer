<!--
 * @Author: mulingyuer
 * @Date: 2024-09-27 16:40:03
 * @LastEditTime: 2024-09-30 09:14:03
 * @LastEditors: mulingyuer
 * @Description: 菜单
 * @FilePath: \spirit-app-microservice-admin\src\layout\admin-layout\components\Aside\Menu.vue
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
}
</script>

<style lang="scss" scoped>
.admin-menu {
	width: 100%;
	border-width: 0;
	@include no-select();
}
</style>
