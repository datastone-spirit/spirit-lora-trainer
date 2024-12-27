<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 09:56:30
 * @LastEditTime: 2024-12-27 09:52:29
 * @LastEditors: mulingyuer
 * @Description: 简化的折叠面板
 * @FilePath: \frontend\src\components\Collapse\SimpleCollapse.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="simple-collapse">
		<div class="simple-collapse-top">
			<div class="simple-collapse-header">
				<h2 class="simple-collapse-title">{{ title }}</h2>
				<el-button
					class="simple-collapse-arrow"
					:class="{ closed: !open }"
					:icon="CollapseIcon"
					circle
					text
					size="small"
					@click="onToggleCollapse"
				/>
			</div>
		</div>
		<div v-show="open" class="simple-collapse-content">
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
.simple-collapse-top {
	margin-bottom: 10px;
	background-color: var(--zl-collapse-bg);
	border-radius: $zl-border-radius;
	overflow: hidden;
}
.simple-collapse-header {
	display: flex;
	align-items: center;
	padding: $zl-padding;
}
.simple-collapse-title {
	font-size: 20px;
	font-weight: bold;
	color: var(--el-text-color-primary);
}
.simple-collapse-arrow {
	flex-shrink: 0;
	margin-left: auto;
}
.simple-collapse-arrow.closed {
	transform: rotate(-180deg);
}
</style>
