<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:55:58
 * @LastEditTime: 2024-12-12 17:03:20
 * @LastEditors: mulingyuer
 * @Description: 内容组件
 * @FilePath: \frontend\src\components\SplitRightPanel\SplitRightContent.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="split-right-content">
		<div class="split-right-content-body">
			<div class="split-right-content-body-box">
				<AiDataset v-show="settingsStore.showAIDataset" />
				<TomlPreview v-show="settingsStore.showTomlPreview" :toml="toml" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";

export interface SplitRightContentProps {
	toml: string;
}

defineProps<SplitRightContentProps>();

const settingsStore = useSettingsStore();
</script>

<style lang="scss" scoped>
.split-right-content {
	flex-grow: 1;
	min-width: 0;
	min-height: 300px;
	background-color: var(--zl-split-right-panel-bg);
	border-radius: $zl-border-radius;
}
.split-right-content-body {
	height: 100%;
	overflow: auto;
	padding: $zl-padding 0 $zl-padding $zl-padding;
}

.split-right-content-body-box {
	height: 100%;
	overflow: auto;
	padding-right: 6px;
	&::-webkit-scrollbar {
		width: $zl-scrollbar-width;
	}
	&::-webkit-scrollbar-thumb {
		background: var(--zl-scrollbar);
	}
}
@supports not (selector(::-webkit-scrollbar)) {
	.split-right-content-body-box {
		scrollbar-width: thin;
		scrollbar-color: var(--zl-scrollbar) transparent;
	}
}
</style>
