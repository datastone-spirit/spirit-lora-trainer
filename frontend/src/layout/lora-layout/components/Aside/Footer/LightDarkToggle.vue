<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:28:33
 * @LastEditTime: 2024-12-12 16:48:56
 * @LastEditors: mulingyuer
 * @Description: 暗色亮色切换按钮
 * @FilePath: \frontend\src\layout\lora-layout\components\Aside\Footer\LightDarkToggle.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-button
		class="light-dark-toggle"
		:type="btnType"
		:icon="isDark ? DarkIcon : LightIcon"
		circle
		text
		size="large"
		@click="onToggle"
	/>
</template>

<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon";
import { useAppStore } from "@/stores";

const appStore = useAppStore();

const DarkIcon = useIcon({ name: "ri-contrast-2-line", size: 20 });
const LightIcon = useIcon({ name: "ri-sun-line", size: 20 });
const { isDark } = storeToRefs(appStore);
// const isDark = useDark({
// 	storageKey: "__spirit-lora-trainer__color-scheme",
// 	valueDark: "dark",
// 	valueLight: "light"
// });
const toggleDark = useToggle(isDark);
const btnType = computed(() => (isDark.value ? "" : "primary"));

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
				duration: 350,
				easing: "ease-in-out",
				pseudoElement: !isDark.value ? "::view-transition-old(root)" : "::view-transition-new(root)"
			}
		);
	});
}
</script>

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
