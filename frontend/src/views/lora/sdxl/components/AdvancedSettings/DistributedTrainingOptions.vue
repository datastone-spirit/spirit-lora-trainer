<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:39:43
 * @LastEditTime: 2025-01-10 11:27:24
 * @LastEditors: mulingyuer
 * @Description: 分布式训练
 * @FilePath: \frontend\src\views\lora\sdxl\components\AdvancedSettings\DistributedTrainingOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="分布式训练">
		<PopoverFormItem
			label="分布式训练超时时间（分钟）"
			prop="ddp_timeout"
			popover-content="ddp_timeout"
		>
			<el-input-number v-model.number="ruleForm.ddp_timeout" :step="1" step-strictly :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="为 DDP 启用 gradient_as_bucket_view"
			prop="ddp_gradient_as_bucket_view"
			popover-content="ddp_gradient_as_bucket_view"
		>
			<el-switch v-model="ruleForm.ddp_gradient_as_bucket_view" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
