<!--
 * @Author: Claude Code Assistant
 * @Date: 2025-01-24
 * @Description: Multi-GPU configuration component for Flux training
-->
<template>
	<div class="multi-gpu-config">
		<!-- GPU Information Panel -->
		<div v-if="gpuInfo && gpuInfo.system_info" class="gpu-info-panel mb-4">
			<div class="system-info mb-3">
				<h4 class="text-sm font-medium text-gray-700 mb-2">System Information</h4>
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="text-gray-500">Driver:</span>
						<span class="ml-1 font-medium">{{ gpuInfo.system_info?.driver_version || 'N/A' }}</span>
					</div>
					<div>
						<span class="text-gray-500">CUDA:</span>
						<span class="ml-1 font-medium">{{ gpuInfo.system_info?.cuda_version || 'N/A' }}</span>
					</div>
					<div>
						<span class="text-gray-500">Total GPUs:</span>
						<span class="ml-1 font-medium">{{ gpuInfo.total_gpus || 0 }}</span>
					</div>
					<div>
						<span class="text-gray-500">Total Memory:</span>
						<span class="ml-1 font-medium">{{ formatMemory(gpuInfo.system_info?.total_gpu_memory_mb || 0) }}</span>
					</div>
				</div>
			</div>

			<!-- GPU List -->
			<div class="gpu-list">
				<h4 class="text-sm font-medium text-gray-700 mb-2">Available GPUs</h4>
				<div class="space-y-2">
					<div
						v-for="gpu in gpuInfo.gpus"
						:key="gpu.index"
						class="gpu-card p-3 border rounded-lg"
						:class="{
							'border-blue-500 bg-blue-50': selectedGPUs.includes(gpu.index),
							'border-gray-200': !selectedGPUs.includes(gpu.index) && isGPUSelectable(gpu),
							'border-yellow-200 bg-yellow-50': !selectedGPUs.includes(gpu.index) && isGPUSelectable(gpu) && !isGPUSuitable(gpu) && forceMemoryOverride,
							'border-red-200 bg-red-50': !isGPUSelectable(gpu)
						}"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<el-checkbox
									:model-value="selectedGPUs.includes(gpu.index)"
									@change="toggleGPU(gpu.index)"
									:disabled="!isGPUSelectable(gpu) && !selectedGPUs.includes(gpu.index)"
								>
									<span class="font-medium">GPU {{ gpu.index }}</span>
								</el-checkbox>
								<el-tag :type="getGPUStatusType(gpu) as any" size="small">
									{{ getGPUStatus(gpu) }}
								</el-tag>
							</div>
							<div class="text-sm text-gray-500">
								{{ formatMemory(gpu.memory_free_mb || 0) }} / {{ formatMemory(gpu.memory_total_mb || 0) }} free
							</div>
						</div>
						
						<div class="mt-2 text-sm text-gray-600">
							<div class="flex justify-between items-center">
								<span>{{ gpu.name || 'Unknown GPU' }}</span>
								<div class="flex space-x-4">
									<span v-if="gpu.temperature_celsius">{{ gpu.temperature_celsius }}°C</span>
									<span v-if="gpu.utilization_percent !== undefined && gpu.utilization_percent !== null">{{ gpu.utilization_percent }}% Load</span>
								</div>
							</div>
							
							<!-- Memory and Power Usage Bars -->
							<div class="mt-2 space-y-1">
								<div class="flex items-center space-x-2">
									<span class="text-xs w-12">Memory:</span>
									<div class="flex-1 bg-gray-200 rounded-full h-2">
										<div
											class="bg-blue-500 h-2 rounded-full transition-all"
											:style="{ width: `${gpu.memory_utilization_percent || 0}%` }"
										></div>
									</div>
									<span class="text-xs">{{ Math.round(gpu.memory_utilization_percent || 0) }}%</span>
								</div>
								<div v-if="(gpu.power_limit_watts || 0) > 0" class="flex items-center space-x-2">
									<span class="text-xs w-12">Power:</span>
									<div class="flex-1 bg-gray-200 rounded-full h-2">
										<div
											class="bg-green-500 h-2 rounded-full transition-all"
											:style="{ width: `${gpu.power_utilization_percent || 0}%` }"
										></div>
									</div>
									<span class="text-xs">{{ Math.round(gpu.power_utilization_percent || 0) }}%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		<div v-else-if="loading" class="text-center py-8">
			<el-icon class="is-loading mb-2">
				<Loading />
			</el-icon>
			<div class="text-gray-500">Loading GPU information...</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="error-panel p-4 bg-red-50 border border-red-200 rounded-lg">
			<div class="flex items-center space-x-2 text-red-700 mb-2">
				<el-icon><Warning /></el-icon>
				<span class="font-medium">Failed to load GPU information</span>
			</div>
			<div class="text-red-600 text-sm mb-3">{{ error }}</div>
			<el-button size="small" @click="loadGPUInfo">Retry</el-button>
		</div>

		<!-- Configuration Options -->
		<div class="config-options space-y-4">
			<!-- Auto GPU Selection -->
			<div class="flex items-center justify-between">
				<label class="text-sm font-medium">Auto-select optimal GPUs</label>			<el-switch 
				v-model="ruleForm.auto_gpu_selection"
				@change="handleAutoSelectionChange"
			/>
			</div>

			<!-- Manual GPU Selection -->
			<div v-if="!ruleForm.auto_gpu_selection && gpuInfo" class="manual-selection">
				<label class="text-sm font-medium block mb-2">Selected GPUs: {{ selectedGPUs.length }}</label>
				<div v-if="validationResult && !validationResult.is_valid" class="validation-error mb-3">
					<el-alert
						:title="validationResult.error_message || 'Validation failed'"
						type="error"
						show-icon
						:closable="false"
					/>
				</div>
			</div>

			<!-- GPU Count (for auto selection) -->
			<div v-if="ruleForm.auto_gpu_selection" class="gpu-count">
				<label class="text-sm font-medium block mb-2">Number of GPUs</label>
				<el-input-number
					v-model="ruleForm.num_gpus"
					:min="1"
					:max="gpuInfo ? gpuInfo.total_gpus : 8"
					@change="handleGPUCountChange"
				/>
			</div>

			<!-- Memory Requirements -->
			<div class="memory-requirements">
				<label class="text-sm font-medium block mb-2">Memory Requirement per GPU (MB)</label>
				<el-input-number
					v-model="ruleForm.memory_requirement_mb"
					:min="4000"
					:max="80000"
					:step="1000"
					@change="validateCurrentSelection"
				/>
				<div class="mt-2">
					<el-checkbox 
						v-model="forceMemoryOverride" 
						@change="validateCurrentSelection"
					>
						Override memory checks for Flux LoRA training
					</el-checkbox>
					<div v-if="forceMemoryOverride" class="text-xs text-amber-600 mt-1">
						⚠️ Memory validation will be bypassed. Flux LoRA training uses optimized memory management but may still require sufficient GPU memory.
					</div>
					<div v-else-if="memoryEstimation?.per_gpu_estimate?.flux_lora_optimized" class="text-xs text-green-600 mt-1">
						✅ Using optimized memory estimates for Flux LoRA training (~{{ formatMemory(getEffectiveMemoryRequirement()) }} per GPU)
					</div>
				</div>
			</div>

			<!-- Memory Estimation -->
			<div v-if="memoryEstimation" class="memory-estimation p-3 bg-blue-50 border border-blue-200 rounded-lg">
				<h5 class="text-sm font-medium text-blue-700 mb-2">
					Memory Estimation
					<span v-if="memoryEstimation.per_gpu_estimate.flux_lora_optimized" class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
						Flux LoRA Optimized
					</span>
				</h5>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div>
						<span class="text-blue-600">Per GPU:</span>
						<span class="ml-1 font-medium">{{ formatMemory(memoryEstimation.per_gpu_estimate.total_memory_mb) }}</span>
					</div>
					<div>
						<span class="text-blue-600">Total:</span>
						<span class="ml-1 font-medium">{{ formatMemory(memoryEstimation.total_memory_mb) }}</span>
					</div>
					<div>
						<span class="text-blue-600">Recommended:</span>
						<span class="ml-1 font-medium">{{ formatMemory(memoryEstimation.recommended_memory_mb) }}</span>
					</div>
					<div>
						<span class="text-blue-600">Model Size:</span>
						<span class="ml-1 font-medium">{{ memoryEstimation.configuration.model_size }}</span>
					</div>
					<div v-if="memoryEstimation.per_gpu_estimate.minimum_requirement_mb" class="col-span-2">
						<span class="text-blue-600">Minimum Required:</span>
						<span class="ml-1 font-medium">{{ formatMemory(memoryEstimation.per_gpu_estimate.minimum_requirement_mb) }}</span>
						<span class="ml-2 text-xs text-gray-500">(with Flux optimizations)</span>
					</div>
				</div>
				<div v-if="memoryEstimation.per_gpu_estimate.flux_lora_optimized" class="mt-2 text-xs text-green-700">
					✅ Using Flux LoRA optimizations: fp8 quantization, gradient checkpointing, and memory-efficient attention
				</div>
			</div>

			<!-- Distributed Backend -->
			<div class="distributed-backend">
				<label class="text-sm font-medium block mb-2">Distributed Backend</label>
				<el-select v-model="ruleForm.distributed_backend" style="width: 100%">
					<el-option label="NCCL (Recommended for NVIDIA GPUs)" value="nccl" />
					<el-option label="Gloo (CPU and GPU)" value="gloo" />
					<el-option label="MPI" value="mpi" />
				</el-select>
			</div>

			<!-- Gradient Sync Interval -->
			<div class="gradient-sync">
				<label class="text-sm font-medium block mb-2">Gradient Sync Every N Steps</label>
				<el-input-number
					v-model="ruleForm.gradient_sync_every_n_steps"
					:min="1"
					:max="100"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="actions mt-6 flex space-x-3">
			<el-button @click="refreshGPUInfo" :loading="loading">
				<el-icon><Refresh /></el-icon>
				Refresh GPU Info
			</el-button>
			<el-button
				v-if="gpuInfo && selectedGPUs.length > 0"
				@click="validateConfiguration"
				:loading="validating"
			>
				<el-icon><Check /></el-icon>
				Validate Configuration
			</el-button>
			<el-button
				v-if="gpuInfo && ruleForm.auto_gpu_selection"
				@click="selectOptimalGPUs"
				:loading="optimizing"
			>
				<el-icon><StarFilled /></el-icon>
				Select Optimal GPUs
			</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import { ElMessage } from 'element-plus';
