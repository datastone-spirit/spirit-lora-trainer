<!--
 * @Author: mulingyuer
 * @Date: 2024-12-26 11:21:01
 * @LastEditTime: 2025-07-24 15:26:14
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
				<component :is="DetailMap[activeItemData.task_type]" :data="getItemData()" />
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
import HYDetail from "./components/HYDetail.vue";
import WanDetail from "./components/WanDetail.vue";
import FluxKontextDetail from "./components/FluxKontextDetail.vue";
import type { TaskType } from "@/api/types";

const loading = ref(true);
const list = ref<TaskListResult>([]);
const activeItemData = ref<TaskListResult[number]>();
const DetailMap: Record<TaskType, any> = {
	captioning: TagTaskDetail,
	training: LoraTaskDetail,
	hunyuan_training: HYDetail,
	wan_training: WanDetail,
	kontext_training: FluxKontextDetail
};
// HACK: QTMD 类型校验
function getItemData() {
	return activeItemData.value as any;
}

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
