<!--
 * @Author: mulingyuer
 * @Date: 2025-02-07 08:53:05
 * @LastEditTime: 2025-02-10 10:08:15
 * @LastEditors: mulingyuer
 * @Description: 查看采样
 * @FilePath: \frontend\src\components\ViewSampling\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-drawer
		v-model="open"
		class="view-sampling"
		:show-close="false"
		direction="rtl"
		size="522"
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
					<div
						v-for="(item, index) in list"
						:key="index"
						class="view-sampling-list-item"
						@click="onItemClick(item, index)"
					>
						<el-image
							class="view-sampling-list-item-img"
							:src="item.image_path + '?compress=true'"
							fit="cover"
							title="双击查看图片细节"
						>
							<template #placeholder>
								<img
									class="view-sampling-list-item-default-img"
									:src="DefaultImageIcon"
									:alt="item.image_name"
								/>
							</template>
							<template #error>
								<img
									class="view-sampling-list-item-default-img"
									:src="DefaultImageIcon"
									:alt="item.image_name"
								/>
							</template>
						</el-image>
						<div class="view-sampling-list-item-name" :title="item.image_name">
							{{ item.image_name }}
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import DefaultImageIcon from "@/assets/images/ai-dataset/image_icon.svg";
import { useIcon } from "@/hooks/useIcon";
import { useImageViewer } from "@/hooks/useImageViewer";
import { directoryFiles } from "@/api/common";

export interface ViewSamplingProps {
	/** 采样图片存放路径 */
	samplingPath: string;
}
export type List = Array<{ image_name: string; image_path: string }>;

const props = defineProps<ViewSamplingProps>();

const { previewImages } = useImageViewer();

const CloseIcon = useIcon({ name: "ri-close-line", size: 28 });
const RefreshIcon = useIcon({ name: "ri-refresh-line", size: 24 });
const open = defineModel("open", { type: Boolean, required: true });
const loading = ref(false);
const list = ref<List>([]);

/** 关闭抽屉 */
function onClose() {
	open.value = false;
}

/** 点击列表项 */
function onItemClick(_item: List[0], index: number) {
	previewImages({
		urlList: list.value.map((item) => item.image_path),
		initialIndex: index,
		filenameList: list.value.map((item) => item.image_name)
	});
}

/** 拼接图片url */
function joinImageUrl(imagePath: string): string {
	return `${import.meta.env.VITE_APP_API_BASE_URL}/image${imagePath}`;
}

/** 获取采样数据 */
function getSamplingData() {
	if (typeof props.samplingPath !== "string" || props.samplingPath.trim() === "") {
		ElMessage.warning("暂时还未获取到采样路径，请确认是否已开启采样功能");
		return;
	}
	loading.value = true;
	directoryFiles({ path: props.samplingPath })
		.then((res) => {
			list.value = res.map((item) => {
				return {
					image_name: item.image_name,
					image_path: joinImageUrl(item.image_path)
				};
			});
		})
		.catch((err) => {
			ElMessage.error(err.message);
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
	gap: $zl-padding;
	grid-template-columns: repeat(auto-fill, $zl-ai-dataset-file-width);
	grid-auto-rows: $zl-ai-dataset-file-height;
	justify-content: center;
	align-items: start;
}
.view-sampling-list-item {
	width: $zl-ai-dataset-file-width;
	height: $zl-ai-dataset-file-height;
	text-align: center;
	transition:
		background-color 0.3s ease,
		opacity 0.3s ease;
	border-radius: 4px;
	padding: 4px;
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
	width: 50px;
	height: 50px;
	border-radius: 4px;
}
.view-sampling-list-item-default-img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
.view-sampling-list-item-name {
	margin-top: 4px;
	font-size: 12px;
	line-height: 20px;
	color: var(--el-text-color-primary);
	@include text-ellipsis();
}
</style>
