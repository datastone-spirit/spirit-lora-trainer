<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 10:30:32
 * @LastEditTime: 2024-12-27 11:33:56
 * @LastEditors: mulingyuer
 * @Description: 底部工具栏
 * @FilePath: \frontend\src\layout\admin-layout\components\FooterBar\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<Transition name="el-zoom-in-bottom">
		<footer v-show="appStore.showFooter" class="footer-bar">
			<div class="footer-bar-left">
				<ZLSwitch
					v-model="openComplexity"
					off-text="新手"
					on-text="专家"
					@change="onComplexityChange"
				/>
			</div>
			<div class="footer-bar-content">
				<div id="footer-bar-left" class="footer-bar-content-left"></div>
				<div id="footer-bar-center" class="footer-bar-content-center"></div>
			</div>
		</footer>
	</Transition>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { useSettingsStore } from "@/stores";
import { ComplexityEnum } from "@/enums/complexity.enum";

const appStore = useAppStore();
const settingsStore = useSettingsStore();

const openComplexity = ref(settingsStore.complexity === ComplexityEnum.EXPERT);
function onComplexityChange(val: boolean) {
	const value = val ? ComplexityEnum.EXPERT : ComplexityEnum.BEGINNER;
	settingsStore.setComplexity(value);
}
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