import { Loading, Warning, Refresh, Check, StarFilled } from '@element-plus/icons-vue';
import { gpuApi } from '@/api/gpu';
import type { 
	GPUInfo, 
	GPUInfoResponse, 
	GPUValidationResponse,
	MemoryEstimationResponse,
	OptimalGPUSelectionResponse 
} from '@/api/gpu/types';
import type { RuleForm } from '../../types';

// Props
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

// State
const gpuInfo = ref<GPUInfoResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const validating = ref(false);
const optimizing = ref(false);
const validationResult = ref<GPUValidationResponse | null>(null);
const memoryEstimation = ref<MemoryEstimationResponse | null>(null);
const forceMemoryOverride = ref(false);

// Fallback GPU info when API is not available
const getFallbackGPUInfo = () => {
	return {
		total_gpus: 1,
		system_info: {
			driver_version: 'Not Available',
			cuda_version: 'Not Available',
			gpu_count: 1,
			total_gpu_memory_mb: 8192
		},
		gpus: [
			{
				index: 0,
				name: 'GPU (API not available)',
				memory_total_mb: 8192,
				memory_free_mb: 4096,
				memory_used_mb: 4096,
				memory_utilization_percent: 50,
				power_draw_watts: 0,
				power_limit_watts: 0,
				power_utilization_percent: 0,
				temperature_celsius: null,
				utilization_percent: null,
				uuid: null,
				driver_version: null
			}
		]
	};
};

