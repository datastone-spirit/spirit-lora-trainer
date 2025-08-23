<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 09:27:58
 * @LastEditTime: 2025-08-13 09:55:17
 * @LastEditors: mulingyuer
 * @Description: 数据集标签页
 * @FilePath: \frontend\src\views\lora\qwen-image\components\DataSet\Tabs.vue
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
			v-for="(item, index) in ruleForm.dataset.datasets"
			:key="item.id"
			:label="item.name"
			:name="item.id"
		>
			<PopoverFormItem
				label="数据集目录"
				:prop="`dataset.datasets[${index}].image_directory`"
				popover-content="image_directory"
				:rules="rules.image_directory"
			>
				<FolderSelector v-model="item.image_directory" placeholder="请选择数据集目录" />
			</PopoverFormItem>
			<el-row :gutter="16">
				<el-col :span="12">
					<PopoverFormItem
						label="图片尺寸-宽度px"
						:prop="`dataset.datasets[${index}].resolution[0]`"
						popover-content="resolution"
					>
						<el-input-number v-model.number="item.resolution[0]" :controls="false" />
					</PopoverFormItem>
				</el-col>
				<el-col :span="12">
					<PopoverFormItem
						label="图片尺寸-高度px"
						:prop="`dataset.datasets[${index}].resolution[1]`"
						popover-content="resolution"
					>
						<el-input-number v-model.number="item.resolution[1]" :controls="false" />
					</PopoverFormItem>
				</el-col>
				<el-col :span="12">
					<PopoverFormItem
						label="批次大小"
						:prop="`dataset.datasets[${index}].batch_size`"
						popover-content="batch_size"
					>
						<el-input-number v-model.number="item.batch_size" :step="1" step-strictly :min="1" />
					</PopoverFormItem>
				</el-col>
				<el-col :span="12">
					<PopoverFormItem
						label="每个图像重复训练次数"
						:prop="`dataset.datasets[${index}].num_repeats`"
						popover-content="num_repeats"
					>
						<el-input-number v-model.number="item.num_repeats" :step="1" step-strictly />
					</PopoverFormItem>
				</el-col>
				<el-col :span="24">
					<PopoverFormItem
						label="启用 arb 桶以允许非固定宽高比的图片"
						:prop="`dataset.datasets[${index}].enable_bucket`"
						popover-content="enable_bucket"
					>
						<el-switch v-model="item.enable_bucket" />
					</PopoverFormItem>
				</el-col>
				<el-col :span="24">
					<PopoverFormItem
						label="arb 桶不放大图片"
						:prop="`dataset.datasets[${index}].bucket_no_upscale`"
						popover-content="bucket_no_upscale"
					>
						<el-switch v-model="item.bucket_no_upscale" />
					</PopoverFormItem>
				</el-col>
				<el-col :span="24">
					<PopoverFormItem
						label="Tag 文件扩展名"
						:prop="`dataset.datasets[${index}].caption_extension`"
						popover-content="caption_extension"
					>
						<el-input v-model="item.caption_extension" placeholder="请输入Tag 文件扩展名" />
					</PopoverFormItem>
				</el-col>
			</el-row>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
import type { FormItemRule, TabPaneName } from "element-plus";
import type { RuleForm } from "../../types";
import { generateDefaultDataset } from "../../qwen-image.helper";
import { LoRAValidator } from "@/utils/lora/lora.validator";

type DynamicKeys = keyof RuleForm["dataset"]["datasets"][number];
type DynamicRules = Partial<Record<DynamicKeys, FormItemRule[]>>;

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const activeTabName = defineModel({ type: String as PropType<TabPaneName>, required: true });

// rules
const rules = reactive<DynamicRules>({
	image_directory: [
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				LoRAValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("数据集目录不存在"));
						return;
					}

					callback();
				});
			}
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
	const { datasets } = ruleForm.value.dataset;
	const lastIndex = datasets[datasets.length - 1]?.index ?? -1; // 空数据集时，下标得为0，所以用-1
	const data = generateDefaultDataset({
		general: ruleForm.value.dataset.general,
		index: lastIndex + 1
	});
	ruleForm.value.dataset.datasets.push(data);
	activeTabName.value = data.id;
}

// 删除数据集
function onRemoveDataSet(name: TabPaneName) {
	const dataset = ruleForm.value.dataset.datasets;
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

	ruleForm.value.dataset.datasets.splice(findIndex, 1);
}
</script>

<style lang="scss" scoped>
.data-set-tabs {
	margin-bottom: 22px;
	:deep(.el-tabs__header.is-top) {
		height: 40px;
		@include no-select();
	}
	:deep(.el-tabs__new-tab) {
		height: 100%;
		min-width: 32px;
		margin: 0;
		border: none;
		background-color: var(--el-color-primary);
		border-radius: 0;
		color: var(--el-color-white);
		&:hover {
			background-color: var(--el-color-primary-light-3);
		}
		&:active {
			opacity: 0.7;
		}
	}
	:deep(.el-tabs__nav-wrap.is-scrollable) {
		padding: 0 25px;
	}
	:deep(.el-tabs__nav-prev),
	:deep(.el-tabs__nav-next) {
		line-height: 40px;
		width: 25px;
		&:not(.is-disabled) {
			color: var(--el-color-info-light-3);
			&:hover {
				color: var(--el-color-info);
			}
		}
	}
}
</style>
