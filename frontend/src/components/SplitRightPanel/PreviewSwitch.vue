<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 15:40:38
 * @LastEditTime: 2024-12-12 15:54:15
 * @LastEditors: mulingyuer
 * @Description: 预览切换
 * @FilePath: \frontend\src\components\SplitRightPanel\PreviewSwitch.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="preview-switch">
		<div class="preview-switch-content">
			<div
				v-for="item in settingList"
				:key="item.value"
				class="preview-switch-item"
				:class="{ active: item.value === splitRightType }"
				@click="onToggleComplexity(item)"
			>
				{{ item.label }}
			</div>
			<div
				class="preview-switch-selection"
				:class="{ open: splitRightType === SplitRightEnum.TOML_PREVIEW }"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import { SplitRightEnum } from "@/enums/split-right.enum";

export interface SettingItem {
	label: string;
	value: SplitRightEnum;
}
export type SettingList = SettingItem[];

const settingsStore = useSettingsStore();
const splitRightType = ref(settingsStore.splitRightType);
const settingList = readonly<SettingList>([
	{
		label: "AI数据集",
		value: SplitRightEnum.AI_DATASET
	},
	{
		label: "TOML",
		value: SplitRightEnum.TOML_PREVIEW
	}
]);

/** 切换预览 */
function onToggleComplexity(item: SettingItem) {
	splitRightType.value = item.value;
	settingsStore.setSplitRightType(item.value);
}
</script>

<style lang="scss" scoped>
.preview-switch {
	--zl-preview-switch-item-width: 80px;
}
.preview-switch-content {
	background-color: var(--zl-preview-switch-bg);
	border-radius: 9999px;
	position: relative;
	display: flex;
	width: calc(var(--zl-preview-switch-item-width) * 2);
	z-index: 1;
}

.preview-switch-item {
	font-size: 14px;
	color: var(--zl-preview-switch-color);
	width: var(--zl-preview-switch-item-width);
	line-height: 36px;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	&:hover {
		color: var(--el-color-primary);
	}
	&.active {
		color: var(--zl-preview-switch-color-active);
	}
}
.preview-switch-selection {
	position: absolute;
	top: 0;
	left: 0;
	width: var(--zl-preview-switch-item-width);
	bottom: 0;
	border-radius: var(--zl-preview-switch-item-width);
	background-color: var(--el-color-primary);
	z-index: -1;
	transition: left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	&.open {
		left: var(--zl-preview-switch-item-width);
	}
}
</style>
