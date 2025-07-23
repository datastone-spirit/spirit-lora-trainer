<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 11:39:51
 * @LastEditTime: 2025-07-23 17:35:15
 * @LastEditors: mulingyuer
 * @Description: 数据集标签页
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\DataSet\Tabs.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-tabs
		class="data-set-tabs"
		v-model="activeTabName"
		type="border-card"
		editable
		@edit="onTabEdit"
	>
		<template #add-icon>
			<Icon name="ri-add-line" size="20" />
		</template>
		<el-tab-pane
			v-for="(item, index) in ruleForm.datasets"
			:key="item.id"
			:label="item.name"
			:name="item.id"
		>
			<PopoverFormItem
				label="数据集目录"
				:prop="`dataset[${index}].folder_path`"
				popover-content="folder_path"
			>
				<FolderSelector v-model="item.folder_path" placeholder="请选择数据集目录" />
			</PopoverFormItem>
			<PopoverFormItem
				label="控制数据集集目录"
				:prop="`dataset[${index}].control_path`"
				popover-content="control_path"
			>
				<FolderSelector v-model="item.control_path" placeholder="请选择控制数据集集目录" />
			</PopoverFormItem>
			<PopoverFormItem
				label="LoRA 权重"
				:prop="`dataset[${index}].network_weight`"
				popover-content="network_weight"
			>
				<el-input-number v-model.number="item.network_weight" :step="1" step-strictly />
			</PopoverFormItem>
			<PopoverFormItem
				label=" 标题 Dropout Rate"
				:prop="`dataset[${index}].caption_dropout_rate`"
				popover-content="caption_dropout_rate"
			>
				<el-input-number v-model.number="item.caption_dropout_rate" :step="0.01" :min="0" />
			</PopoverFormItem>
			<PopoverFormItem
				label="是否将图像的潜在表示（latents）缓存到磁盘"
				:prop="`dataset[${index}].cache_latents_to_disk`"
				popover-content="cache_latents_to_disk"
			>
				<el-switch v-model="item.cache_latents_to_disk" />
			</PopoverFormItem>
			<PopoverFormItem
				label="是否正则化"
				:prop="`dataset[${index}].is_reg`"
				popover-content="is_reg"
			>
				<el-switch v-model="item.is_reg" />
			</PopoverFormItem>
			<PopoverFormItem
				label="分辨率"
				:prop="`dataset[${index}].resolution`"
				popover-content="resolution"
			>
				<el-checkbox-group v-model="item.resolution">
					<el-checkbox label="256" :value="256" />
					<el-checkbox label="512" :value="512" />
					<el-checkbox label="768" :value="768" />
					<el-checkbox label="1024" :value="1024" />
					<el-checkbox label="1280" :value="1280" />
					<el-checkbox label="1536" :value="1536" />
				</el-checkbox-group>
			</PopoverFormItem>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
import type { TabPaneName } from "element-plus";
import type { RuleForm } from "../../types";
import { getEnv } from "@/utils/env";
import { generateUUID } from "@/utils/tools";

const env = getEnv();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const activeTabName = defineModel({ type: String as PropType<TabPaneName>, required: true });

// tab编辑
function onTabEdit(paneName: TabPaneName | undefined, action: "remove" | "add") {
	switch (action) {
		case "remove":
			onRemoveDataSet(paneName as TabPaneName);
			break;
		case "add":
			onAddDataSet();
			break;
	}
}

// 新增数据集
function onAddDataSet() {
	const index = ruleForm.value.datasets.length + 1;
	const id = generateUUID();
	ruleForm.value.datasets.push({
		id: id,
		name: `数据集${index}`,
		folder_path: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		control_path: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		caption_dropout_rate: 0.05,
		shuffle_tokens: false,
		cache_latents_to_disk: false,
		is_reg: false,
		network_weight: 1,
		resolution: [512, 768],
		caption_ext: "txt"
	});
	activeTabName.value = id;
}

// 删除数据集
function onRemoveDataSet(name: TabPaneName) {
	const dataset = ruleForm.value.datasets;
	const findIndex = dataset.findIndex((item) => item.id === name);
	if (findIndex === -1) return;
	const activeItem = dataset[findIndex];
	// 如果删除的是激活的，激活下一个数据集
	if (activeTabName.value === activeItem.id) {
		const nextTab = dataset[findIndex + 1] || dataset[findIndex - 1];
		if (nextTab) activeTabName.value = nextTab.id;
	}

	ruleForm.value.datasets.splice(findIndex, 1);
}
</script>

<style scoped></style>
