<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 08:55:24
 * @LastEditTime: 2024-12-09 16:39:30
 * @LastEditors: mulingyuer
 * @Description: 文件选择器
 * @FilePath: \frontend\src\components\Form\FileSelector.vue
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
		:multiple="multiple"
	/>
</template>

<script setup lang="ts">
import type Node from "element-plus/es/components/tree/src/model/node";

export interface FolderSelectorProps {
	placeholder?: string;
	/** 是否多选 */
	multiple?: boolean;
}
interface Tree {
	/** 节点名称 */
	label: string;
	/** 节点路径 */
	value: string;
	/** 是否是叶子节点 */
	isLeaf?: boolean;
}

withDefaults(defineProps<FolderSelectorProps>(), {
	multiple: false
});

const value = defineModel({ type: [String, Array] as PropType<string | string[]>, required: true });
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
