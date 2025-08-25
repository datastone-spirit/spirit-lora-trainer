<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 09:27:58
 * @LastEditTime: 2025-08-25 16:01:22
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
				v-show="isEdit"
				label="切换右侧数据集预览"
				:prop="`datasets[${index}].preview`"
				popover-content="preview"
			>
				<el-switch
					v-model="item.preview"
					inactive-value="image_directory"
					inactive-text="数据集目录"
					active-value="control_directory"
					active-text="控制数据集目录"
				/>
			</PopoverFormItem>
			<PopoverFormItem
				label="数据集目录"
				:prop="`dataset.datasets[${index}].image_directory`"
				popover-content="image_directory"
				:rules="rules.image_directory"
			>
				<FolderSelector v-model="item.image_directory" placeholder="请选择数据集目录" />
			</PopoverFormItem>
			<PopoverFormItem
				v-show="isEdit"
				label="控制数据集目录"
				:prop="`dataset.datasets[${index}].control_directory`"
				popover-content="control_directory"
				:rules="rules.control_directory"
			>
				<FolderSelector v-model="item.control_directory" placeholder="请选择控制数据集目录" />
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
				<el-col v-show="isEdit" :span="24">
					<PopoverFormItem
						label="禁用调整控制数据集图像的大小"
						:prop="`dataset.datasets[${index}].qwen_image_edit_no_resize_control`"
						popover-content="qwen_image_edit_no_resize_control"
						:rules="rulesFn.qwen_image_edit_no_resize_control(index)"
					>
						<el-switch
							v-model="item.qwen_image_edit_no_resize_control"
							@change="onNoResizeControlChange(index)"
						/>
					</PopoverFormItem>
				</el-col>
				<el-col v-show="isEdit" :span="12">
					<PopoverFormItem
						label="控制数据集图片尺寸-宽度px"
						:prop="`dataset.datasets[${index}].qwen_image_edit_control_resolution[0]`"
						popover-content="qwen_image_edit_control_resolution"
						:rules="rulesFn.qwen_image_edit_control_resolution_width(index)"
					>
						<el-input-number
							v-model.number="item.qwen_image_edit_control_resolution[0]"
							:controls="false"
							@change="onControlResolutionChange(index, 0)"
						/>
					</PopoverFormItem>
				</el-col>
				<el-col v-show="isEdit" :span="12">
					<PopoverFormItem
						label="控制数据集图片尺寸-高度px"
						:prop="`dataset.datasets[${index}].qwen_image_edit_control_resolution[1]`"
						popover-content="qwen_image_edit_control_resolution"
						:rules="rulesFn.qwen_image_edit_control_resolution_height(index)"
					>
						<el-input-number
							v-model.number="item.qwen_image_edit_control_resolution[1]"
							:controls="false"
							@change="onControlResolutionChange(index, 1)"
						/>
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
import type { FormInstance, FormItemRule, TabPaneName } from "element-plus";
import type { RuleForm } from "../../types";
import { generateDefaultDataset, QwenImageRuleFormRef } from "../../qwen-image.helper";
import { LoRAValidator } from "@/utils/lora/lora.validator";

type DynamicKeys = keyof RuleForm["dataset"]["datasets"][number];
type DynamicRules = Partial<Record<DynamicKeys, FormItemRule[]>>;

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const activeTabName = defineModel({ type: String as PropType<TabPaneName>, required: true });
const isEdit = computed(() => ruleForm.value.config.edit);
const ruleFormRef = inject<Ref<FormInstance>>(QwenImageRuleFormRef);

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
	],
	control_directory: [
		{ required: true, message: "请选择训练用的控制数据集目录", trigger: "change" },
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				LoRAValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("控制数据集目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	]
});
const rulesFn = {
	qwen_image_edit_no_resize_control: (index: number) => {
		return [
			{
				validator: (_rule: unknown, value: boolean, callback: (error?: Error) => void) => {
					const findResolution = ruleForm.value.dataset.datasets[
						index
					].qwen_image_edit_control_resolution.find((item) => typeof item === "number");
					if (value && findResolution) {
						return callback(
							new Error(
								"开启禁用调整控制数据集图像的大小，请勿设置控制数据集图片尺寸 (qwen_image_edit_control_resolution)"
							)
						);
					}

					callback();
				},
				trigger: "change"
			}
		];
	},
	qwen_image_edit_control_resolution_width: (index: number) => {
		return [
			{
				validator: (
					_rule: unknown,
					value: number | undefined | null,
					callback: (error?: Error) => void
				) => {
					const isOpenNoResize =
						ruleForm.value.dataset.datasets[index].qwen_image_edit_no_resize_control;
					const isType = typeof value === "number";
					const height =
						ruleForm.value.dataset.datasets[index].qwen_image_edit_control_resolution[1];
					if (isOpenNoResize) {
						if (isType) {
							return callback(new Error("开启禁用调整控制数据集图像的大小，请勿设置该值"));
						}
					} else {
						if (typeof height === "number" && !isType) {
							return callback(new Error("请设置控制数据集图像宽度"));
						}
					}

					callback();
				}
			}
		];
	},
	qwen_image_edit_control_resolution_height: (index: number) => {
		return [
			{
				validator: (
					_rule: unknown,
					value: number | undefined | null,
					callback: (error?: Error) => void
				) => {
					const isOpenNoResize =
						ruleForm.value.dataset.datasets[index].qwen_image_edit_no_resize_control;
					const isType = typeof value === "number";
					const width =
						ruleForm.value.dataset.datasets[index].qwen_image_edit_control_resolution[0];

					if (isOpenNoResize) {
						if (isType) {
							return callback(new Error("开启禁用调整控制数据集图像的大小，请勿设置该值"));
						}
					} else {
						if (typeof width === "number" && !isType) {
							return callback(new Error("请设置控制数据集图像高度"));
						}
					}

					callback();
				}
			}
		];
	}
};

function onNoResizeControlChange(index: number) {
	// 联动校验
	ruleFormRef?.value?.validateField(
		`dataset.datasets[${index}].qwen_image_edit_control_resolution[0]`
	);
	ruleFormRef?.value?.validateField(
		`dataset.datasets[${index}].qwen_image_edit_control_resolution[1]`
	);
}
function onControlResolutionChange(index: number, index2: 0 | 1) {
	// 联动校验
	ruleFormRef?.value?.validateField(`dataset.datasets[${index}].qwen_image_edit_no_resize_control`);
	switch (index2) {
		case 0:
			ruleFormRef?.value?.validateField(
				`dataset.datasets[${index}].qwen_image_edit_control_resolution[1]`
			);
			break;
		case 1:
			ruleFormRef?.value?.validateField(
				`dataset.datasets[${index}].qwen_image_edit_control_resolution[0]`
			);
			break;
	}
}

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
