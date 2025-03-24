<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 14:42:11
 * @LastEditTime: 2025-03-24 14:50:12
 * @LastEditors: mulingyuer
 * @Description: 训练用的数据
 * @FilePath: \frontend\src\views\lora\wan\components\TrainingData.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="数据集重复次数" prop="num_repeats" popover-content="num_repeats">
		<el-input-number v-model.number="ruleForm.num_repeats" :step="1" step-strictly :min="1" />
	</PopoverFormItem>
	<PopoverFormItem label="训练轮数" prop="epoch" popover-content="epoch">
		<el-input-number v-model.number="ruleForm.epoch" :step="1" step-strictly :min="1" />
	</PopoverFormItem>
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-宽度px"
				prop="resolution_width"
				popover-content="resolution_width"
			>
				<el-input-number v-model.number="ruleForm.resolution_width" :controls="false" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-高度px"
				prop="resolution_height"
				popover-content="resolution_height"
			>
				<el-input-number v-model.number="ruleForm.resolution_height" :controls="false" />
			</PopoverFormItem>
		</el-col>
	</el-row>
	<PopoverFormItem label="批次大小" prop="batch_size" popover-content="batch_size">
		<el-input-number v-model.number="ruleForm.batch_size" :step="1" step-strictly :min="0" />
	</PopoverFormItem>
	<PopoverFormItem
		label="启用动态分辨率，启用 arb 桶以允许非固定宽高比的图片"
		prop="enable_bucket"
		popover-content="enable_bucket"
	>
		<el-switch v-model="ruleForm.enable_bucket" />
	</PopoverFormItem>
	<PopoverFormItem
		label="允许小图放大，arb 桶不放大图片"
		prop="bucket_no_upscale"
		popover-content="bucket_no_upscale"
	>
		<el-switch v-model="ruleForm.bucket_no_upscale" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
