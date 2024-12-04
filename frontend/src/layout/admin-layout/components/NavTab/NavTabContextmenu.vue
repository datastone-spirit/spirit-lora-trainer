<!--
 * @Author: mulingyuer
 * @Date: 2024-09-30 16:20:24
 * @LastEditTime: 2024-12-04 17:33:54
 * @LastEditors: mulingyuer
 * @Description: nav tab 右键菜单
 * @FilePath: \frontend\src\layout\admin-layout\components\NavTab\NavTabContextmenu.vue
 * 怎么可能会有bug！！！
-->
<template>
	<transition name="el-zoom-in-top">
		<ul v-show="show" class="nav-tab-contextmenu" :style="{ left: `${left}px`, top: `${top}px` }">
			<template v-for="item in navTabToolsList" :key="item.key">
				<li v-if="!item.disabled" class="nav-tab-contextmenu-item" @click="onclick(item)">
					{{ item.label }}
				</li>
			</template>
		</ul>
	</transition>
</template>

<script setup lang="ts">
import { navTabToolsList, navTabCommand } from "./helper";
import type { NavTabToolsItem } from "./helper";

const props = defineProps({
	left: {
		type: Number,
		required: true
	},
	top: {
		type: Number,
		required: true
	},
	fullPath: {
		type: String,
		required: true
	}
});
const show = defineModel("show", { type: Boolean, required: true });

// 点击其他地方隐藏菜单
useEventListener(document, "click", () => {
	if (!show.value) return;
	show.value = false;
});

/** 点击事件 */
function onclick(item: NavTabToolsItem) {
	navTabCommand(item.key, props.fullPath);
}
</script>

<style lang="scss" scoped>
.nav-tab-contextmenu {
	position: fixed;
	width: 90px;
	padding: 5px;
	background-color: var(--el-bg-color-overlay);
	border-radius: 4px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	z-index: 2;
	list-style: none;
	font-size: 13px;
	font-weight: normal;
	color: var(--el-text-color-primary);
	white-space: nowrap;
}
.nav-tab-contextmenu-item {
	padding: 7px $padding;
	text-align: center;
	cursor: pointer;
	&:hover {
		background-color: var(--el-fill-color-light);
		color: var(--el-color-primary);
	}
}
</style>
