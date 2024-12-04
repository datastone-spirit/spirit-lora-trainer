<!--
 * @Author: mulingyuer
 * @Date: 2024-09-26 17:11:37
 * @LastEditTime: 2024-09-27 09:40:06
 * @LastEditors: mulingyuer
 * @Description: 空白布局
 * @FilePath: \spirit-app-microservice-admin\src\layout\blank-layout\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="blank-layout">
		<router-view></router-view>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.blank-layout {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}
</style>
