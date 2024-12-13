<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 10:30:32
 * @LastEditTime: 2024-12-13 09:44:53
 * @LastEditors: mulingyuer
 * @Description: 底部工具栏
 * @FilePath: \spirit-lora-trainer\frontend\src\layout\admin-layout\components\FooterBar\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<Transition name="fade">
		<footer v-show="appStore.showFooter" class="footer-bar">
			<div class="footer-bar-left">
				<ComplexitySetting />
			</div>
			<div class="footer-bar-content">
				<div id="footer-bar-left" class="footer-bar-content-left"></div>
				<div id="footer-bar-center" class="footer-bar-content-center"></div>
			</div>
		</footer>
	</Transition>
</template>

<script setup lang="ts">
import ComplexitySetting from "./ComplexitySetting.vue";
import { useAppStore } from "@/stores";

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.footer-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: $zl-footer-bar-height;
	background-color: var(--zl-footer-bar-bg);
	border-top-left-radius: $zl-border-radius;
	border-top-right-radius: $zl-border-radius;
	display: flex;
}
.footer-bar-left {
	width: $zl-aside-width;
	margin-right: $zl-padding;
	padding: 0 $zl-padding;
	display: flex;
	align-items: center;
	justify-content: center;
}
.footer-bar-content {
	flex-grow: 1;
	min-width: 0;
	display: flex;
}
// .footer-bar-content-left,
// .footer-bar-content-center {
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// }
.footer-bar-content-left {
	flex-shrink: 0;
}
.footer-bar-content-center {
	flex-grow: 1;
	min-width: 0;
	padding: 0 $zl-padding;
}
</style>