// Computed
const selectedGPUs = computed({
	get: () => ruleForm.value.gpu_ids || [],
	set: (value: number[]) => {
		ruleForm.value.gpu_ids = value;
		ruleForm.value.num_gpus = value.length;
	}
});

// Methods
const formatMemory = (mb: number): string => {
	if (!mb || isNaN(mb)) return '0 MB';
	if (mb >= 1024) {
		return `${(mb / 1024).toFixed(1)} GB`;
	}
	return `${Math.round(mb)} MB`;
};

const getEffectiveMemoryRequirement = (): number => {
	// Use the actual estimated memory requirement if available, otherwise fallback to form value
	if (memoryEstimation.value?.per_gpu_estimate?.flux_lora_optimized) {
		return memoryEstimation.value.per_gpu_estimate.minimum_requirement_mb || 
			   memoryEstimation.value.per_gpu_estimate.total_memory_mb;
	}
	return ruleForm.value.memory_requirement_mb || 8000;
};

const isGPUSuitable = (gpu: GPUInfo): boolean => {
	if (!gpu) return false;
	
	const memoryRequired = getEffectiveMemoryRequirement();
	const memoryFree = gpu.memory_free_mb || 0;
	const temperature = gpu.temperature_celsius;
	const utilization = gpu.utilization_percent;
	
	// If force override is enabled, only check critical constraints
	if (forceMemoryOverride.value) {
		return memoryFree >= 2000 && // Minimum 2GB
			   (temperature === undefined || temperature === null || temperature < 85) &&
			   (utilization === undefined || utilization === null || utilization < 95);
	}
	
	return memoryFree >= memoryRequired && 
		   (temperature === undefined || temperature === null || temperature < 85) &&
		   (utilization === undefined || utilization === null || utilization < 90);
};

