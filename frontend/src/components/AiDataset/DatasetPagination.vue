<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 10:39:52
 * @LastEditTime: 2024-12-13 11:17:00
 * @LastEditors: mulingyuer
 * @Description: 数据集分页
 * @FilePath: \frontend\src\components\AiDataset\DatasetPagination.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="dataset-pagination-wrapper">
		<el-pagination
			:background="background"
			:layout="layout"
			:pager-count="pagerCount"
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:total="1000"
			@change="onChange"
		/>
	</div>
</template>

<script setup lang="ts">
import type { PaginationProps } from "element-plus";

export interface DatasetPaginationProps {
	background?: PaginationProps["background"];
	layout?: PaginationProps["layout"];
	total: PaginationProps["total"];
	pagerCount?: PaginationProps["pagerCount"];
}

withDefaults(defineProps<DatasetPaginationProps>(), {
	background: true,
	layout: "total,prev, pager, next",
	pageSize: 10,
	pagerCount: 5
});

const emits = defineEmits<{
	change: [page: number, pageSize: number];
}>();

const currentPage = defineModel("currentPage", { type: Number, required: true });
const pageSize = defineModel("pageSize", { type: Number, required: true });

function onChange(page: number, pageSize: number) {
	emits("change", page, pageSize);
}
</script>

<style lang="scss" scoped>
.dataset-pagination-wrapper {
	display: flex;
	justify-content: center;
}
</style>
