<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 17:37:52
 * @LastEditTime: 2024-12-15 03:21:31
 * @LastEditors: mulingyuer
 * @Description: 右键菜单
 * @FilePath: \frontend\src\components\AiDataset\ContextMenu.vue
 * 怎么可能会有bug！！！
-->
<template>
	<transition name="el-zoom-in-top">
		<ul v-show="show" class="context-menu" :style="{ left: `${left}px`, top: `${top}px` }">
			<template v-for="item in menuList" :key="item.key">
				<li v-if="item.show" class="context-menu-item" @click="onMenuClick(item)">
					{{ item.label }}
				</li>
			</template>
		</ul>
	</transition>
</template>

<script setup lang="ts">
import { menuList } from "./context-menu.helper";
import type { ContextMenuItem } from "./context-menu.helper";
import type { FileItem } from "./types";

export interface ContextMenuProps {
	left: number;
	top: number;
	data: FileItem | undefined;
}

const props = defineProps<ContextMenuProps>();
const emits = defineEmits<{
	menuClick: [menu: ContextMenuItem, data: FileItem];
}>();

const show = defineModel("show", { type: Boolean, required: true });

function onMenuClick(item: ContextMenuItem) {
	if (!props.data) {
		ElMessage.warning("快捷菜单没有检测到数据");
		return;
	}
	emits("menuClick", item, props.data);
}

// 点击其他地方隐藏菜单
useEventListener(document, "click", () => {
	if (!show.value) return;
	show.value = false;
});
</script>

<style lang="scss" scoped>
.context-menu {
	position: fixed;
	z-index: 10;
	list-style: none;
	width: 100px;
	box-shadow: 0px 0px 12px 0px var(--zl-context-menu-box-shadow);
	border-radius: 4px;
}
.context-menu-item {
	background-color: var(--zl-context-menu-item-bg);
	line-height: 40px;
	padding: 0 $zl-padding;
	font-size: 12px;
	color: var(--el-text-color-primary);
	transition: background-color 0.3s;
	cursor: pointer;
	@include no-select();
	&:hover {
		background-color: var(--el-menu-hover-bg-color);
	}
	&:active {
		color: var(--el-color-primary);
	}
}
</style>
