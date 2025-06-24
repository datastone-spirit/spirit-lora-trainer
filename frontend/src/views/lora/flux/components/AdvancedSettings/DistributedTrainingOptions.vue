<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:39:43
 * @LastEditTime: 2025-01-24
 * @LastEditors: Claude Code Assistant
 * @Description: 分布式训练和多GPU配置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\DistributedTrainingOptions.vue
 * Enhanced with multi-GPU support
-->
<template>
	<FieldSetWrapper title="分布式训练">
		<!-- Multi-GPU Training Toggle -->
		<PopoverFormItem
			label="启用多GPU训练"
			prop="multi_gpu_enabled"
			popover-content="Enable multi-GPU distributed training for faster performance"
		>
			<el-switch 
				v-model="ruleForm.multi_gpu_enabled" 
				@change="handleMultiGPUToggle"
			/>
		</PopoverFormItem>

		<!-- Multi-GPU Configuration Panel -->
		<div v-if="ruleForm.multi_gpu_enabled" class="multi-gpu-panel mt-4">
			<el-divider content-position="left">
				<span class="text-sm text-gray-600">Multi-GPU Configuration</span>
			</el-divider>
			
			<MultiGPUConfiguration v-model:form="ruleForm" />
		</div>

		<!-- Traditional DDP Options -->
		<div v-if="!ruleForm.multi_gpu_enabled || showAdvancedDDP" class="ddp-options">
			<el-divider v-if="ruleForm.multi_gpu_enabled" content-position="left">
				<el-button 
					link 
					type="primary" 
					size="small"
					@click="showAdvancedDDP = !showAdvancedDDP"
				>
					{{ showAdvancedDDP ? 'Hide' : 'Show' }} Advanced DDP Options
				</el-button>
			</el-divider>
			
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
		</div>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import MultiGPUConfiguration from './MultiGPUConfiguration.vue';
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

// State
const showAdvancedDDP = ref(false);

// Methods
const handleMultiGPUToggle = (enabled: boolean) => {
	if (enabled) {
		// Initialize multi-GPU defaults
		if (!ruleForm.value.num_gpus) {
			ruleForm.value.num_gpus = 1;
		}
		if (!ruleForm.value.distributed_backend) {
			ruleForm.value.distributed_backend = 'nccl';
		}
		if (!ruleForm.value.memory_requirement_mb) {
			ruleForm.value.memory_requirement_mb = 8000;
		}
		if (!ruleForm.value.gradient_sync_every_n_steps) {
			ruleForm.value.gradient_sync_every_n_steps = 1;
		}
		if (ruleForm.value.auto_gpu_selection === undefined) {
			ruleForm.value.auto_gpu_selection = true;
		}
		
		ElMessage.info('Multi-GPU training enabled. Configure your GPUs below.');
	} else {
		// Clear multi-GPU settings
		ruleForm.value.num_gpus = 1;
		ruleForm.value.gpu_ids = undefined;
		ruleForm.value.auto_gpu_selection = false;
		
		ElMessage.info('Multi-GPU training disabled. Switched to single GPU mode.');
	}
};
</script>

<style scoped>
.multi-gpu-panel {
	background-color: #f8fafc;
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	padding: 16px;
	margin: 16px 0;
}

.ddp-options {
	margin-top: 16px;
}

:deep(.el-divider__text) {
	background-color: #f8fafc;
}
</style>
