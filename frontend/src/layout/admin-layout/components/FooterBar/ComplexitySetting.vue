<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:08:09
 * @LastEditTime: 2024-12-15 03:54:17
 * @LastEditors: mulingyuer
 * @Description: 难易度设置
 * @FilePath: \frontend\src\layout\admin-layout\components\FooterBar\ComplexitySetting.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="complexity-setting">
		<div class="complexity-setting-content">
			<div
				v-for="item in settingList"
				:key="item.value"
				class="complexity-setting-item"
				:class="{ active: item.value === complexityValue }"
				@click="onToggleComplexity(item)"
			>
				{{ item.label }}
			</div>
			<div
				class="complexity-setting-selection"
				:class="{ open: complexityValue === ComplexityEnum.EXPERT }"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import { ComplexityEnum } from "@/enums/complexity.enum";

export interface SettingItem {
	label: string;
	value: ComplexityEnum;
}
export type SettingList = SettingItem[];

const settingsStore = useSettingsStore();
const complexityValue = ref(settingsStore.complexity);
const settingList = readonly<SettingList>([
	{
		label: "新手",
		value: ComplexityEnum.BEGINNER
	},
	{
		label: "专家",
		value: ComplexityEnum.EXPERT
	}
]);

/** 切换难度设置 */
let timer: number | null = null;
function onToggleComplexity(item: SettingItem) {
	complexityValue.value = item.value;
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
	timer = setTimeout(() => {
		settingsStore.setComplexity(item.value);
	}, 300);
}
</script>

<style lang="scss" scoped>
.complexity-setting {
	--zl-complexity-setting-item-width: 65px;
	@include no-select();
}
.complexity-setting-content {
	background-color: var(--zl-complexity-setting-bg);
	border-radius: 9999px;
	position: relative;
	width: calc(var(--zl-complexity-setting-item-width) * 2);
	display: flex;
	z-index: 1;
}

.complexity-setting-item {
	font-size: 14px;
	color: var(--zl-complexity-setting-color);
	width: var(--zl-complexity-setting-item-width);
	line-height: 36px;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	&:hover {
		color: var(--el-color-primary);
	}
	&.active {
		color: var(--zl-complexity-setting-color-active);
	}
}
.complexity-setting-selection {
	position: absolute;
	top: 0;
	left: 0;
	width: var(--zl-complexity-setting-item-width);
	bottom: 0;
	border-radius: var(--zl-complexity-setting-item-width);
	background-color: var(--el-color-primary);
	z-index: -1;
	transition: left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	&.open {
		left: var(--zl-complexity-setting-item-width);
	}
}
</style>
