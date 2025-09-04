<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 17:28:31
 * @LastEditTime: 2025-09-04 09:10:15
 * @LastEditors: mulingyuer
 * @Description: 训练用的数据
 * @FilePath: \frontend\src\views\lora\flux\components\TrainingData\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem
				label="每个图像重复训练次数"
				prop="config.num_repeats"
				popover-content="num_repeats"
			>
				<el-input-number v-model.number="ruleForm.config.num_repeats" :step="1" step-strictly />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="最大训练 epoch（轮数）"
				prop="config.max_train_epochs"
				popover-content="max_train_epochs"
			>
				<el-input-number
					v-model.number="ruleForm.config.max_train_epochs"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="批量大小, 越高显存占用越高"
				prop="config.train_batch_size"
				popover-content="train_batch_size"
			>
				<el-input-number
					v-model.number="ruleForm.config.train_batch_size"
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
				prop="config.resolution.0"
				popover-content="resolution"
			>
				<el-input-number v-model.number="ruleForm.config.resolution[0]" :controls="false" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-高度px"
				prop="config.resolution.1"
				popover-content="resolution"
			>
				<el-input-number v-model.number="ruleForm.config.resolution[1]" :controls="false" />
			</PopoverFormItem>
		</el-col>
	</el-row>
	<el-row v-show="isExpert" :gutter="16">
		<el-col :span="24">
			<PopoverFormItem
				label="启用 arb 桶以允许非固定宽高比的图片"
				prop="config.enable_bucket"
				popover-content="enable_bucket"
			>
				<el-switch v-model="ruleForm.config.enable_bucket" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="arb 桶最小分辨率"
				prop="config.min_bucket_reso"
				popover-content="min_bucket_reso"
			>
				<el-input-number v-model.number="ruleForm.config.min_bucket_reso" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="arb 桶最大分辨率"
				prop="config.max_bucket_reso"
				popover-content="max_bucket_reso"
			>
				<el-input-number v-model.number="ruleForm.config.max_bucket_reso" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="arb 桶分辨率划分单位，SDXL 可以使用 32 (SDXL低于32时失效)"
				prop="config.bucket_reso_steps"
				popover-content="bucket_reso_steps"
			>
				<el-input-number v-model.number="ruleForm.config.bucket_reso_steps" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="arb 桶不放大图片"
				prop="config.bucket_no_upscale"
				popover-content="bucket_no_upscale"
			>
				<el-switch v-model="ruleForm.config.bucket_no_upscale" />
			</PopoverFormItem>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