const isGPUSelectable = (gpu: GPUInfo): boolean => {
	if (!gpu) return false;
	
	const memoryFree = gpu.memory_free_mb || 0;
	const temperature = gpu.temperature_celsius;
	const utilization = gpu.utilization_percent;
	
	// Always allow selection if force override is enabled (with minimal safety checks)
	if (forceMemoryOverride.value) {
		return memoryFree >= 2000 && // Minimum 2GB  
			   (temperature === undefined || temperature === null || temperature < 90) &&
			   (utilization === undefined || utilization === null || utilization < 98);
	}
	
	// Otherwise use the normal suitability check
	return isGPUSuitable(gpu);
};

const getGPUStatus = (gpu: GPUInfo): string => {
	if (!gpu) return 'Unknown';
	
	const memoryFree = gpu.memory_free_mb || 0;
	const memoryRequired = getEffectiveMemoryRequirement();
	
	// Check if GPU is selectable first
	if (!isGPUSelectable(gpu)) {
		if (memoryFree < 2000) {
			return 'Critical Memory Shortage';
		}
		if (gpu.temperature_celsius && gpu.temperature_celsius >= 90) {
			return 'High Temperature';
		}
		if (gpu.utilization_percent && gpu.utilization_percent >= 98) {
			return 'High Utilization';
		}
		return 'Not Available';
	}
	
	// If selectable but not suitable under normal conditions
	if (!isGPUSuitable(gpu)) {
		if (forceMemoryOverride.value) {
			return 'Available (Override)';
		} else {
			if (memoryFree < memoryRequired) {
				return 'Insufficient Memory';
			}
			if (gpu.temperature_celsius && gpu.temperature_celsius >= 85) {
				return 'High Temperature';
			}
			if (gpu.utilization_percent && gpu.utilization_percent >= 90) {
				return 'High Utilization';
			}
			return 'Not Suitable';
		}
	}
	
	return 'Available';
};

