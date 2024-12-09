<!--
 * @Author: mulingyuer
 * @Date: 2024-12-05 15:29:23
 * @LastEditTime: 2024-12-09 08:53:52
 * @LastEditors: mulingyuer
 * @Description: 折叠面板
 * @FilePath: \frontend\src\components\Collapse\Collapse.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="collapse">
		<div class="collapse-header">
			<h2 class="collapse-title">{{ title }}</h2>
			<span class="collapse-arrow" :class="{ closed: !isCollapse }" @click="onToggleCollapse">
				<Icon name="ri-arrow-up-s-line" class="collapse-arrow-icon" :size="arrowSize"></Icon>
			</span>
		</div>
		<el-divider class="collapse-divider" />
		<!-- <el-collapse-transition> -->
		<div v-show="isCollapse" class="collapse-body">
			<slot></slot>
		</div>
		<!-- </el-collapse-transition> -->
	</div>
</template>

<script setup lang="ts">
import type { IconProps } from "@/components/Icon/Icon.vue";

export interface CollapseProps {
	title: string;
	arrowSize?: IconProps["size"];
}

withDefaults(defineProps<CollapseProps>(), {
	arrowSize: 28
});
const isCollapse = defineModel({ type: Boolean, required: true });

function onToggleCollapse() {
	isCollapse.value = !isCollapse.value;
}
</script>

<style lang="scss" scoped>
.collapse {
	margin-bottom: 36px;
}
.collapse-header {
	display: flex;
	align-items: center;
}
.collapse-title {
	font-size: 20px;
	font-weight: bold;
	color: var(--el-text-color-primary);
}
.collapse-arrow {
	flex-shrink: 0;
	margin-left: auto;
	width: 25px;
	height: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--el-text-color-primary);
	transition: all 0.2s;
	border-radius: var(--el-border-radius-base);
	cursor: pointer;
	@include no-select();
	&:hover {
		background-color: var(--el-fill-color-light);
	}
}
.collapse-arrow.closed .collapse-arrow-icon {
	transform: rotate(-180deg);
}
.collapse-arrow-icon {
	transition: transform 0.2s;
}
.collapse-divider {
	margin-top: 16px;
}
</style>
