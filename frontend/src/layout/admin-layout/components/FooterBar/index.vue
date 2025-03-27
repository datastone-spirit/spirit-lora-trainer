<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 10:30:32
 * @LastEditTime: 2025-03-27 15:50:29
 * @LastEditors: mulingyuer
 * @Description: 底部工具栏
 * @FilePath: \frontend\src\layout\admin-layout\components\FooterBar\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<Transition name="el-zoom-in-bottom">
		<footer v-show="appStore.showFooter" class="footer-bar">
			<div class="footer-bar-content">
				<div class="footer-bar-left">
					<ZLSwitch
						v-model="openComplexity"
						off-text="新手"
						on-text="专家"
						@change="onComplexityChange"
					/>
				</div>
				<div class="footer-bar-right">
					<div id="footer-bar-teleport-left" class="footer-bar-teleport-left"></div>
					<div id="footer-bar-teleport-right" class="footer-bar-teleport-right"></div>
				</div>
			</div>
			<div
				v-show="showProgress"
				class="footer-bar-progress-bar"
				:style="{ width: `${progress}%` }"
			></div>
		</footer>
	</Transition>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { useSettingsStore } from "@/stores";
import { ComplexityEnum } from "@/enums/complexity.enum";
import { useTag } from "@/hooks/useTag";
import { useFluxLora } from "@/hooks/useFluxLora";
import { useHYLora } from "@/hooks/useHYLora";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const { monitorTagData } = useTag();
const { monitorFluxLoraData } = useFluxLora();
const { monitorHYLoraData } = useHYLora();

const openComplexity = ref(settingsStore.complexity === ComplexityEnum.EXPERT);
function onComplexityChange(val: boolean) {
	const value = val ? ComplexityEnum.EXPERT : ComplexityEnum.BEGINNER;
	settingsStore.setComplexity(value);
}

/** 进度条 */
const showProgress = computed(() => {
	const open = settingsStore.trainerSettings.openFooterBarProgress;
	if (!open) return false;
	return (
		monitorTagData.value.isListen ||
		monitorFluxLoraData.value.isListen ||
		monitorHYLoraData.value.isListen
	);
});
const progress = computed(() => {
	if (monitorTagData.value.isListen) {
		return monitorTagData.value.data.percentage;
	}
	if (monitorFluxLoraData.value.isListen) {
		return monitorFluxLoraData.value.data.progress;
	}
	if (monitorHYLoraData.value.isListen) {
		return monitorHYLoraData.value.data.progress;
	}
	return 0;
});
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
	z-index: 1;
}
.footer-bar-content {
	height: 100%;
	display: flex;
}
.footer-bar-left,
.footer-bar-right {
	height: 100%;
}
.footer-bar-left {
	width: $zl-aside-width;
	display: flex;
	align-items: center;
	justify-content: center;
}
.footer-bar-right {
	flex-grow: 1;
	min-width: 0;
	display: flex;
	justify-content: space-between;
	padding: 0 $zl-padding;
}
.footer-bar-teleport-left {
	flex-shrink: 0;
}
.footer-bar-teleport-right {
	flex-grow: 1;
	min-width: 0;
}
.footer-bar-progress-bar {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 200px;
	background-color: rgba(32, 189, 160, 0.2);
	transition: width 0.6s ease;
	animation: van-skeleton-blink 1.2s ease-in-out infinite;
	z-index: -1;
}
@keyframes van-skeleton-blink {
	50% {
		opacity: 0.6;
	}
}
</style>
