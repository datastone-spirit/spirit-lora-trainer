<!--
 * @Author: mulingyuer
 * @Date: 2024-12-11 17:11:26
 * @LastEditTime: 2024-12-11 17:20:47
 * @LastEditors: mulingyuer
 * @Description: 折叠侧边栏按钮
 * @FilePath: \frontend\src\layout\admin-layout\components\Aside\Footer\MenuCollapse.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-button
		class="menu-collapse-btn"
		:icon="appStore.isCollapse ? UnFoldIcon : FoldIcon"
		circle
		text
		size="large"
		@click="toggleCollapse"
	/>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { useIcon } from "@/hooks/useIcon";

const appStore = useAppStore();
function toggleCollapse() {
	appStore.setIsCollapse(!appStore.isCollapse);
	appStore.setIsUserCollapse(!appStore.isUserCollapse);
}

const FoldIcon = useIcon({ name: "ri-menu-fold-line", size: 20 });
const UnFoldIcon = useIcon({ name: "ri-menu-unfold-line", size: 20 });
</script>

<style lang="scss" scoped></style>
