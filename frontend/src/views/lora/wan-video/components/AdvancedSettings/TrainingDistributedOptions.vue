<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 15:55:14
 * @LastEditTime: 2025-03-26 15:56:37
 * @LastEditors: mulingyuer
 * @Description: 分布式训练选项
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\TrainingDistributedOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="分布式训练">
		<PopoverFormItem
			label="启用梯度桶视图优化"
			prop="config.ddp_gradient_as_bucket_view"
			popover-content="ddp_gradient_as_bucket_view"
		>
			<el-switch v-model="ruleForm.config.ddp_gradient_as_bucket_view" />
		</PopoverFormItem>
		<PopoverFormItem
			label="固定结构模型加速"
			prop="config.ddp_static_graph"
			popover-content="ddp_static_graph"
		>
			<el-switch v-model="ruleForm.config.ddp_static_graph" />
		</PopoverFormItem>
		<PopoverFormItem
			label="设置DDP进程间通信的超时时间"
			prop="config.ddp_timeout"
			popover-content="ddp_timeout"
		>
			<el-input-number
				v-model.number="ruleForm.config.ddp_timeout"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
