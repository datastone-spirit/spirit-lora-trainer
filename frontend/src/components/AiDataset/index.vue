<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:11:39
 * @LastEditTime: 2024-12-13 18:00:58
 * @LastEditors: mulingyuer
 * @Description: ai数据集
 * @FilePath: \frontend\src\components\AiDataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="ai-dataset">
		<div class="ai-dataset-content">
			<div class="ai-dataset-content-body">
				<div class="file-list">
					<component
						v-for="item in list"
						:key="item.id"
						:is="componentMap[item.type]"
						:data="item"
					/>
				</div>
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
		<ContextMenu
			v-model:show="showContextMenu"
			:data="fileData"
			:top="contextMenuTop"
			:left="contextMenuLeft"
		/>
	</div>
</template>

<script setup lang="ts">
import DatasetPagination from "./DatasetPagination.vue";
import TagEdit from "./TagEdit.vue";
import ContextMenu from "./ContextMenu.vue";
import ImageFile from "./ImageFile.vue";
import TextFile from "./TextFile.vue";
import { FileType } from "./types";
import type { FileList, FileItem } from "./types";

/** 组件map */
const componentMap = {
	[FileType.IMAGE]: ImageFile,
	[FileType.TEXT]: TextFile
};

const list: FileList = [
	{
		id: useId(),
		name: "图片1.jpg",
		type: FileType.IMAGE,
		value: "https://th.wallhaven.cc/lg/vq/vq898p.jpg"
	},
	{
		id: useId(),
		name: "图片1.jpg.txt",
		type: FileType.TEXT,
		value: "asdas,21312,dsada,f1,3ee,sadas"
	},
	{
		id: useId(),
		name: "图片2.jpg",
		type: FileType.IMAGE,
		value: "https://th.wallhaven.cc/lg/9d/9dqojx.jpg"
	},
	{
		id: useId(),
		name: "图片2.jpg.txt",
		type: FileType.TEXT,
		value: "asdas,21312,dsada,f1,3ee,sadas"
	},
	{
		id: useId(),
		name: "图片3.jpg",
		type: FileType.IMAGE,
		value: "https://th.wallhaven.cc/lg/zy/zywwky.jpg"
	},
	{
		id: useId(),
		name: "图片3.jpg.txt",
		type: FileType.TEXT,
		value: "asdas,21312,dsada,f1,3ee,sadas"
	},
	{
		id: useId(),
		name: "图片4.jpg",
		type: FileType.IMAGE,
		value: "https://th.wallhaven.cc/small/zy/zywe5j.jpg"
	},
	{
		id: useId(),
		name: "图片4.jpg.txt",
		type: FileType.TEXT,
		value: "asdas,21312,dsada,f1,3ee,sadas"
	},
	{
		id: useId(),
		name: "图片5.jpg",
		type: FileType.IMAGE,
		value: "https://th.wallhaven.cc/small/yx/yxdrex.jpg"
	},
	{
		id: useId(),
		name: "图片5.jpg.txt",
		type: FileType.TEXT,
		value: "asdas,21312,dsada,f1,3ee,sadas"
	},
	{
		id: useId(),
		name: "图片6.jpg",
		type: FileType.IMAGE,
		value: "https://th.wallhaven.cc/small/yx/yxdvjx.jpg"
	},
	{
		id: useId(),
		name: "图片6.jpg.txt",
		type: FileType.TEXT,
		value: "asdas,21312,dsada,f1,3ee,sadas"
	}
];

const pageData = ref({
	currentPage: 1,
	pageSize: 10,
	total: 1000
});

function onChange(page: number, pageSize: number) {
	pageData.value.currentPage = page;
	pageData.value.pageSize = pageSize;
}

// 右键菜单
const showContextMenu = ref(true);
const contextMenuTop = ref(0);
const contextMenuLeft = ref(0);
const fileData = ref<FileItem>();

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
	padding: $zl-padding;
}
.file-list {
	height: 100%;
	display: grid;
	gap: $zl-padding;
	grid-template-columns: repeat(auto-fill, $zl-ai-dataset-file-width);
	grid-auto-rows: $zl-ai-dataset-file-height;
	justify-content: center;
	align-items: start;
	overflow: auto;
	&::-webkit-scrollbar {
		width: $zl-scrollbar-width;
	}
	&::-webkit-scrollbar-thumb {
		background: var(--zl-scrollbar);
	}
}
/* 针对不支持::-webkit-scrollbar-*的浏览器的样式调整 */
@supports not (selector(::-webkit-scrollbar)) {
	.file-list {
		scrollbar-width: thin;
		scrollbar-color: var(--zl-scrollbar) transparent;
	}
}
.ai-dataset-content-footer {
	padding: 0 $zl-padding $zl-padding;
}
.ai-dataset-footer {
	flex-grow: 1;
	margin-top: $zl-padding;
}
</style>
