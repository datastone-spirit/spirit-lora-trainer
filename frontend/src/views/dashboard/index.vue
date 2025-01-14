<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:39:40
 * @LastEditTime: 2025-01-09 11:34:58
 * @LastEditors: mulingyuer
 * @Description: 仪表盘
 * @FilePath: \frontend\src\views\dashboard\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="dashboard-page">
		<div class="dashboard-page-content">
			<iframe class="dashboard-page-iframe" :src="iframeSrc" title="仪表盘"></iframe>
		</div>
	</div>
</template>

<script setup lang="ts">
const path = ref("/tensorboard/");
const iframeSrc = computed(() => {
	const isDev = import.meta.env.MODE === "development";
	if (isDev) {
		return `${import.meta.env.VITE_APP_API_BASE_URL.replace(/\/api$/, import.meta.env.BASE_URL)}${path.value}`;
	}
	return `${location.origin}${path.value}`;
});
</script>

<style lang="scss" scoped>
.dashboard-page {
	height: 100%;
}
.dashboard-page-content {
	height: 100%;
	background-color: var(--zl-dashboard-bg);
	border-radius: $zl-border-radius;
	overflow: hidden;
}
.dashboard-page-iframe {
	display: block;
	width: 100%;
	height: 100%;
	border: none;
}
</style>
