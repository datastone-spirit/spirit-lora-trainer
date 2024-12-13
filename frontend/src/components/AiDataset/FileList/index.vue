<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 15:04:27
 * @LastEditTime: 2024-12-13 17:22:37
 * @LastEditors: mulingyuer
 * @Description: 文件列表
 * @FilePath: \frontend\src\components\AiDataset\FileList\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="file-list">
		<div class="file-list-content">
			<component v-for="item in list" :key="item.id" :is="componentMap[item.type]" :data="item" />
			<component v-for="item in list" :key="item.id" :is="componentMap[item.type]" :data="item" />
			<component v-for="item in list" :key="item.id" :is="componentMap[item.type]" :data="item" />
		</div>
	</div>
</template>

<script setup lang="ts">
import ImageFile from "./ImageFile.vue";
import TextFile from "./TextFile.vue";
import type { FileList } from "../types";
import { FileType } from "../types";

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
</script>

<style lang="scss" scoped>
.file-list {
	height: 100%;
	padding: $zl-padding;
}

.file-list-content {
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
	.file-list-content {
		scrollbar-width: thin;
		scrollbar-color: var(--zl-scrollbar) transparent;
	}
}
</style>
