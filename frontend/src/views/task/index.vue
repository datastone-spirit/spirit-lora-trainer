<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 11:21:01
 * @LastEditTime: 2025-01-09 11:36:54
 * @LastEditors: mulingyuer
 * @Description: 任务列表页
 * @FilePath: \frontend\src\views\task\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="task-page">
		<div class="task-page-left" v-loading="loading">
			<TaskEmpty v-if="list.length <= 0 && !loading" />
			<template v-else>
				<TaskItem
					v-for="item in list"
					:key="item.id"
					:class="{ active: activeItemData?.id === item.id }"
					:data="item"
					@click="onItemClick(item)"
				></TaskItem>
			</template>
		</div>
		<div class="task-page-right">
			<div v-if="!activeItemData" class="task-detail-placeholder">
				-点击左侧任务卡片查看任务详情-
			</div>
			<template v-else>
				<TagTaskDetail v-if="activeItemData.task_type === 'captioning'" :data="activeItemData" />
				<LoraTaskDetail v-else :data="activeItemData" />
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { TaskListResult } from "@/api/task";
import { taskList } from "@/api/task";
import TaskEmpty from "./components/TaskEmpty.vue";
import TaskItem from "./components/TaskItem.vue";
import TagTaskDetail from "./components/TagTaskDetail.vue";
import LoraTaskDetail from "./components/LoraTaskDetail.vue";

const loading = ref(true);
const list = ref<TaskListResult>([]);
const activeItemData = ref<TaskListResult[number]>();

function onItemClick(item: TaskListResult[number]) {
	if (activeItemData.value && activeItemData.value.id === item.id) {
		activeItemData.value = undefined;
		return;
	}
	activeItemData.value = item;
}

/** 获取任务列表 */
function getTaskList() {
	loading.value = true;
	taskList()
		.then((res) => {
			list.value = res.toReversed();
		})
		.finally(() => {
			loading.value = false;
		});
}

onMounted(() => {
	getTaskList();
});
</script>

<style lang="scss" scoped>
.task-page {
	height: calc(100vh - $zl-padding * 2);
	display: flex;
	gap: $zl-padding;
}
.task-page-left,
.task-page-right {
	height: 100%;
	overflow: auto;
	border-radius: $zl-border-radius;
}
.task-page-left {
	flex-shrink: 0;
	width: 580px;
}
.task-page-right {
	flex-grow: 1;
	min-width: 0;
	background-color: var(--zl-page-bg);
	padding: 24px;
}
.task-detail-placeholder {
	padding: 40px 0;
	font-size: 16px;
	color: var(--el-text-color-secondary);
	text-align: center;
}
</style>
