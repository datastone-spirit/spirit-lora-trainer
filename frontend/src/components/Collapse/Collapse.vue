<!--
 * @Author: mulingyuer
 * @Date: 2024-12-05 15:29:23
 * @LastEditTime: 2024-12-18 16:21:44
 * @LastEditors: mulingyuer
 * @Description: 折叠面板
 * @FilePath: \frontend\src\components\Collapse\Collapse.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="collapse">
		<div class="collapse-header">
			<h2 class="collapse-title">{{ title }}</h2>
			<el-button
				class="collapse-arrow"
				:class="{ closed: !open }"
				:icon="CollapseIcon"
				circle
				text
				size="small"
				@click="onToggleCollapse"
			/>
		</div>
		<div v-show="open" class="collapse-divider-wrapper">
			<el-divider class="collapse-divider" />
		</div>
		<div v-show="open" class="collapse-body">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon";
import type { UseIconProps } from "@/hooks/useIcon";

export interface CollapseProps {
	title: string;
	arrowSize?: UseIconProps["size"];
}

const props = withDefaults(defineProps<CollapseProps>(), {
	arrowSize: 22
});
const open = defineModel({ type: Boolean, required: true });
const CollapseIcon = useIcon({ name: "ri-arrow-down-s-line", size: props.arrowSize });

function onToggleCollapse() {
	open.value = !open.value;
}
</script>

<style lang="scss" scoped>
.collapse {
	margin-bottom: $zl-collapse-margin;
	background-color: var(--zl-collapse-bg);
	border-radius: $zl-border-radius;
}
.collapse-header {
	display: flex;
	align-items: center;
	padding: $zl-padding;
}
.collapse-title {
	font-size: 20px;
	font-weight: bold;
	color: var(--el-text-color-primary);
}
.collapse-arrow {
	flex-shrink: 0;
	margin-left: auto;
}
.collapse-arrow.closed {
	transform: rotate(-180deg);
}
.collapse-divider-wrapper {
	margin: 0 $zl-padding;
}
.collapse-divider {
	margin: 0;
}
.collapse-body {
	padding: calc($zl-padding + $zl-padding / 2) $zl-padding;
}
</style>
