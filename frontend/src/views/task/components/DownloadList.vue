<!--
 * @Author: mulingyuer
 * @Date: 2025-08-07 14:57:28
 * @LastEditTime: 2025-08-07 15:47:44
 * @LastEditors: mulingyuer
 * @Description: 下载列表
 * @FilePath: \frontend\src\views\task\components\DownloadList.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="download-list">
		<div class="download-list-title">下载列表</div>
		<div class="download-list-content" v-loading="loading">
			<ul v-if="downloadList.length > 0">
				<li v-for="(item, index) in downloadList" :key="index">
					<Icon class="download-list-icon" name="ri-box-3-line" size="18" />
					<div class="download-list-name">{{ item.name }}</div>
					<div class="download-list-size">{{ item.size }}</div>
					<el-button class="download-list-btn" :icon="RiDownloadLine" round size="small">
						下载
					</el-button>
				</li>
			</ul>
			<el-empty v-else />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon";

// icon
const RiDownloadLine = useIcon({ name: "ri-download-line", size: 14 });

const loading = ref(false);
const downloadList = [
	{
		name: "my_first lora_v2.safetensors",
		size: "500.00MB",
		href: "https://www.baidu.com"
	}
];
</script>

<style lang="scss" scoped>
.download-list {
	border: 1px solid var(--el-border-color-lighter);
}
.download-list-title {
	padding: 15px 20px;
	font-size: 16px;
	font-weight: bold;
}
.download-list-content {
	ul {
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		padding: 20px 15px;
		gap: 10px;
		transition: background-color 0.25s ease;
		&:nth-child(odd) {
			background-color: var(--el-fill-color-lighter);
		}
		&:hover {
			background-color: var(--el-fill-color-light);
		}
	}
}
.download-list-icon {
	color: var(--el-color-primary);
}
.download-list-name {
	flex-grow: 1;
	min-width: 0;
	@include text-ellipsis();
	font-size: 16px;
	color: var(--el-text-color-regular);
	margin-bottom: 2px;
}
.download-list-size {
	font-size: 12px;
	color: var(--el-text-color-placeholder);
}
</style>
