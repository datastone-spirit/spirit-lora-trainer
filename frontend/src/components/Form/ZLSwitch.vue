<!--
 * @Author: mulingyuer
 * @Date: 2024-12-27 10:42:56
 * @LastEditTime: 2024-12-27 11:24:21
 * @LastEditors: mulingyuer
 * @Description: ZL开关
 * @FilePath: \frontend\src\components\Form\ZLSwitch.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="zl-switch">
		<div class="zl-switch-content" @click="onSwitchClick">
			<div class="zl-switch-item" :class="{ active: !open }">{{ offText }}</div>
			<div class="zl-switch-item" :class="{ active: open }">{{ onText }}</div>
			<div class="zl-switch-selection" :class="{ open: open }"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
export interface ZLSwitchProps {
	/** 按钮宽度 */
	itemWidth?: number | string;
	/** off的文字 */
	offText: string;
	/** on的文字 */
	onText: string;
}

const props = withDefaults(defineProps<ZLSwitchProps>(), {
	itemWidth: 65
});
const emits = defineEmits<{
	change: [value: boolean];
}>();
const open = defineModel({ type: Boolean, required: true });
const calcItemWidth = computed(() => {
	if (typeof props.itemWidth === "string") {
		return props.itemWidth;
	} else {
		return `${props.itemWidth}px`;
	}
});

function onSwitchClick() {
	const value = !open.value;
	open.value = value;
	emits("change", value);
}
</script>

<style lang="scss" scoped>
.zl-switch {
	--zl-switch-item-width: v-bind(calcItemWidth);
	@include no-select();
}
.zl-switch-content {
	background-color: var(--zl-switch-bg);
	border-radius: 9999px;
	position: relative;
	width: calc(var(--zl-switch-item-width) * 2);
	display: flex;
	z-index: 1;
}
.zl-switch-item {
	font-size: 14px;
	color: var(--zl-switch-color);
	width: var(--zl-switch-item-width);
	line-height: 36px;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	&:hover {
		color: var(--el-color-primary);
	}
	&.active {
		color: var(--zl-switch-color-active);
	}
}
.zl-switch-selection {
	position: absolute;
	top: 0;
	left: 0;
	width: var(--zl-switch-item-width);
	bottom: 0;
	border-radius: var(--zl-switch-item-width);
	background-color: var(--el-color-primary);
	z-index: -1;
	transition: left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	&.open {
		left: var(--zl-switch-item-width);
	}
}
</style>
