<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:11:39
 * @LastEditTime: 2025-02-19 10:45:13
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
							:key="item.value"
							:is="componentMap[item.type]"
							:data="item"
							:selected="activeItemIndex !== null && activeItemIndex === index"
							@contextmenu.prevent="onContextMenu($event, item)"
							@dblclick="onDoubleClick(item, index)"
							@click="onItemClick(item, index)"
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
			<Transition name="fade">
				<div v-show="uploadFileList.length > 0" class="upload-wrapper">
					<div class="upload-content">
						<div v-if="!uploadSubmitLoading" class="upload-confirm">
							<div class="upload-confirm-count">
								当前已上传 <strong>{{ uploadFileList.length }}</strong> 个文件
							</div>
							<el-space fill :fill-ratio="30">
								<el-button @click="onCancelUpload">取消上传</el-button>
								<el-button class="upload-confirm-btn" type="primary" @click="onConfirmUpload">
									确定上传
								</el-button>
							</el-space>
						</div>
						<div v-else class="upload-load">
							<el-progress
								class="upload-content-progress"
								type="circle"
								:percentage="uploadPercentage"
								:width="80"
								color="var(--el-color-primary)"
							/>
							<div class="upload-content-text">正在上传</div>
						</div>
					</div>
				</div>
			</Transition>
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
		<Teleport :to="btnTeleportTo" defer>
			<el-space v-show="showTeleportBtn">
				<el-button :loading="refreshing" @click="onRefresh"> 刷新 </el-button>
				<el-upload
					ref="uploadRef"
					v-model:file-list="uploadFileList"
					accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,text/plain"
					multiple
					:show-file-list="false"
					:auto-upload="false"
				>
					<el-button type="primary">上传文件</el-button>
				</el-upload>
			</el-space>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
// import DatasetPagination from "./DatasetPagination.vue";
import { directoryFiles, uploadFiles } from "@/api/common";
import { deleteFile, manualTag } from "@/api/tag";
import { useImageViewer } from "@/hooks/useImageViewer";
import { useTag } from "@/hooks/useTag";
import { checkDirectory } from "@/utils/lora.helper";
import { generateUUID, sleep } from "@/utils/tools";
import type { AxiosProgressEvent } from "axios";
import type { UploadInstance, UploadUserFile } from "element-plus";
import { formatDirectoryFiles } from "./ai-dataset.helper";
import { ContextMenuKeyEnum, updateMenuList, type ContextMenuItem } from "./context-menu.helper";
import ContextMenu from "./ContextMenu.vue";
import ImageFile from "./ImageFile.vue";
import TagEdit from "./TagEdit.vue";
import TextFile from "./TextFile.vue";
import type { FileItem, FileList } from "./types";
import { FileType } from "./types";

export interface AiDatasetProps {
	/** 按钮传送的容器id */
	btnTeleportTo: string;
	/** 是否显示Teleport按钮 */
	showTeleportBtn?: boolean;
	/** 目录路径 */
	dir: string;
}

/** 组件map */
const componentMap = {
	[FileType.IMAGE]: ImageFile,
	[FileType.TEXT]: TextFile
};

const props = withDefaults(defineProps<AiDatasetProps>(), {
	showTeleportBtn: true
});
const { previewImages } = useImageViewer();
const { tagEvents } = useTag();

const tagEditRef = ref<InstanceType<typeof TagEdit>>();
const list = ref<FileList>([]);
const loading = ref(false);
const activeItemIndex = ref<number | null>(null);