const getGPUStatusType = (gpu: GPUInfo): string => {
	if (isGPUSuitable(gpu)) {
		return 'success';
	}
	if (isGPUSelectable(gpu)) {
		return forceMemoryOverride.value ? 'warning' : 'danger';
	}
	return 'danger';
};

const toggleGPU = (gpuIndex: number) => {
	const currentSelected = [...selectedGPUs.value];
	const index = currentSelected.indexOf(gpuIndex);
	
	if (index > -1) {
		currentSelected.splice(index, 1);
	} else {
		currentSelected.push(gpuIndex);
	}
	
	selectedGPUs.value = currentSelected.sort((a, b) => a - b);
	validateCurrentSelection();
};

const loadGPUInfo = async () => {
	loading.value = true;
	error.value = null;
	
	try {
		const response = await gpuApi.getGPUInfo();
		
		// Validate response structure
		if (!response || typeof response !== 'object') {
			throw new Error('Invalid GPU info response');
		}
		
		// Ensure minimum required properties exist
		if (!response.gpus || !Array.isArray(response.gpus)) {
			throw new Error('Invalid GPU list in response');
		}
		
		// Set default values for missing system_info
		if (!response.system_info) {
			response.system_info = {
				driver_version: 'Unknown',
				cuda_version: 'Unknown',
				gpu_count: response.gpus?.length || 0,
				total_gpu_memory_mb: 0
			};
		}
		
		// Set default total_gpus if missing
		if (!response.total_gpus) {
			response.total_gpus = response.gpus.length;
		}
		
		gpuInfo.value = response;
		
		// Initialize form values if not set
		if (!ruleForm.value.memory_requirement_mb) {
			ruleForm.value.memory_requirement_mb = 8000;
		}
		if (!ruleForm.value.distributed_backend) {
			ruleForm.value.distributed_backend = 'nccl';
		}
		if (!ruleForm.value.gradient_sync_every_n_steps) {
			ruleForm.value.gradient_sync_every_n_steps = 1;
		}
		
		// Auto-select first suitable GPU if none selected
		if (!selectedGPUs.value.length && ruleForm.value.auto_gpu_selection) {
			selectOptimalGPUs();
		}
		
		estimateMemory();
	} catch (err: any) {
		console.error('GPU info loading error:', err);
		
		// Use fallback GPU info when API is not available
		gpuInfo.value = getFallbackGPUInfo();
		
		// Set user-friendly error messages
		if (err.message?.includes('fetch') || err.message?.includes('Network') || err.code === 'ECONNREFUSED') {
			error.value = 'GPU monitoring service is not available. Using default configuration.';
			ElMessage.warning('GPU monitoring service is not available. You can still configure multi-GPU training.');
		} else {
			error.value = 'Could not load real-time GPU information. Using default configuration.';
			ElMessage.warning('Could not load real-time GPU information. Using default configuration.');
		}
	} finally {
		loading.value = false;
	}
};

const refreshGPUInfo = () => {
	loadGPUInfo();
};

const validateConfiguration = async () => {
	if (!selectedGPUs.value.length) {
		ElMessage.warning('Please select at least one GPU');
		return;
	}
	
	validating.value = true;
	
	try {
		validationResult.value = await gpuApi.validateGPUConfig({
			gpu_ids: selectedGPUs.value,
			memory_requirement_mb: ruleForm.value.memory_requirement_mb || 8000,
			batch_size_per_gpu: ruleForm.value.train_batch_size || 1,
			force_override: forceMemoryOverride.value
		});
		
		if (validationResult.value.is_valid) {
			const message = forceMemoryOverride.value 
				? 'GPU configuration is valid (memory checks overridden)'
				: 'GPU configuration is valid';
			ElMessage.success(message);
		} else {
			ElMessage.error(validationResult.value.error_message || 'GPU configuration is invalid');
		}
	} catch (err: any) {
		ElMessage.error('Failed to validate GPU configuration');
	} finally {
		validating.value = false;
	}
};

