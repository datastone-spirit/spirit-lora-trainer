<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 10:23:26
 * @LastEditTime: 2024-12-06 10:30:18
 * @LastEditors: mulingyuer
 * @Description: arb 表单
 * @FilePath: \frontend\src\views\lora\sdxl\components\ARB.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="启用 arb 桶以允许非固定宽高比的图片"
		:prop="enableBucketProp"
		popover-content="enable_bucket"
	>
		<el-switch v-model="enable_bucket" />
	</PopoverFormItem>
	<el-row :gutter="20">
		<el-col :span="8">
			<PopoverFormItem
				label="arb 桶最小分辨率"
				:prop="minBucketResoProp"
				popover-content="min_bucket_reso"
			>
				<el-input-number v-model.number="min_bucket_reso" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="8">
			<PopoverFormItem
				label="arb 桶最大分辨率"
				:prop="maxBucketResoProp"
				popover-content="max_bucket_reso"
			>
				<el-input-number v-model.number="max_bucket_reso" />
			</PopoverFormItem>
		</el-col>
	</el-row>
	<PopoverFormItem
		label="arb 桶分辨率划分单位，SDXL 可以使用 32 (SDXL低于32时失效)"
		:prop="bucketResoStepsProp"
		popover-content="bucket_reso_steps"
	>
		<el-input-number v-model.number="bucket_reso_steps" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
export interface ARBProps {
	enableBucketProp?: string;
	minBucketResoProp?: string;
	maxBucketResoProp?: string;
	bucketResoStepsProp?: string;
}

defineProps<ARBProps>();

const enable_bucket = defineModel("enable_bucket", { type: Boolean, required: true });
const min_bucket_reso = defineModel("min_bucket_reso", { type: Number, required: true });
const max_bucket_reso = defineModel("max_bucket_reso", { type: Number, required: true });
const bucket_reso_steps = defineModel("bucket_reso_steps", { type: Number, required: true });
</script>

<style scoped></style>
