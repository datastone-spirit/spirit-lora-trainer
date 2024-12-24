<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:39:40
 * @LastEditTime: 2024-12-24 16:30:24
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
const path = ref("/tensorboard");
// const path = ref("https://juejin.cn/");
const iframeSrc = computed(() => {
	return `${location.origin}${path.value}`;
});
</script>

<style lang="scss" scoped>
.dashboard-page {
	height: 100%;
	padding-right: $zl-padding;
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
