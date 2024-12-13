<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:11:39
 * @LastEditTime: 2024-12-13 16:00:58
 * @LastEditors: mulingyuer
 * @Description: ai数据集
 * @FilePath: \frontend\src\components\AiDataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="ai-dataset">
		<div class="ai-dataset-content">
			<div class="ai-dataset-content-body">
				<FileList />
			</div>
			<div class="ai-dataset-content-footer">
				<DatasetPagination
					v-model:current-page="pageData.currentPage"
					v-model:page-size="pageData.pageSize"
					:total="pageData.total"
					@change="onChange"
				/>
			</div>
		</div>
		<div class="ai-dataset-footer">
			<TagEdit v-model="tagText" />
		</div>
	</div>
</template>

<script setup lang="ts">
import DatasetPagination from "./DatasetPagination.vue";
import TagEdit from "./TagEdit.vue";
import FileList from "./FileList/index.vue";

const pageData = ref({
	currentPage: 1,
	pageSize: 10,
	total: 1000
});

function onChange(page: number, pageSize: number) {
	pageData.value.currentPage = page;
	pageData.value.pageSize = pageSize;
}

// 打标
const tagText = ref("");
</script>

<style lang="scss" scoped>
.ai-dataset {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.ai-dataset-content,
.ai-dataset-footer {
	min-height: 0;
}
.ai-dataset-content {
	flex-grow: 4;
	min-height: 300px;
	display: flex;
	flex-direction: column;
	background-color: var(--zl-ai-dataset-bg);
	border-radius: $zl-border-radius;
}
.ai-dataset-content-body {
	flex-grow: 1;
	min-height: 0;
	height: 1px;
}
.ai-dataset-content-footer {
	padding: 0 $zl-padding $zl-padding;
}
.ai-dataset-footer {
	flex-grow: 1;
	margin-top: $zl-padding;
}
</style>
