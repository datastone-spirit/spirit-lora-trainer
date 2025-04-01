<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 15:15:16
 * @LastEditTime: 2025-02-17 16:01:55
 * @LastEditors: mulingyuer
 * @Description: 图片文件
 * @FilePath: \frontend\src\components\AiDataset\ImageFile.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="file-list-item image-file">
		<el-image
			class="file-list-item-img"
			:src="data.value + '?compress=true'"
			:fit="fit"
			:lazy="lazy"
			title="双击查看图片细节"
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
