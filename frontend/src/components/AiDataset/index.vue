<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:11:39
 * @LastEditTime: 2024-12-16 16:31:30
 * @LastEditors: mulingyuer
 * @Description: ai数据集
 * @FilePath: \frontend\src\components\AiDataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="ai-dataset">
		<div class="ai-dataset-content" v-loading="loading">
			<div class="ai-dataset-content-body">
				<div class="ai-dataset-content-scroll">
					<el-empty v-if="list.length === 0" class="ai-dataset-content-empty" :image-size="100" />
					<div class="file-list" v-else>
						<component
							v-for="(item, index) in list"
							:key="item.id"
							:is="componentMap[item.type]"
							:data="item"
							:selected="activeItemIndex !== null && activeItemIndex === index"
							@contextmenu.prevent="onContextMenu($event, item)"
							@dblclick="onDoubleClick(item, index)"
						/>
					</div>
				</div>
			</div>
			<!-- <div class="ai-dataset-content-footer">
				<DatasetPagination
					v-model:current-page="pageData.currentPage"
					v-model:page-size="pageData.pageSize"
					:total="pageData.total"
					@change="onChange"
				/>
			</div> -->
		</div>
		<div class="ai-dataset-footer">
			<TagEdit ref="tagEditRef" v-model="tagText" :loading="editTagTextLoading" @save="onSave" />
		</div>
		<ContextMenu
			v-model:show="showContextMenu"
			:data="fileData"
			:top="contextMenuTop"
			:left="contextMenuLeft"
			@menu-click="onMenuClick"
		/>
	</div>
</template>

<script setup lang="ts">
// import DatasetPagination from "./DatasetPagination.vue";
import TagEdit from "./TagEdit.vue";
import ContextMenu from "./ContextMenu.vue";
import ImageFile from "./ImageFile.vue";
import TextFile from "./TextFile.vue";
import { FileType } from "./types";
import type { FileList, FileItem } from "./types";
import { ContextMenuKeyEnum, updateMenuList, type ContextMenuItem } from "./context-menu.helper";
import { useImageViewer } from "@/hooks/useImageViewer";

/** 组件map */
const componentMap = {
	[FileType.IMAGE]: ImageFile,
	[FileType.TEXT]: TextFile
};

const { previewImages } = useImageViewer();

const tagEditRef = ref<InstanceType<typeof TagEdit>>();
const list = ref<FileList>([
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
]);
const loading = ref(false);
const activeItemIndex = ref<number | null>(null);

// 请求数据
async function getList() {
	try {
		loading.value = true;
		onQuitEdit();

		await new Promise((resolve) => setTimeout(resolve, 1000));

		loading.value = false;
	} catch (error) {
		loading.value = false;
		console.error("获取数据失败", error);
	}
}

// 分页
// const pageData = ref({
// 	currentPage: 1,
// 	pageSize: 10,
// 	total: 1000
// });
// function onChange(page: number, pageSize: number) {
// 	pageData.value.currentPage = page;
// 	pageData.value.pageSize = pageSize;
// }

// 预览图片
function onPreview(data: FileItem) {
	const imgList = list.value.filter((item) => item.type === FileType.IMAGE);
	let initialIndex = imgList.findIndex((item) => item === data);
	if (initialIndex === -1) initialIndex = 0;
	return previewImages({ urlList: imgList.map((item) => item.value), initialIndex });
}

// 双击
function onDoubleClick(data: FileItem, index: number) {
	activeItemIndex.value = index;
	switch (data.type) {
		case FileType.IMAGE:
			onQuitEdit();
			onPreview(data);
			break;
		case FileType.TEXT:
			onEdit(data);
			break;
	}
}

// 右键菜单
const showContextMenu = ref(false);
const contextMenuTop = ref(0);
const contextMenuLeft = ref(0);
const fileData = ref<FileItem>();
function onContextMenu(event: MouseEvent, data: FileItem) {
	// 更新当前右键菜单数据
	fileData.value = data;
	// 更新右键菜单列表
	updateMenuList(data);
	// 计算菜单位置
	contextMenuTop.value = event.clientY;
	contextMenuLeft.value = event.clientX;
	// 显示右键菜单
	showContextMenu.value = true;
}
function onMenuClick(menu: ContextMenuItem, data: FileItem) {
	switch (menu.key) {
		case ContextMenuKeyEnum.TAG: // 打标
			ElMessage.info("打标");
			break;
		case ContextMenuKeyEnum.EDIT: // 编辑
			onEdit(data);
			break;
		case ContextMenuKeyEnum.DELETE: // 删除
			ElMessage.info("删除");
			break;
	}
}

// 打标
const tagText = ref("");
const editTagTextLoading = ref(false);
function onEdit(data: FileItem) {
	tagText.value = data.value;
	tagEditRef.value?.focus();
	const findIndex = list.value.findIndex((item) => item === data);
	activeItemIndex.value = findIndex !== -1 ? findIndex : null;
}
function onQuitEdit() {
	tagText.value = "";
	tagEditRef.value?.blur();
}
function onSave() {
	if (loading.value) return;
	if (tagText.value.trim() === "") {
		ElMessage.warning("打标内容不能为空");
		return;
	}
	editTagTextLoading.value = true;
	loading.value = true;
	setTimeout(() => {
		editTagTextLoading.value = false;
		loading.value = false;
		ElMessage.success("保存成功");
	}, 1000);
}

// 对外暴露方法
defineExpose({
	/** 获取数据 */
	getList
});
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
	padding: $zl-padding 0 $zl-padding $zl-padding;
}
.ai-dataset-content-scroll {
	height: 100%;
	overflow: auto;
}
.file-list {
	height: 100%;
	display: grid;
	gap: $zl-padding;
	grid-template-columns: repeat(auto-fill, $zl-ai-dataset-file-width);
	grid-auto-rows: $zl-ai-dataset-file-height;
	justify-content: center;
	align-items: start;
}

// .ai-dataset-content-footer {
// 	padding: 0 $zl-padding $zl-padding;
// }
.ai-dataset-footer {
	flex-grow: 1;
	margin-top: $zl-padding;
}
</style>
