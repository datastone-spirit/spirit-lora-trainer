<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 11:39:51
 * @LastEditTime: 2025-10-10 09:20:44
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
				label="切换右侧数据集预览"
				:prop="`datasets.${index}.preview`"
				popover-content="preview"
			>
				<el-switch
					v-model="item.preview"
					inactive-value="folder_path"
					inactive-text="数据集目录"
					active-value="control_path"
					active-text="控制数据集目录"
				/>
			</PopoverFormItem>
			<PopoverFormItem
				label="数据集目录"
				:prop="`datasets.${index}.folder_path`"
				popover-content="folder_path"
				:rules="rules.folder_path"
			>
				<FolderSelector v-model="item.folder_path" placeholder="请选择数据集目录" />
			</PopoverFormItem>
			<PopoverFormItem
				label="控制数据集集目录"
				:prop="`datasets.${index}.control_path`"
				popover-content="control_path"
				:rules="rules.control_path"
			>
				<FolderSelector v-model="item.control_path" placeholder="请选择控制数据集集目录" />
			</PopoverFormItem>
			<PopoverFormItem
				label="LoRA 权重"
				:prop="`datasets.${index}.network_weight`"
				popover-content="network_weight"
			>
				<el-input-number v-model.number="item.network_weight" :step="1" step-strictly />
			</PopoverFormItem>
			<PopoverFormItem
				label=" 标题 Dropout Rate"
				:prop="`datasets.${index}.caption_dropout_rate`"
				popover-content="caption_dropout_rate"
			>
				<el-input-number v-model.number="item.caption_dropout_rate" :step="0.01" :min="0" />
			</PopoverFormItem>
			<PopoverFormItem
				label="是否将图像的潜在表示（latents）缓存到磁盘"
				:prop="`datasets.${index}.cache_latents_to_disk`"
				popover-content="cache_latents_to_disk"
			>
				<el-switch v-model="item.cache_latents_to_disk" />
			</PopoverFormItem>
			<PopoverFormItem
				label="是否正则化"
				:prop="`datasets.${index}.is_reg`"
				popover-content="is_reg"
			>
				<el-switch v-model="item.is_reg" />
			</PopoverFormItem>
			<PopoverFormItem
				label="分辨率"
				:prop="`datasets.${index}.resolution`"
				popover-content="resolution"
				:rules="rules.resolution"
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
import { LoRAValidator, DatasetValidator } from "@/utils/lora/validator";
import type { FormItemRule, TabPaneName } from "element-plus";
import { generateDefaultDataset } from "../../flex-kontext.helper";
import type { RuleForm } from "../../types";

type DynamicKeys = keyof RuleForm["datasets"][number];
type DynamicRules = Partial<Record<DynamicKeys, FormItemRule[]>>;

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const activeTabName = defineModel({ type: String as PropType<TabPaneName>, required: true });

// rules
const rules = reactive<DynamicRules>({
	folder_path: [
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				DatasetValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("数据集目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	],
	control_path: [
		{ required: true, message: "请选择训练用的控制数据集目录", trigger: "change" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (!value || value.trim() === "") {
					callback();
					return;
				}

				DatasetValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("控制数据集目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	],
	resolution: [
		{
			type: "array",
			required: true,
			message: "请选择至少一个分辨率"
		}
	]
});

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
	const { datasets } = ruleForm.value;
	const lastIndex = datasets[datasets.length - 1]?.index ?? -1; // 空数据集时，下标得为0，所以用-1
	const data = generateDefaultDataset(lastIndex + 1);
	ruleForm.value.datasets.push(data);
	activeTabName.value = data.id;
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
		if (nextTab) {
			activeTabName.value = nextTab.id;
		} else {
			activeTabName.value = "";
		}
	}

	ruleForm.value.datasets.splice(findIndex, 1);
}
</script>

<style scoped></style>
