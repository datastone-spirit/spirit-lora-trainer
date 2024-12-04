<!--
 * @Author: mulingyuer
 * @Date: 2024-09-29 16:14:44
 * @LastEditTime: 2024-09-29 17:16:13
 * @LastEditors: mulingyuer
 * @Description: 折叠侧边栏按钮
 * @FilePath: \spirit-app-microservice-admin\src\layout\admin-layout\components\Header\MenuCollapse.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="menu-collapse" @click="toggleCollapse">
		<Icon v-if="!appStore.isCollapse" name="ri-menu-fold-line" size="20" />
		<Icon v-else name="ri-menu-unfold-line" size="20" />
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

const appStore = useAppStore();
function toggleCollapse() {
	appStore.setIsCollapse(!appStore.isCollapse);
	appStore.setIsUserCollapse(!appStore.isUserCollapse);
}
</script>

<style lang="scss" scoped>
.menu-collapse {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	cursor: pointer;
	&:hover {
		background-color: var(--el-fill-color-light);
	}
}
</style>
