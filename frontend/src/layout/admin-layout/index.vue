<!--
 * @Author: mulingyuer
 * @Date: 2024-09-26 17:10:59
 * @LastEditTime: 2024-12-13 09:43:56
 * @LastEditors: mulingyuer
 * @Description: admin布局
 * @FilePath: \spirit-lora-trainer\frontend\src\layout\admin-layout\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-container class="admin-layout">
		<Aside />
		<FooterBar />
		<el-container direction="vertical">
			<Main />
		</el-container>
	</el-container>
</template>

<script setup lang="ts">
import Aside from "./components/Aside/index.vue";
import Main from "./components/Main/index.vue";
import FooterBar from "./components/FooterBar/index.vue";
</script>

<style lang="scss" scoped>
.admin-layout {
	min-height: 100vh;
	background-color: var(--zl-page-bg);
}
</style>
