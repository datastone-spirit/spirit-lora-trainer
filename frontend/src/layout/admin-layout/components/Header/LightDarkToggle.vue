<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:28:33
 * @LastEditTime: 2024-12-10 14:23:19
 * @LastEditors: mulingyuer
 * @Description: 暗色亮色切换按钮
 * @FilePath: \frontend\src\layout\admin-layout\components\Header\LightDarkToggle.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="light-dark-toggle" @click="onToggle">
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

function onToggle(event: MouseEvent) {
	if (!("startViewTransition" in document)) {
		toggleDark();
		return;
	}

	const x = event.clientX;
	const y = event.clientY;
	const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

	// @ts-expect-error ts类型问题
	const transition = document.startViewTransition(() => {
		toggleDark();
	});

	transition.ready.then(() => {
		const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
		document.documentElement.animate(
			{
				clipPath: !isDark.value ? [...clipPath].reverse() : clipPath
			},
			{
				duration: 500,
				easing: "ease-in-out",
				pseudoElement: !isDark.value ? "::view-transition-old(root)" : "::view-transition-new(root)"
			}
		);
	});
}
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
<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
	animation: none;
	mix-blend-mode: normal;
}

/* 进入dark模式和退出dark模式时，两个图像的位置顺序正好相反 */
.dark::view-transition-old(root) {
	z-index: 1;
}
.dark::view-transition-new(root) {
	z-index: 999;
}

::view-transition-old(root) {
	z-index: 999;
}
::view-transition-new(root) {
	z-index: 1;
}
</style>
