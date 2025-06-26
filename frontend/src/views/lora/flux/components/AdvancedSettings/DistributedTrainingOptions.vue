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
			<MultiGPUConfiguration 
				ref="multiGPUConfigRef"
				v-model:form="ruleForm" 
				@gpu-selection-changed="handleGPUSelectionChanged"
				@configuration-restored="handleConfigurationRestored"
			/>
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
import { ref, nextTick } from 'vue';
import type { PropType } from 'vue';
import { ElMessage } from 'element-plus';
import * as TOML from 'smol-toml';
import MultiGPUConfiguration from './MultiGPUConfiguration.vue';
import PopoverFormItem from '@/components/Form/PopoverFormItem.vue';
import FieldSetWrapper from '@/components/FieldSetWrapper/FieldSetWrapper.vue';
import { useTrainingStore } from '@/stores';
import { currentTaskFormConfig } from '@/api/task';
import { gpuApi } from '@/api/gpu';
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

// Store
const trainingStore = useTrainingStore();

// State
const showAdvancedDDP = ref(false);
const multiGPUConfigRef = ref<InstanceType<typeof MultiGPUConfiguration> | null>(null);

// Event handlers
const handleGPUSelectionChanged = (gpuIds: number[]) => {
	console.log('GPU selection changed:', gpuIds);
};

const handleConfigurationRestored = (config: any) => {
	console.log('Configuration restored:', config);
};

// Methods
const handleMultiGPUToggle = async (val: string | number | boolean) => {
	const enabled = Boolean(val);
	
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
		
		// Wait for the next tick to ensure the child component is mounted
		await nextTick();
		
		// Check current training status
		if (trainingStore.hasRunningTask && trainingStore.isFluxTraining) {
			try {
				// Fetch current training configuration
				const taskInfo = trainingStore.currentTaskInfo;
				if (taskInfo.id) {
					try {
						const configResponse = await currentTaskFormConfig({
							task_id: taskInfo.id,
							show_config: true
						});
						
						if (configResponse && configResponse.frontend_config) {
							try {
								// Parse TOML configuration instead of JSON
								const config = TOML.parse(configResponse.frontend_config);
								console.log('Parsed TOML config:', config);
								
								// Check if the training config already has multi-GPU enabled
								if (config.multi_gpu_enabled && config.gpu_ids && Array.isArray(config.gpu_ids) && config.gpu_ids.length > 0) {
									// Restore existing multi-GPU configuration
									if (multiGPUConfigRef.value) {
										console.log('Restoring multi-GPU config with GPU IDs:', config.gpu_ids);
										multiGPUConfigRef.value.restoreGPUConfiguration(config);
										return; // Exit early, configuration restored successfully
									}
								} else {
									console.log('Multi-GPU not enabled in config or no GPU IDs found:', {
										multi_gpu_enabled: config.multi_gpu_enabled,
										gpu_ids: config.gpu_ids
									});
								}
							} catch (parseError) {
								console.error('Failed to parse TOML configuration:', parseError);
								console.warn('Invalid TOML format, will proceed with GPU detection');
							}
						}
					} catch (configError) {
						console.warn('Failed to fetch training config or parse TOML:', configError);
					}
				}
				
				// If we reach here, either:
				// 1. Failed to fetch config
				// 2. Config doesn't have multi-GPU enabled
				// 3. Config doesn't have valid GPU IDs
				// In these cases, let the child component intelligently detect 
				// which GPUs are being used for training
				if (multiGPUConfigRef.value) {
					await multiGPUConfigRef.value.selectAllSuitableGPUs();
				}
			} catch (error: any) {
				console.error('Error during training GPU configuration:', error);
				if (multiGPUConfigRef.value) {
					await multiGPUConfigRef.value.selectAllSuitableGPUs();
				}
			}
		} else {
			// No current training, select all suitable GPUs
			if (multiGPUConfigRef.value) {
				await multiGPUConfigRef.value.selectAllSuitableGPUs();
			}
		}
		
		// No success messages when toggling, let the child component handle feedback
	} else {
		// Clear multi-GPU settings
		ruleForm.value.num_gpus = 1;
		ruleForm.value.gpu_ids = undefined;
		ruleForm.value.auto_gpu_selection = false;
		
		// No message when disabling, silent operation
	}
};
</script>

<style scoped>
.multi-gpu-panel {
	/*background-color: #f8fafc;*/
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
