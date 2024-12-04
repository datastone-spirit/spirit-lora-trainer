<!--
 * @Author: mulingyuer
 * @Date: 2024-09-26 17:10:59
 * @LastEditTime: 2024-12-04 16:12:57
 * @LastEditors: mulingyuer
 * @Description: admin布局
 * @FilePath: \frontend\src\layout\admin-layout\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-container class="admin-layout">
		<Aside />
		<el-container direction="vertical">
			<Header />
			<NavTab />
			<Main />
		</el-container>
	</el-container>
</template>

<script setup lang="ts">
import Aside from "./components/Aside/index.vue";
import Header from "./components/Header/index.vue";
import Main from "./components/Main/index.vue";
import NavTab from "./components/NavTab/index.vue";
</script>

<style lang="scss" scoped>
.admin-layout {
	min-height: 100vh;
	background-color: var(--el-bg-color-page);
}
</style>
