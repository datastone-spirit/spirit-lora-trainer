<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:50:29
 * @LastEditTime: 2024-12-16 10:53:09
 * @LastEditors: mulingyuer
 * @Description: 右侧内容
 * @FilePath: \frontend\src\components\Split\SplitRightPanel\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="split-right-panel">
		<div class="split-right-content-header">
			<div class="split-right-content-header-box">
				<PreviewSwitch />
				<el-space>
					<el-button v-show="settingsStore.showAIDataset" :loading="refreshing" @click="onRefresh"
						>刷新</el-button
					>
					<el-button v-show="settingsStore.showAIDataset" type="primary">上传文件</el-button>
				</el-space>
			</div>
		</div>
		<div class="split-right-content">
			<AiDataset ref="aiDatasetRef" v-show="settingsStore.showAIDataset" />
			<TomlPreview v-show="settingsStore.showTomlPreview" :toml="toml" />
		</div>
	</div>
</template>

<script setup lang="ts">
import PreviewSwitch from "./PreviewSwitch.vue";
import AiDataset from "@/components/AiDataset/index.vue";
import { useSettingsStore } from "@/stores";

export interface SplitRightContentProps {
	toml: string;
}

defineProps<SplitRightContentProps>();

const settingsStore = useSettingsStore();
const aiDatasetRef = ref<InstanceType<typeof AiDataset>>();

// 刷新
const refreshing = ref(false);
async function onRefresh() {
	if (!aiDatasetRef.value) return;
	refreshing.value = true;
	aiDatasetRef.value.getList().finally(() => {
		refreshing.value = false;
	});
}
</script>

<style lang="scss" scoped>
.split-right-panel {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.split-right-content-header {
	padding: $zl-padding;
	background-color: var(--zl-split-right-panel-bg);
	border-radius: $zl-border-radius;
	height: 60px;
	margin-bottom: $zl-padding;
}
.split-right-content-header-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 36px;
}
.split-right-content {
	flex-grow: 1;
	min-width: 0;
}
</style>
