<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:28:33
 * @LastEditTime: 2025-10-14 15:18:42
 * @LastEditors: mulingyuer
 * @Description: 暗色亮色切换按钮
 * @FilePath: \frontend\src\layout\admin-layout\components\Aside\Footer\LightDarkToggle.vue
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
const isDark = storeToRefs(appStore).isDark;
const toggleDark = useToggle(isDark);
const btnType = computed(() => (isDark.value ? "" : "primary"));

function onToggle(event: MouseEvent) {
	if (!("startViewTransition" in document)) {
		toggleDark();
		return;
	}

	const x = event.clientX;
	const y = event.clientY;
	// 计算从点击位置到视窗边缘的最大距离作为动画半径
	const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

	// 设置CSS自定义属性，用于动画定位
	document.documentElement.style.setProperty("--x", x + "px");
	document.documentElement.style.setProperty("--y", y + "px");
	document.documentElement.style.setProperty("--r", endRadius + "px");

	document.startViewTransition(() => {
		toggleDark();
	});
}
</script>

<style lang="scss">
html {
	&::view-transition-old(*) {
		animation: none;
	}

	&::view-transition-new(*) {
		animation: clip 0.35s ease-in-out both;
	}

	&::view-transition-old(root) {
		z-index: 1;
	}

	&::view-transition-new(root) {
		z-index: 9999;
	}

	&.dark {
		&::view-transition-old(*) {
			animation: clip 0.35s ease-in-out reverse both;
		}

		&::view-transition-new(*) {
			animation: none;
		}

		&::view-transition-old(root) {
			z-index: 9999;
		}

		&::view-transition-new(root) {
			z-index: 1;
		}
	}
}

// 定义动画
@keyframes clip {
	from {
		clip-path: circle(0% at var(--x) var(--y));
	}

	to {
		clip-path: circle(var(--r) at var(--x) var(--y));
	}
}
</style>
