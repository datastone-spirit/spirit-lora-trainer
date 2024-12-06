<!--
 * @Author: mulingyuer
 * @Date: 2024-09-27 16:29:28
 * @LastEditTime: 2024-12-06 16:50:12
 * @LastEditors: mulingyuer
 * @Description: logo
 * @FilePath: \frontend\src\layout\admin-layout\components\Aside\Logo.vue
 * 怎么可能会有bug！！！
-->
<template>
	<router-link class="logo-link" to="/">
		<img class="logo-img" src="@/assets/images/logo.svg" :alt="logoTitle" />
		<h1 v-if="!appStore.isCollapse" class="logo-title">{{ logoTitle }}</h1>
	</router-link>
	<div></div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

const appStore = useAppStore();
const logoTitle = import.meta.env.VITE_APP_TITLE;
</script>

<style lang="scss" scoped>
.logo-link {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 56px;
	white-space: nowrap;
	text-decoration: none;
	color: var(--el-color-primary);
	&:active {
		opacity: 0.7;
	}
}
.logo-img {
	flex-shrink: 0;
	width: 25px;
	height: 25px;
}
.logo-title {
	margin-left: 8px;
	font-size: 16px;
	letter-spacing: 1px;
}
</style>
