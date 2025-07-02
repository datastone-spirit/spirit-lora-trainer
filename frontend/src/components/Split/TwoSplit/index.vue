<!--
 * @Author: mulingyuer
 * @Date: 2024-12-05 10:13:40
 * @LastEditTime: 2025-07-02 17:43:29
 * @LastEditors: mulingyuer
 * @Description: 2分割组件，该组件已被弃用，请使用 `TwoSplit2` 替代。
 * @FilePath: \frontend\src\components\Split\TwoSplit\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="two-split" :class="[direction]">
		<div ref="splitLeft" class="two-split-left">
			<div class="two-split-card">
				<slot name="left"></slot>
			</div>
		</div>
		<div ref="splitRight" class="two-split-right">
			<div class="two-split-card">
				<slot name="right"></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Split from "split.js";

export interface TwoSplitProps {
	/** 分割方向 */
	direction?: Split.Options["direction"];
	/** 初始分割大小 */
	sizes?: Split.Options["sizes"];
	/** 将初始大小增长到 minSize */
	expandToMin?: Split.Options["expandToMin"];
	/** 每个元素的最小大小 */
	minSize?: Split.Options["minSize"];
	/** 每个元素的最大大小 */
	maxSize?: Split.Options["maxSize"];
	/** 分割线宽度 */
	gutterSize?: Split.Options["gutterSize"];
	/** 元素间的间距对齐 */
	gutterAlign?: Split.Options["gutterAlign"];
	/** 拉伸到最小尺寸偏移像素 */
	snapOffset?: Split.Options["snapOffset"];
	/** 拖动像素数 */
	dragInterval?: Split.Options["dragInterval"];
	/** 拖动时显示的光标 */
	cursor?: Split.Options["cursor"];
}

const props = withDefaults(defineProps<TwoSplitProps>(), {
	direction: "horizontal",
	gutterSize: 12
});

const splitLeft = ref<HTMLDivElement>();
const splitRight = ref<HTMLDivElement>();
let splitInstance: Split.Instance | null = null;

function initSplit() {
	if (!splitLeft.value || !splitRight.value) {
		console.warn("没有找到对应的split dom节点");
		return;
	}
	if (splitInstance) destroySplit();

	splitInstance = Split([splitLeft.value, splitRight.value], {
		direction: props.direction,
		sizes: props.sizes,
		minSize: props.minSize,
		maxSize: props.maxSize,
		gutterSize: props.gutterSize,
		gutterAlign: props.gutterAlign,
		snapOffset: props.snapOffset,
		dragInterval: props.dragInterval,
		cursor: props.cursor
	});
}

function destroySplit() {
	splitInstance?.destroy();
	splitInstance = null;
}

onMounted(() => {
	initSplit();

	console.warn("TwoSplit 组件已弃用，请使用 TwoSplit2 组件代替");
});

// NOTE: 销毁太快了会导致样式被去除，从而宽度丢失，整体布局错位，所以延迟销毁
onUnmounted(() => {
	setTimeout(() => {
		destroySplit();
	}, 2000);
});

watch([() => props.direction, () => props.sizes], () => {
	initSplit();
	// watch更新前先销毁split实例，防止重复创建
	onWatcherCleanup(() => destroySplit());
});
</script>

<style lang="scss" scoped>
.two-split {
	display: flex;
	height: 100%;
}
.two-split.horizontal {
	.two-split-left,
	.two-split-right {
		height: 100%;
	}
}
.two-split-left {
	.two-split-card {
		padding-right: 6px;
	}
}
.two-split-right {
	margin-left: 6px;
}
.two-split-card {
	height: 100%;
	overflow: auto;
}
.two-split :deep(.gutter) {
	background-color: var(--zl-two-split-gutter-bg);
	background-repeat: no-repeat;
	background-position: 50%;
	transition: background-color 0.2s;
	border-radius: $zl-border-radius;
	&:hover {
		background-color: var(--zl-two-split-gutter-bg-hover);
	}
}
.two-split :deep(.gutter.gutter-horizontal) {
	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
	cursor: col-resize;
}
.two-split :deep(.gutter.gutter-vertical) {
	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
	cursor: col-resize;
}
</style>
