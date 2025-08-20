<!--
 * @Author: mulingyuer
 * @Date: 2025-07-02 16:13:35
 * @LastEditTime: 2025-08-20 15:49:23
 * @LastEditors: mulingyuer
 * @Description: 基于element-plus的Splitter 分隔面板
 * @FilePath: \frontend\src\components\Split\TwoSplit2\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-splitter class="two-split" :layout="layout">
		<el-splitter-panel
			class="two-split-left"
			v-model:size="leftSizeValue"
			:min="leftMin"
			:max="leftMax"
			:resizable="leftResizable"
			:collapsible="leftCollapsible"
		>
			<slot name="left"></slot>
		</el-splitter-panel>
		<el-splitter-panel
			class="two-split-right"
			v-model:size="rightSizeValue"
			:min="rightMin"
			:max="rightMax"
			:resizable="rightResizable"
			:collapsible="rightCollapsible"
		>
			<slot name="right"></slot>
		</el-splitter-panel>
	</el-splitter>
</template>

<script setup lang="ts">
import type { SplitterProps, SplitterPanelProps } from "element-plus";
import { CONFIG_KEYS } from "@/constants";

export interface TwoSplit2Props {
	/** 分隔面板的布局方向 */
	layout?: SplitterProps["layout"];
	/** 第一个面板的大小 */
	leftSize?: SplitterPanelProps["size"];
	leftMin?: SplitterPanelProps["min"];
	leftMax?: SplitterPanelProps["max"];
	leftResizable?: SplitterPanelProps["resizable"];
	leftCollapsible?: SplitterPanelProps["collapsible"];
	/** 第二个面板的大小 */
	rightSize?: SplitterPanelProps["size"];
	rightMin?: SplitterPanelProps["min"];
	rightMax?: SplitterPanelProps["max"];
	rightResizable?: SplitterPanelProps["resizable"];
	rightCollapsible?: SplitterPanelProps["collapsible"];
}

const props = withDefaults(defineProps<TwoSplit2Props>(), {
	layout: "horizontal",
	leftSize: "50%",
	leftMin: "550px",
	leftResizable: true,
	leftCollapsible: false,
	rightSize: "50%",
	rightMin: "380px",
	rightResizable: true,
	rightCollapsible: false
});

const leftSizeValue = useLocalStorage(CONFIG_KEYS.TWO_SPLIT2_LEFT_KEY, props.leftSize);
const rightSizeValue = useLocalStorage(CONFIG_KEYS.TWO_SPLIT2_RIGHT_KEY, props.rightSize);
</script>

<style lang="scss" scoped>
.two-split.el-splitter__horizontal {
	:deep(.two-split-left) {
		padding-right: 6px;
	}
	:deep(.two-split-right) {
		padding-left: 6px;
	}
}
.two-split.el-splitter__vertical {
	:deep(.two-split-left) {
		padding-bottom: 6px;
	}
	:deep(.two-split-right) {
		padding-top: 6px;
	}
}
</style>
