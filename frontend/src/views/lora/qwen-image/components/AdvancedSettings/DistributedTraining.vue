<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 14:30:05
 * @LastEditTime: 2025-08-13 16:49:12
 * @LastEditors: mulingyuer
 * @Description: 分布式训练配置
 * @FilePath: \frontend\src\views\lora\qwen-image\components\AdvancedSettings\DistributedTraining.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="分布式训练配置">
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
		<PopoverFormItem
			label="启用多GPU训练"
			prop="multi_gpu_config.multi_gpu_enabled"
			popover-content="multi_gpu_enabled"
		>
			<el-switch v-model="ruleForm.multi_gpu_config.multi_gpu_enabled" />
		</PopoverFormItem>
		<template v-if="ruleForm.multi_gpu_config.multi_gpu_enabled">
			<PopoverFormItem
				label="分布式后端"
				prop="multi_gpu_config.distributed_backend"
				popover-content="distributed_backend"
			>
				<el-select v-model="ruleForm.multi_gpu_config.distributed_backend">
					<el-option label="NCCL (推荐NVIDIA GPU使用)" value="nccl" />
					<el-option label="Gloo (CPU和GPU)" value="gloo" />
					<el-option label="MPI" value="mpi" />
				</el-select>
			</PopoverFormItem>
			<PopoverFormItem
				label="通过累积多个小批次的梯度来等效大batch_size训练"
				prop="multi_gpu_config.gradient_accumulation_steps"
				popover-content="gradient_accumulation_steps"
			>
				<el-input-number
					v-model.number="ruleForm.multi_gpu_config.gradient_accumulation_steps"
					:step="1"
					step-strictly
					:min="0"
				/>
			</PopoverFormItem>
			<PopoverFormItem
				label="每N步进行梯度同步"
				prop="multi_gpu_config.gradient_sync_every_n_steps"
				popover-content="gradient_sync_every_n_steps"
			>
				<el-input-number
					v-model="ruleForm.multi_gpu_config.gradient_sync_every_n_steps"
					:min="1"
					:max="100"
				/>
			</PopoverFormItem>
		</template>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
