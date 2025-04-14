<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 15:15:44
 * @LastEditTime: 2025-04-02 11:46:15
 * @LastEditors: mulingyuer
 * @Description: 文本文件
 * @FilePath: \frontend\src\components\FileManager\FileItem\TextFile.vue
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
import type { BaseFileItemProps } from "../types";
import type { FileItem } from "@/utils/file-manager";
import TextIcon from "@/assets/images/ai-dataset/text_icon.svg";

export interface TextFileProps extends BaseFileItemProps {
	data: FileItem;
	lazy?: ImageProps["lazy"];
}

withDefaults(defineProps<TextFileProps>(), {
	lazy: false,
	selected: false
});
</script>

<style lang="scss" scoped>
@use "../style.scss" as *;
</style>
