<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 15:29:03
 * @LastEditTime: 2025-01-10 16:41:00
 * @LastEditors: mulingyuer
 * @Description: 训练数据
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\TrainingData\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="数据集重复训练次数"
		prop="directory_num_repeats"
		popover-content="directory_num_repeats"
	>
		<el-input-number v-model.number="ruleForm.directory_num_repeats" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem label="训练轮次" prop="epochs" popover-content="epochs">
		<el-input-number v-model.number="ruleForm.epochs" :step="1" step-strictly />
	</PopoverFormItem>
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-宽度px"
				prop="resolution_width"
				popover-content="resolution_width"
				class="resolution-width"
			>
				<el-input-number v-model.number="ruleForm.resolution_width" :controls="false" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-高度px"
				prop="resolution_height"
				popover-content="resolution_height"
				class="resolution-height"
			>
				<el-input-number v-model.number="ruleForm.resolution_height" :controls="false" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<el-alert
				class="training-data-alert"
				title="24g显存最大只能跑 512*512 分辨率的图片"
				type="info"
				:closable="false"
				show-icon
			/>
		</el-col>
	</el-row>
	<el-row v-show="isExpert" :gutter="16">
		<el-col :span="24">
			<PopoverFormItem
				label="启用长宽比分桶"
				prop="enable_ar_bucket"
				popover-content="enable_ar_bucket"
			>
				<el-switch v-model="ruleForm.enable_ar_bucket" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="最小长宽比" prop="min_ar" popover-content="min_ar">
				<el-input-number v-model.number="ruleForm.min_ar" :step="0.1" :min="0" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="最大长宽比" prop="max_ar" popover-content="max_ar">
				<el-input-number v-model.number="ruleForm.max_ar" :step="0.1" :min="0" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="长宽比桶的总数"
				prop="num_ar_buckets"
				popover-content="num_ar_buckets"
			>
				<el-input-number v-model.number="ruleForm.num_ar_buckets" :step="1" :min="1" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="帧桶配置，以英文逗号分隔。示例：1, 33, 65"
				prop="frame_buckets"
				popover-content="frame_buckets"
			>
				<el-input v-model="ruleForm.frame_buckets" placeholder="请输入帧桶配置" />
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

<style lang="scss" scoped>
.resolution-width,
.resolution-height {
	margin-bottom: 12px;
}
.training-data-alert {
	margin-bottom: 22px;
	--el-alert-bg-color: var(--el-color-error-light-9);
	color: var(--el-color-error);
}
</style>
