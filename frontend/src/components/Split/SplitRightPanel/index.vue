<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:50:29
 * @LastEditTime: 2024-12-30 10:33:57
 * @LastEditors: mulingyuer
 * @Description: 右侧内容
 * @FilePath: \frontend\src\components\Split\SplitRightPanel\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="split-right-panel">
		<div class="split-right-content-header">
			<div class="split-right-content-header-box">
				<ZLSwitch
					v-model="openPreview"
					off-text="AI数据集"
					on-text="TOML"
					:item-width="80"
					@change="onPreviewChange"
				/>
				<div id="split-right-content-header-right" class="split-right-content-header-right"></div>
			</div>
		</div>
		<div class="split-right-content">
			<AiDataset
				ref="aiDatasetRef"
				v-show="showAIDataset"
				btn-teleport-to="#split-right-content-header-right"
				:show-teleport-btn="showAIDataset"
				:dir="dir"
			/>
			<TomlPreview v-show="showTomlPreview" :toml="toml" />
		</div>
	</div>
</template>

<script setup lang="ts">
import AiDataset from "@/components/AiDataset/index.vue";
import { useSettingsStore } from "@/stores";
import { SplitRightEnum } from "@/enums/split-right.enum";

export interface SplitRightContentProps {
	toml: string;
	/** 目录 */
	dir: string;
}

defineProps<SplitRightContentProps>();

const settingsStore = useSettingsStore();
const aiDatasetRef = ref<InstanceType<typeof AiDataset>>();
const showAIDataset = storeToRefs(settingsStore).showAIDataset;
const showTomlPreview = storeToRefs(settingsStore).showTomlPreview;
// 打开toml预览
const openPreview = ref(settingsStore.splitRightType === SplitRightEnum.TOML_PREVIEW);
function onPreviewChange(val: boolean) {
	const value = val ? SplitRightEnum.TOML_PREVIEW : SplitRightEnum.AI_DATASET;
	settingsStore.setSplitRightType(value);
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
