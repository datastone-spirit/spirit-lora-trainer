<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 15:15:44
 * @LastEditTime: 2025-04-01 16:15:51
 * @LastEditors: mulingyuer
 * @Description: 文本文件
 * @FilePath: \frontend\src\components\AiDataset\FileItem\TextFile.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="file-list-item text-file" :class="{ selected: selected }">
		<el-image class="file-list-item-img" :src="TextIcon" fit="contain" :lazy="lazy" />
		<div class="file-list-item-name" :title="data.name">{{ data.name }}</div>
	</div>
</template>

<script setup lang="ts">
import type { ImageProps } from "element-plus";
import type { BaseFileItemProps, FileItem } from "../types";
import TextIcon from "@/assets/images/ai-dataset/text_icon.svg";

export interface TextFileProps extends BaseFileItemProps {
	data: FileItem;
	lazy?: ImageProps["lazy"];
}

withDefaults(defineProps<TextFileProps>(), {
	lazy: false
});
</script>

<style lang="scss" scoped>
@use "../style.scss" as *;
</style>
