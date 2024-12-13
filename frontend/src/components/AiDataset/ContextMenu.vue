<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 17:37:52
 * @LastEditTime: 2024-12-13 18:18:01
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
	menuClick: [item: ContextMenuItem, data: FileItem];
}>();

const show = defineModel("show", { type: Boolean, required: true });

function onMenuClick(item: ContextMenuItem) {
	if (!props.data) {
		ElMessage.warning("快捷菜单没有检测到数据");
		return;
	}
	emits("menuClick", item, props.data);
}
</script>

<style lang="scss" scoped>
.context-menu {
	position: fixed;
	background-color: var(--el-bg-color);
	z-index: 10;
}
</style>
