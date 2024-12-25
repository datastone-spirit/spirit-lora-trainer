<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 15:15:16
 * @LastEditTime: 2024-12-16 10:35:46
 * @LastEditors: mulingyuer
 * @Description: 图片文件
 * @FilePath: \frontend\src\components\AiDataset\ImageFile.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="file-list-item image-file" title="双击查看图片细节">
		<el-image class="file-list-item-img" :src="data.value + '?compress=true'" :fit="fit">
			<template #placeholder>
				<img class="file-list-item-default-img" :src="DefaultImageIcon" :alt="data.name" />
			</template>
			<template #error>
				<img class="file-list-item-default-img" :src="DefaultImageIcon" :alt="data.name" />
			</template>
		</el-image>
		<div class="file-list-item-name">{{ data.name }}</div>
	</div>
</template>

<script setup lang="ts">
import type { BaseFileItemProps, FileItem } from "./types";
import type { ImageProps } from "element-plus";
import DefaultImageIcon from "@/assets/images/ai-dataset/image_icon.svg";

export interface ImageFileProps extends BaseFileItemProps {
	data: FileItem;
	fit?: ImageProps["fit"];
}

withDefaults(defineProps<ImageFileProps>(), {
	fit: "cover"
});
</script>

<style lang="scss" scoped>
@use "./style.scss" as *;
</style>
