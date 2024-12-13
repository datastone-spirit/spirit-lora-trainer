<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:55:58
 * @LastEditTime: 2024-12-13 11:55:54
 * @LastEditors: mulingyuer
 * @Description: 内容组件
 * @FilePath: \frontend\src\components\SplitRightPanel\SplitRightContent.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="split-right-content">
		<AiDataset v-show="settingsStore.showAIDataset" />
		<TomlPreview v-show="settingsStore.showTomlPreview" :toml="toml" />
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
}
</style>
