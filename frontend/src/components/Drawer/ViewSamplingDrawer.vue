<!--
 * @Author: mulingyuer
 * @Date: 2025-04-03 09:18:45
 * @LastEditTime: 2025-04-03 09:32:04
 * @LastEditors: mulingyuer
 * @Description: 查看采样数据抽屉
 * @FilePath: \frontend\src\components\Drawer\ViewSamplingDrawer.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-drawer
		v-model="open"
		class="view-sampling"
		:show-close="false"
		direction="rtl"
		size="572"
		@open="onDrawerOpen"
	>
		<div class="view-sampling-header">
			<el-button
				class="view-sampling-refresh"
				:icon="RefreshIcon"
				circle
				type="info"
				plain
				text
				@click="onRefresh"
			/>
			<el-button
				class="view-sampling-close"
				:icon="CloseIcon"
				circle
				type="danger"
				plain
				text
				@click="onClose"
			/>
		</div>
		<div class="view-sampling-content">
			<el-scrollbar height="100%" v-loading="loading">
				<el-empty v-if="list.length === 0" :image-size="100" />
				<div v-else class="view-sampling-list">
					<component
						v-for="(item, index) in list"
						:key="item.value"
						:is="FileItemMap[item.type]"
						:data="item"
						fit="cover"
						lazy
						@click="onItemClick(item, index)"
					/>
				</div>
			</el-scrollbar>
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import { directoryFiles } from "@/api/common";
import { FileItemMap } from "@/components/FileManager";
import { useIcon } from "@/hooks/useIcon";
import { useImageViewer } from "@/hooks/useImageViewer";
import type { FileItem, FileList } from "@/utils/file-manager";
import { FileManager, FileType } from "@/utils/file-manager";
import { useVideoPreview } from "@/hooks/useVideoPreview";
import { useModalManagerStore } from "@/stores";

const { previewImages } = useImageViewer();
const { previewVideo } = useVideoPreview();
const fileManager = new FileManager();
const modalManagerStore = useModalManagerStore();

const { viewSamplingDrawerModal } = storeToRefs(modalManagerStore);
const CloseIcon = useIcon({ name: "ri-close-line", size: 28 });
const RefreshIcon = useIcon({ name: "ri-refresh-line", size: 24 });
const open = computed({
	get() {
		return viewSamplingDrawerModal.value.open;
	},
	set(val: boolean) {
		viewSamplingDrawerModal.value.open = val;
	}
});
const loading = ref(false);
const list = ref<FileList>([]);
/** 采样路径 */
const samplingPath = computed(() => viewSamplingDrawerModal.value.filePath);

/** 关闭抽屉 */
function onClose() {
	open.value = false;
}

/** 点击列表项 */
function onItemClick(item: FileItem, index: number) {
	if (item.type === FileType.IMAGE) {
		previewImages({
			urlList: list.value.map((item) => `${item.value}?compress=false`),
			initialIndex: index,
			filenameList: list.value.map((item) => item.name)
		});
	} else if (item.type === FileType.VIDEO) {
		previewVideo({
			src: item.value,
			title: item.name
		});
	}
}

/** 获取采样数据 */
function getSamplingData() {
	if (typeof samplingPath.value !== "string" || samplingPath.value.trim() === "") {
		ElMessage.warning("暂时还未获取到采样路径，请确认是否已开启采样功能");
		return;
	}
	loading.value = true;
	directoryFiles({ path: samplingPath.value })
		.then((res) => {
			list.value = fileManager
				.formatDirectoryFiles(res)
				.filter((item) => item.type !== FileType.TEXT);
		})
		.catch((error) => {
			if (error?.response?.status === 401) return;
			ElMessage.error(error.message);
		})
		.finally(() => {
			loading.value = false;
		});
}

/** 抽屉打开 */
function onDrawerOpen() {
	getSamplingData();
}

/** 刷新 */
function onRefresh() {
	getSamplingData();
}
</script>

<style lang="scss">
.view-sampling {
	--view-sampling-gap: 12px;
	--view-sampling-item-width: 100px;
	--view-sampling-item-height: 100px;
	--view-sampling-item-padding: 4px;
	--view-sampling-item-title-height: 20px;
	border-top-left-radius: $zl-border-radius;
	border-bottom-left-radius: $zl-border-radius;
	.el-drawer__header {
		display: none;
	}
	.el-drawer__body {
		padding: $zl-padding;
		overflow: hidden;
	}
}
</style>
<style lang="scss" scoped>
.view-sampling-header {
	margin-bottom: $zl-padding;
	height: 32px;
}
.view-sampling-content {
	height: calc(100% - 32px);
	padding-bottom: $zl-padding;
}
.view-sampling-close {
	position: absolute;
	top: $zl-padding;
	right: $zl-padding;
}
.view-sampling-list {
	display: grid;
	gap: var(--view-sampling-gap);
	grid-template-columns: repeat(auto-fill, var(--view-sampling-item-width));
	grid-auto-rows: var(--view-sampling-item-height);
	justify-content: center;
	align-items: start;
}
.view-sampling-list-item {
	width: var(--view-sampling-item-width);
	height: var(--view-sampling-item-height);
	text-align: center;
	transition:
		background-color 0.3s ease,
		opacity 0.3s ease;
	border-radius: 4px;
	padding: var(--view-sampling-item-padding);
	cursor: pointer;
	@include no-select();
	&.selected {
		background-color: var(--zl-admin-layout-bg);
	}
	&:hover {
		background-color: var(--zl-admin-layout-bg);
	}
	&:active {
		opacity: 0.7;
	}
}
.view-sampling-list-item-img {
	--view-sampling-item-img-size: calc(
		var(--view-sampling-item-height) - var(--view-sampling-item-padding) *
			3 - var(--view-sampling-item-title-height)
	);
	width: var(--view-sampling-item-img-size);
	height: var(--view-sampling-item-img-size);
	border-radius: 4px;
}
.view-sampling-list-item-default-img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
.view-sampling-list-item-name {
	margin-top: var(--view-sampling-item-padding);
	font-size: 12px;
	line-height: var(--view-sampling-item-title-height);
	color: var(--el-text-color-primary);
	@include text-ellipsis();
}
</style>
