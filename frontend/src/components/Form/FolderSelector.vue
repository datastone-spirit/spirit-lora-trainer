<!--
 * @Author: mulingyuer
 * @Date: 2024-12-05 16:54:42
 * @LastEditTime: 2024-12-06 09:22:27
 * @LastEditors: mulingyuer
 * @Description: 目录选择器
 * @FilePath: \frontend\src\components\Form\FolderSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-tree-select
		v-model="value"
		:placeholder="placeholder"
		lazy
		:load="load"
		:props="props"
		:expand-on-click-node="false"
		check-strictly
	/>
</template>

<script setup lang="ts">
import type Node from "element-plus/es/components/tree/src/model/node";

export interface FolderSelectorProps {
	placeholder?: string;
}
interface Tree {
	/** 节点名称 */
	label: string;
	/** 节点路径 */
	value: string;
	/** 是否是叶子节点 */
	isLeaf?: boolean;
}

withDefaults(defineProps<FolderSelectorProps>(), {});
const value = defineModel({ type: String, required: true });
const props = {
	isLeaf: "isLeaf",
	value: "value"
};

function load(node: Node, resolve: (data: Tree[]) => void) {
	if (node.isLeaf) return resolve([]);
	setTimeout(() => {
		resolve([
			{
				label: "leaf",
				isLeaf: true,
				value: "/leaf"
			},
			{
				label: "zone",
				value: "/zone"
			}
		]);
	}, 400);
}
</script>

<style scoped></style>
