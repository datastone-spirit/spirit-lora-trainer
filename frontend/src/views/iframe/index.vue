<!--
 * @Author: mulingyuer
 * @Date: 2025-02-08 15:17:57
 * @LastEditTime: 2025-02-08 15:44:19
 * @LastEditors: mulingyuer
 * @Description: iframe页面
 * @FilePath: \frontend\src\views\iframe\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="iframe-page">
		<div class="iframe-content-wrapper" v-loading="loading">
			<iframe ref="iframeRef" class="iframe-content" :src="iframeSrc" title="iframe"></iframe>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();

const loading = ref(false);
const iframeRef = ref<HTMLIFrameElement>();
const iframeSrc = ref("");

function initIframe() {
	loading.value = true;
	if (route.meta.iframeLink) {
		iframeSrc.value = route.meta.iframeLink;
	}
	if (!iframeRef.value) return;
	iframeRef.value.onload = () => {
		loading.value = false;
	};
}

onMounted(initIframe);
</script>

<style lang="scss" scoped>
.iframe-page {
	height: 100%;
}
.iframe-content-wrapper {
	height: 100%;
	background-color: var(--zl-dashboard-bg);
	border-radius: $zl-border-radius;
	overflow: hidden;
}
.iframe-content {
	display: block;
	width: 100%;
	height: 100%;
	border: none;
}
</style>
