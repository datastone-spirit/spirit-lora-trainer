<!--
 * @Author: mulingyuer
 * @Date: 2024-09-27 16:40:29
 * @LastEditTime: 2025-08-25 10:12:35
 * @LastEditors: mulingyuer
 * @Description: 按钮item
 * @FilePath: \frontend\src\layout\admin-layout\components\Aside\MenuItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
		<template #title>
			<Icon v-if="menu.icon" :name="menu.icon" size="19" />
			<span class="truncate">{{ menu.title }}</span>
		</template>
		<MenuItem v-for="menuItem in menu.children" :key="menuItem.path" :menu="menuItem" />
	</el-sub-menu>
	<el-menu-item v-else :index="menu.path">
		<Icon v-if="menu.icon" :name="menu.icon" size="19" />
		<el-badge class="menu-item-badge" :hidden="!showNewBadge" value="new" type="success">
			<span class="truncate">{{ menu.title }}</span>
		</el-badge>
		<el-tag v-if="showTaskTag" class="task-tag" type="primary" effect="dark" round> 训练中 </el-tag>
	</el-menu-item>
</template>

<script setup lang="ts">
import { useTrainingStore, useAppStore, useSettingsStore } from "@/stores";

const trainingStore = useTrainingStore();
const appStore = useAppStore();
const settingsStore = useSettingsStore();

const props = defineProps({
	menu: {
		type: Object as PropType<AdminApp.Menu>,
		required: true
	}
});

const showTaskTag = computed(() => {
	if (props.menu.children) return false;
	if (!props.menu.loRATaskType || props.menu.loRATaskType === "none") return false;
	const currentTaskInfo = trainingStore.currentTaskInfo;
	if (currentTaskInfo.type === "none") return false;
	return currentTaskInfo.type === props.menu.loRATaskType;
});

const showNewBadge = computed(() => {
	const showNewBadge = props.menu.showNewBadge;
	if (!showNewBadge) return false;

	const globalShowNewBadge = settingsStore.trainerSettings.showAsideNewBadge;
	if (!globalShowNewBadge) return false;

	const path = props.menu.path;
	const openedPaths = appStore.openedPaths;
	if (openedPaths.includes(path)) return false;

	return true;
});
</script>

<style lang="scss" scoped>
@use "sass:math";

.task-tag {
	margin-left: math.div($zl-padding, 2);
}

.menu-item-badge {
	line-height: normal;
}
</style>