// 请求数据
async function getList() {
	try {
		if (typeof props.dir !== "string" || props.dir.trim() === "") return;
		loading.value = true;
		onQuitEdit();

		// api
		const fileList = await directoryFiles({ path: props.dir });
		list.value = formatDirectoryFiles(fileList);

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
	return previewImages({
		urlList: imgList.map((item) => `${item.value}?compress=false`),
		initialIndex,
		filenameList: imgList.map((item) => item.name)
	});
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

// 单击
function onItemClick(data: FileItem, index: number) {
	activeItemIndex.value = index;
	switch (data.type) {
		case FileType.IMAGE:
			onQuitEdit();
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
		case ContextMenuKeyEnum.EDIT: // 编辑
			onEdit(data);
			break;
		case ContextMenuKeyEnum.DELETE: // 删除
			onDeleteFile(data);
			break;
	}
}

// 打标
const tagText = ref("");
const editData = ref<FileItem | null>(null);
const editTagTextLoading = ref(false);
function onEdit(data: FileItem) {
	editData.value = data;
	// 如果是图片需要判断是否存在text文件
	if (data.type === FileType.IMAGE) {
		tagText.value = data.hasTagText ? data.raw.txt_content : "";
	} else {
		tagText.value = data.value;
	}
	tagEditRef.value?.focus();
	const findIndex = list.value.findIndex((item) => item === data);
	activeItemIndex.value = findIndex !== -1 ? findIndex : null;
}
function onQuitEdit() {
	tagText.value = "";
	tagEditRef.value?.blur();
	editData.value = null;
}
async function onSave() {
	try {
		if (loading.value) return;
		if (!editData.value) {
			ElMessage.warning("请选择要打标的文件");
			return;
		}
		if (tagText.value.trim() === "") {
			ElMessage.warning("打标内容不能为空");
			return;
		}
		loading.value = true;
		editTagTextLoading.value = true;
		const editTextName = editData.value.name;
		// api
		await manualTag({
			image_path: editData.value.raw.image_path,
			caption_text: tagText.value
		});
		editTagTextLoading.value = false;
		loading.value = false;
		editData.value = null;
		// 更新
		getList();

		ElMessage.success(`${editTextName} 打标保存成功`);
	} catch (error) {
		loading.value = false;
		editTagTextLoading.value = false;
		console.log("打标失败", error);
	}
}

// 删除文件
function onDeleteFile(data: FileItem) {
	deleteFile({ file_path: data.path }).then(() => {
		getList();
		ElMessage.success("删除成功");
	});
}

// 刷新
const refreshing = ref(false);
async function onRefresh() {
	refreshing.value = true;
	getList().finally(() => {
		refreshing.value = false;
	});
}

// 查询进度
const uploadPercentage = ref(0);
function onUploadProgress(progressEvent: AxiosProgressEvent) {
	if (!progressEvent) return;
	const value = progressEvent.progress ?? 0;
	uploadPercentage.value = Math.floor(value * 100);
}

// 上传文件
const uploadRef = ref<UploadInstance>();
const uploadFileList = ref<UploadUserFile[]>([]);
const uploadSubmitLoading = ref(false);
const uploadId = ref<string>();
function onCancelUpload() {
	uploadFileList.value = [];
}
async function onConfirmUpload() {
	try {
		// 检测目录是否存在
		if (typeof props.dir === "string" && props.dir.trim() === "") {
			ElMessage.error("请先选择目录");
			return;
		}
		const exists = await checkDirectory(props.dir);
		if (!exists) {
			ElMessage.error("目录不存在");
			return;
		}
		uploadSubmitLoading.value = true;
		uploadId.value = generateUUID();
		// 生成formdata
		const formData = new FormData();
		uploadFileList.value.forEach((file) => {
			formData.append("files", file.raw!, file.name);
		});
		// 上传
		const _result = await uploadFiles(
			{
				upload_path: props.dir,
				upload_id: uploadId.value
			},
			formData,
			onUploadProgress
		);
		await sleep(500);
		// 上传成功
		// list.value.push(...result);
		onConfirmUploadSuccess();
	} catch (error) {
		uploadSubmitLoading.value = false;
		console.error("上传文件失败", error);
	}
}
function onConfirmUploadSuccess() {
	uploadFileList.value = [];
	uploadId.value = "";
	uploadSubmitLoading.value = false;
	uploadPercentage.value = 0;
	getList();
	ElMessage.success("上传成功");
}

/** 监听目录变化并获取数据 */
const watchDirCallback = useDebounceFn(getList, 500);
watch(
	() => props.dir,
	() => {
		watchDirCallback();
	}
);

getList();
tagEvents.on("complete", getList);
onUnmounted(() => {
	tagEvents.off("complete", getList);
});

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
	position: relative;
	overflow: hidden;
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

// 上传
.upload-wrapper {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	background-color: var(--zl-ai-dataset-upload-mask);
}
.upload-content {
	margin: auto;
	min-width: 150px;
	height: 150px;
	background-color: var(--zl-ai-dataset-upload-bg);
	padding: 16px;
	border-radius: $zl-border-radius;
}
.upload-confirm {
	width: 250px;
	height: 100%;
	display: flex;
	flex-direction: column;
	text-align: center;
}
.upload-confirm-count {
	margin-top: auto;
	margin-bottom: 20px;
	font-size: 14px;
	color: var(--el-text-color-primary);
	strong {
		color: var(--el-color-primary);
	}
}
.upload-load {
	height: 100%;
	text-align: center;
}
.upload-content-progress {
	:deep(.el-progress__text) {
		font-size: 18px !important;
	}
}
.upload-content-text {
	margin-top: 8px;
	font-size: 14px;
	color: var(--el-text-color-primary);
}
</style>
