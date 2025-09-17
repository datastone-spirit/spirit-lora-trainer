<!--
 * @Author: mulingyuer
 * @Date: 2025-08-12 17:26:27
 * @LastEditTime: 2025-09-04 09:16:44
 * @LastEditors: mulingyuer
 * @Description: 数据集公共配置
 * @FilePath: \frontend\src\views\lora\qwen-image\components\DataSet\General.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-宽度px"
				prop="dataset.general.resolution.0"
				popover-content="resolution"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.general.resolution[0]"
					:controls="false"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-高度px"
				prop="dataset.general.resolution.1"
				popover-content="resolution"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.general.resolution[1]"
					:controls="false"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="批次大小"
				prop="dataset.general.batch_size"
				popover-content="batch_size"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.general.batch_size"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="启用 arb 桶以允许非固定宽高比的图片"
				prop="dataset.general.enable_bucket"
				popover-content="enable_bucket"
			>
				<el-switch v-model="ruleForm.dataset.general.enable_bucket" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="arb 桶不放大图片"
				prop="dataset.general.bucket_no_upscale"
				popover-content="bucket_no_upscale"
			>
				<el-switch v-model="ruleForm.dataset.general.bucket_no_upscale" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="Tag 文件扩展名"
				prop="dataset.general.caption_extension"
				popover-content="caption_extension"
			>
				<el-input
					v-model="ruleForm.dataset.general.caption_extension"
					placeholder="请输入Tag 文件扩展名"
				/>
			</PopoverFormItem>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style lang="scss" scoped>
.general-card {
	margin-bottom: $zl-padding;
}
</style>
