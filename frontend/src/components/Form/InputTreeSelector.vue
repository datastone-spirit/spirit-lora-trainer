<!--
 * @Author: mulingyuer
 * @Date: 2024-12-18 17:08:33
 * @LastEditTime: 2024-12-19 09:55:05
 * @LastEditors: mulingyuer
 * @Description: 可输入的树选择器
 * @FilePath: \frontend\src\components\Form\InputTreeSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-popover
		v-model:visible="visible"
		placement="bottom"
		trigger="click"
		width="100%"
		:teleported="false"
		:popper-class="['input-tree-selector-popover']"
	>
		<template #reference>
			<el-input
				v-model="folder"
				:placeholder="inputPlaceholder"
				@input="onInput"
				@keydown.enter="onEnter"
			>
				<template #suffix>
					<el-icon class="input-tree-selector-icon" :class="{ open: visible }" :size="14">
						<ArrowDown />
					</el-icon>
				</template>
			</el-input>
		</template>
		<div class="input-tree-selector-dropdown">
			<el-scrollbar view-class="input-tree-selector-dropdown-list">
				<el-tree
					ref="treeRef"
					:data="treeData"
					:props="treeOptions.props"
					:expand-on-click-node="treeOptions.expandOnClickNode"
					:lazy="treeOptions.lazy"
					:load="onTreeLoad"
					:node-key="treeOptions.nodeKey"
					:highlight-current="treeOptions.highlightCurrent"
					:empty-text="treeEmptyText"
					:current-node-key="treeOptions.defaultExpand"
					@node-click="onNodeClick"
				/>
			</el-scrollbar>
		</div>
	</el-popover>
</template>

<script setup lang="ts">
import type Node from "element-plus/es/components/tree/src/model/node";
import { ArrowDown } from "@element-plus/icons-vue";
import type { ElTree } from "element-plus";
import { getDirectoryStructure } from "@/api/common";
import type { GetDirectoryStructureParams, GetDirectoryStructureResult } from "@/api/common";

export interface InputTreeSelectorProps {
	placeholder?: string;
	/** 是否目录选择 */
	isDir: boolean;
}
type TreeItem = GetDirectoryStructureResult[number];
type GetDirectoryParams = Omit<GetDirectoryStructureParams, "is_dir"> & {
	is_dir?: GetDirectoryStructureParams["is_dir"];
};

const props = withDefaults(defineProps<InputTreeSelectorProps>(), {});
const visible = ref(false);
const treeRef = ref<InstanceType<typeof ElTree>>();
const folder = defineModel({ type: String, required: true });
const treeOptions = ref({
	show: false,
	loading: false,
	props: {
		isLeaf: "isLeaf",
		value: "value",
		children: "children"
	},
	lazy: true,
	nodeKey: "value",
	highlightCurrent: false,
	expandOnClickNode: false,
	defaultExpand: folder.value
});
const treeData = ref<TreeItem[]>([]);
const treeEmptyText = computed(() => {
	if (treeOptions.value.loading) return "加载中...";
	return "暂无数据";
});
const inputPlaceholder = computed(() => {
	if (!props.placeholder) {
		return props.isDir ? "请输入或选择目录" : "请输入或选择文件";
	} else {
		return props.placeholder;
	}
});

/** 获取目录 */
async function getDirectory(params: GetDirectoryParams): Promise<TreeItem[]> {
	try {
		const result = await getDirectoryStructure({
			is_dir: props.isDir,
			...params
		});
		return result;
	} catch (_error) {
		return [];
	}
}

/** 节点懒加载 */
function onTreeLoad(node: Node, resolve: (data: TreeItem[]) => void) {
	if (node.isLeaf) return resolve([]);
	const {
		level,
		data: { value }
	} = node;
	const parent_path = level === 0 ? folder.value?.trim() || "/" : value;
	getDirectory({
		parent_path
	}).then((data) => {
		resolve(data);
	});
}

/** tree节点点击 */
function onNodeClick(data: TreeItem) {
	folder.value = data.value;
	visible.value = false;
}

/** 输入框变化 */
const onInput = useDebounceFn((value: string) => {
	const isRoot = value.trim() === "";
	loadTreeData(isRoot ? "/" : value);
}, 300);

/** 回车 */
function onEnter() {
	const isRoot = folder.value.trim() === "";
	loadTreeData(isRoot ? "/" : folder.value);
}

// 提取公共的树数据加载逻辑
async function loadTreeData(path = "/") {
	treeOptions.value.loading = true;
	treeData.value = [];
	try {
		const data = await getDirectory({
			parent_path: path
		});
		treeData.value = data;
	} finally {
		treeOptions.value.loading = false;
	}
}
</script>

<style lang="scss" scoped>
.input-tree-selector-icon {
	transform: rotateZ(0deg);
	transition: var(--el-transition-duration);
	&.open {
		transform: rotateZ(180deg);
	}
}
.input-tree-selector-dropdown {
	min-width: 240px;
	:deep(.input-tree-selector-dropdown-list) {
		max-height: 274px;
	}
}
</style>
<style lang="scss">
.input-tree-selector-popover {
	padding-left: 0 !important;
	padding-right: 0 !important;
}
</style>
