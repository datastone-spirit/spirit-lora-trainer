<!--
 * @Author: mulingyuer
 * @Date: 2024-09-26 15:14:46
 * @LastEditTime: 2024-09-30 17:24:03
 * @LastEditors: mulingyuer
 * @Description: 404
 * @FilePath: \spirit-app-microservice-admin\src\views\error\404.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="error-404">
		<div class="error-404-content">
			<img class="error-404-img" src="@/assets/images/404.svg" alt="404" />
			<router-link class="error-404-link" to="/">
				<el-button type="primary">返回首页</el-button>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.error-404 {
	height: 100%;
	display: flex;
	padding: 20px;
}
.error-404-content {
	margin: auto;
}
.error-404-img {
	width: 350px;
}
.error-404-link {
	display: block;
	margin-top: 48px;
	text-align: center;
}
</style>
