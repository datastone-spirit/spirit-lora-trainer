<!--
 * @Author: mulingyuer
 * @Date: 2025-04-01 16:17:04
 * @LastEditTime: 2025-04-01 16:18:13
 * @LastEditors: mulingyuer
 * @Description: 视频文件
 * @FilePath: \frontend\src\components\AiDataset\FileItem\VideoFile.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="file-list-item video-file">
		<el-image
			class="file-list-item-img"
			:src="data.value + '?compress=true'"
			:fit="fit"
			:lazy="lazy"
			title="双击查看视频"
		>
			<template #placeholder>
				<img class="file-list-item-default-img" :src="DefaultImageIcon" :alt="data.name" />
			</template>
			<template #error>
				<img class="file-list-item-default-img" :src="DefaultImageIcon" :alt="data.name" />
			</template>
		</el-image>
		<div class="file-list-item-name" :title="data.name">{{ data.name }}</div>
	</div>
</template>

<script setup lang="ts">
import type { BaseFileItemProps, FileItem } from "../types";
import type { ImageProps } from "element-plus";
import DefaultImageIcon from "@/assets/images/ai-dataset/image_icon.svg";

export interface ImageFileProps extends BaseFileItemProps {
	data: FileItem;
	fit?: ImageProps["fit"];
	lazy?: ImageProps["lazy"];
}

withDefaults(defineProps<ImageFileProps>(), {
	fit: "cover",
	lazy: true
});
</script>

<style lang="scss" scoped>
@use "../style.scss" as *;
</style>
