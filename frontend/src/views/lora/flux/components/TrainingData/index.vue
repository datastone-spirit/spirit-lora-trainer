<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 17:28:31
 * @LastEditTime: 2024-12-30 10:16:29
 * @LastEditors: mulingyuer
 * @Description: 训练用的数据
 * @FilePath: \frontend\src\views\lora\flux\components\TrainingData\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<DatasetDirSelector
		v-model:dir="ruleForm.image_dir"
		v-model:tagger-model="ruleForm.tagger_model"
		dir-label="数据集目录"
		:dir-prop="formProps.image_dir"
		dir-popover-content="image_dir"
		tagger-label="打标模型"
		:tagger-prop="formProps.tagger_model"
		tagger-popover-content="tagger_model"
		:tag-submit="tagSubmit"
	/>
	<el-row :gutter="16">
		<el-col :span="24">
			<PopoverFormItem
				label="是否把触发词输出到打标文件中 "
				:prop="formProps.output_trigger_words"
				popover-content="output_trigger_words"
			>
				<el-switch v-model="ruleForm.output_trigger_words" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="每个图像重复训练次数"
				:prop="formProps.num_repeats"
				popover-content="num_repeats"
			>
				<el-input-number v-model.number="ruleForm.num_repeats" :step="1" step-strictly />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="最大训练 epoch（轮数）"
				prop="max_train_epochs"
				popover-content="max_train_epochs"
			>
				<el-input-number
					v-model.number="ruleForm.max_train_epochs"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="批量大小, 越高显存占用越高"
				prop="train_batch_size"
				popover-content="train_batch_size"
			>
				<el-input-number
					v-model.number="ruleForm.train_batch_size"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
	</el-row>
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-宽度px"
				:prop="formProps.resolution_width"
				popover-content="resolution"
			>
				<el-input-number v-model.number="ruleForm.resolution_width" :controls="false" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-高度px"
				:prop="formProps.resolution_height"
				popover-content="resolution"
			>
				<el-input-number v-model.number="ruleForm.resolution_height" :controls="false" />
			</PopoverFormItem>
		</el-col>
	</el-row>
	<el-row v-show="isExpert" :gutter="16">
		<el-col :span="24">
			<PopoverFormItem
				label="启用 arb 桶以允许非固定宽高比的图片"
				:prop="formProps.enable_bucket"
				popover-content="enable_bucket"
			>
				<el-switch v-model="ruleForm.enable_bucket" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="arb 桶最小分辨率"
				:prop="formProps.min_bucket_reso"
				popover-content="min_bucket_reso"
			>
				<el-input-number v-model.number="ruleForm.min_bucket_reso" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="arb 桶最大分辨率"
				:prop="formProps.max_bucket_reso"
				popover-content="max_bucket_reso"
			>
				<el-input-number v-model.number="ruleForm.max_bucket_reso" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="arb 桶分辨率划分单位，SDXL 可以使用 32 (SDXL低于32时失效)"
				:prop="formProps.bucket_reso_steps"
				popover-content="bucket_reso_steps"
			>
				<el-input-number v-model.number="ruleForm.bucket_reso_steps" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="arb 桶不放大图片"
				:prop="formProps.bucket_no_upscale"
				popover-content="bucket_no_upscale"
			>
				<el-switch v-model="ruleForm.bucket_no_upscale" />
			</PopoverFormItem>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm, RuleFormProps } from "../../types";
import type { DatasetDirSelectorProps } from "@/components/Form/DatasetDirSelector.vue";

export interface TrainingDataProps {
	/** 表单props */
	formProps: RuleFormProps;
	/** 打标submit函数 */
	tagSubmit: DatasetDirSelectorProps["tagSubmit"];
}

defineProps<TrainingDataProps>();

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
