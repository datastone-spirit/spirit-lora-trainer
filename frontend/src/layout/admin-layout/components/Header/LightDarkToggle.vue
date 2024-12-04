<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:28:33
 * @LastEditTime: 2024-12-04 16:38:53
 * @LastEditors: mulingyuer
 * @Description: 暗色亮色切换按钮
 * @FilePath: \frontend\src\layout\admin-layout\components\Header\LightDarkToggle.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="light-dark-toggle" @click="toggleDark()">
		<Icon v-if="isDark" name="ri-contrast-2-line" />
		<Icon v-else name="ri-sun-line" />
	</div>
</template>

<script setup lang="ts">
const isDark = useDark({
	storageKey: "__spirit-lora-trainer__color-scheme",
	valueDark: "dark",
	valueLight: "light"
});
const toggleDark = useToggle(isDark);
</script>

<style lang="scss" scoped>
.light-dark-toggle {
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
