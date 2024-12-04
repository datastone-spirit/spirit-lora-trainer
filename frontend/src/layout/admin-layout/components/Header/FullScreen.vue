<!--
 * @Author: mulingyuer
 * @Date: 2024-09-30 09:19:41
 * @LastEditTime: 2024-09-30 17:12:45
 * @LastEditors: mulingyuer
 * @Description: 全屏
 * @FilePath: \spirit-app-microservice-admin\src\layout\admin-layout\components\Header\FullScreen.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="full-screen" @click="toggle">
		<Icon v-if="!isFullscreen" name="ri-fullscreen-line" size="20" />
		<Icon v-else name="ri-fullscreen-exit-line" size="20" />
	</div>
</template>

<script setup lang="ts">
const { isFullscreen, toggle } = useFullscreen();
</script>

<style lang="scss" scoped>
.full-screen {
	width: 40px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	&:hover {
		background-color: var(--el-fill-color-light);
	}
}
</style>