const validateCurrentSelection = () => {
	if (selectedGPUs.value.length > 0) {
		validateConfiguration();
	}
};

const selectOptimalGPUs = async () => {
	if (!gpuInfo.value) return;
	
	optimizing.value = true;
	
	try {
		const response: OptimalGPUSelectionResponse = await gpuApi.getOptimalGPUSelection({
			num_gpus: ruleForm.value.num_gpus || 1,
			memory_requirement_mb: ruleForm.value.memory_requirement_mb || 8000,
			prefer_low_utilization: true
		});
		
		selectedGPUs.value = response.optimal_gpu_ids;
		ElMessage.success(`Selected optimal GPUs: ${response.optimal_gpu_ids.join(', ')}`);
		
		// Validate the selection
		validateCurrentSelection();
	} catch (err: any) {
		ElMessage.error('Failed to select optimal GPUs: ' + err.message);
	} finally {
		optimizing.value = false;
	}
};

const estimateMemory = async () => {
	try {
		memoryEstimation.value = await gpuApi.estimateMemoryRequirements({
			batch_size: ruleForm.value.train_batch_size || 1,
			num_gpus: ruleForm.value.num_gpus || 1,
			model_size: 'flux-dev',
			precision: ruleForm.value.mixed_precision || 'bf16',
			training_type: 'lora',
			use_flux_optimizations: true
		});
		
		// Update memory requirement based on estimation, but use minimum for Flux LoRA
		const targetMemory = memoryEstimation.value.per_gpu_estimate.flux_lora_optimized 
			? (memoryEstimation.value.per_gpu_estimate.minimum_requirement_mb || memoryEstimation.value.per_gpu_estimate.total_memory_mb)
			: memoryEstimation.value.per_gpu_estimate.recommended_memory_mb;
			
		// Always update to use the optimized estimate for Flux LoRA
		ruleForm.value.memory_requirement_mb = targetMemory;
		
		// Re-validate current selection with new memory estimates
		validateCurrentSelection();
	} catch (err: any) {
		console.warn('Failed to estimate memory requirements:', err);
	}
};

const handleAutoSelectionChange = (val: string | number | boolean) => {
	const enabled = Boolean(val);
	if (enabled && gpuInfo.value) {
		selectOptimalGPUs();
	}
};

const handleGPUCountChange = () => {
	if (ruleForm.value.auto_gpu_selection) {
		selectOptimalGPUs();
	}
	estimateMemory();
};

// Watchers
watch(() => ruleForm.value.train_batch_size, estimateMemory);
watch(() => ruleForm.value.mixed_precision, estimateMemory);
watch(() => forceMemoryOverride.value, () => {
	validateCurrentSelection();
});
watch(() => memoryEstimation.value, () => {
	// Force reactivity update when memory estimation changes
	if (gpuInfo.value) {
		gpuInfo.value = { ...gpuInfo.value };
	}
});

// Lifecycle
onMounted(() => {
	loadGPUInfo();
});
</script>

<style scoped>
.multi-gpu-config {
	max-width: 100%;
}

.gpu-card {
	transition: all 0.2s ease;
}

.gpu-card:hover {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-panel {
	background-color: #fef2f2;
}

.memory-estimation {
	background-color: #eff6ff;
}

.config-options > div {
	padding: 12px 0;
	border-bottom: 1px solid #f3f4f6;
}

.config-options > div:last-child {
	border-bottom: none;
}
</style>