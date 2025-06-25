<!--
 * @Author: Claude Code Assistant
 * @Date: 2025-01-24
 * @Description: Multi-GPU configuration component for Flux training
-->
<template>
	<div class="multi-gpu-config">
		<!-- GPU Information Panel -->
		<div v-if="gpuInfo" class="gpu-info-panel mb-4">
			<!-- GPU List -->
			<div class="gpu-list">
				<h4 class="text-sm font-medium text-gray-700 mb-3">Available GPUs</h4>
				<div class="gpu-list-container">
					<div
						v-for="gpu in gpuInfo.gpus"
						:key="gpu.index"
						class="gpu-card"
						:class="{
							'gpu-card--selected': selectedGPUs.includes(gpu.index),
							'gpu-card--selectable': !selectedGPUs.includes(gpu.index) && isGPUSelectable(gpu),
							'gpu-card--override': !selectedGPUs.includes(gpu.index) && isGPUSelectable(gpu) && !isGPUSuitable(gpu) && forceMemoryOverride,
							'gpu-card--disabled': !isGPUSelectable(gpu)
						}"
						@click="isGPUSelectable(gpu) && toggleGPU(gpu.index)"
					>
						<div class="gpu-card-content">
							<!-- Checkbox -->
							<div class="gpu-checkbox">
								<el-checkbox 
									:model-value="selectedGPUs.includes(gpu.index)"
									:disabled="!isGPUSelectable(gpu)"
									@click.stop
									@change="() => toggleGPU(gpu.index)"
								/>
							</div>

							<!-- GPU Index & Name -->
							<div class="gpu-info">
								<el-tooltip content="GPU Index" placement="top">
									<el-tag size="small" type="info" class="gpu-index-tag">
										GPU {{ gpu.index }}
									</el-tag>
								</el-tooltip>
								<el-tooltip :content="gpu.name || 'Unknown GPU'" placement="top">
									<span class="gpu-name">
										{{ (gpu.name || 'Unknown').replace('NVIDIA GeForce ', '').replace('NVIDIA ', '') }}
									</span>
								</el-tooltip>
							</div>

							<!-- Status -->
							<div class="gpu-status">
								<el-tag 
									:type="getGPUStatusType(gpu)" 
									size="small"
									class="status-tag"
								>
									{{ getGPUStatus(gpu) }}
								</el-tag>
							</div>

							<!-- Memory -->
							<div class="gpu-memory">
								<el-tooltip 
									:content="`Memory: ${formatMemory(gpu.memory_used_mb || 0)} / ${formatMemory(gpu.memory_total_mb || 0)} used`" 
									placement="top"
								>
									<div class="metric-display">
										<el-icon class="metric-icon memory-icon">
											<Monitor />
										</el-icon>
										<span class="metric-value">{{ formatMemory(gpu.memory_free_mb || 0) }}</span>
									</div>
								</el-tooltip>
							</div>

							<!-- Temperature -->
							<div class="gpu-temperature">
								<el-tooltip 
									:content="gpu.temperature_celsius ? `Temperature: ${gpu.temperature_celsius}°C` : 'Temperature not available'" 
									placement="top"
								>
									<div class="metric-display">
										<el-icon 
											class="metric-icon"
											:class="getTemperatureIconClass(gpu.temperature_celsius)"
										>
											<Star />
										</el-icon>
										<span class="metric-value">
											{{ gpu.temperature_celsius ? `${gpu.temperature_celsius}°C` : 'N/A' }}
										</span>
									</div>
								</el-tooltip>
							</div>

							<!-- Utilization -->
							<div class="gpu-utilization">
								<el-tooltip 
									:content="gpu.utilization_percent !== null ? `GPU Utilization: ${gpu.utilization_percent}%` : 'Utilization not available'" 
									placement="top"
								>
									<div class="metric-display">
										<el-icon 
											class="metric-icon"
											:class="getUtilizationIconClass(gpu.utilization_percent)"
										>
											<TrendCharts />
										</el-icon>
										<span class="metric-value">
											{{ gpu.utilization_percent !== null ? `${gpu.utilization_percent}%` : 'N/A' }}
										</span>
									</div>
								</el-tooltip>
							</div>

							<!-- Power -->
							<div class="gpu-power">
								<el-tooltip 
									:content="gpu.power_draw_watts ? `Power: ${gpu.power_draw_watts}W / ${gpu.power_limit_watts || 'Unknown'}W` : 'Power info not available'" 
									placement="top"
								>
									<div class="metric-display">
										<el-icon class="metric-icon power-icon">
											<Lightning />
										</el-icon>
										<span class="metric-value">
											{{ gpu.power_draw_watts ? `${gpu.power_draw_watts}W` : 'N/A' }}
										</span>
									</div>
								</el-tooltip>
							</div>

							<!-- Memory Usage Bar -->
							<div class="gpu-memory-bar">
								<el-tooltip 
									:content="`Memory Usage: ${((gpu.memory_used_mb || 0) / (gpu.memory_total_mb || 1) * 100).toFixed(1)}%`" 
									placement="top"
								>
									<div class="memory-bar">
										<div 
											class="memory-bar-fill"
											:class="getMemoryBarClass(gpu)"
											:style="{ 
												width: `${Math.min(100, (gpu.memory_used_mb || 0) / (gpu.memory_total_mb || 1) * 100)}%`
											}"
										></div>
									</div>
								</el-tooltip>
							</div>

							<!-- Compatibility Check -->
							<div class="gpu-compatibility">
								<el-tooltip 
									:content="`Required: ${formatMemory(getEffectiveMemoryRequirement())} | Available: ${formatMemory(gpu.memory_free_mb || 0)}`" 
									placement="top"
								>
									<el-icon 
										class="compatibility-icon"
										:class="getCompatibilityIconClass(gpu)"
									>
										<CircleCheck v-if="isGPUSuitable(gpu)" />
										<Warning v-else-if="isGPUSelectable(gpu)" />
										<CircleClose v-else />
									</el-icon>
								</el-tooltip>
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
import { 
	Loading, 
	Warning, 
	Refresh, 
	Check, 
	StarFilled,
	Monitor,
	Star,
	TrendCharts,
	Lightning,
	CircleCheck,
	CircleClose
} from '@element-plus/icons-vue';
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

const getTemperatureIconClass = (temperature: number | null): string => {
	if (!temperature) return 'temperature-unknown';
	if (temperature < 70) return 'temperature-good';
	if (temperature >= 70 && temperature < 85) return 'temperature-warning';
	return 'temperature-danger';
};

const getUtilizationIconClass = (utilization: number | null): string => {
	if (utilization === null) return 'utilization-unknown';
	if (utilization < 50) return 'utilization-good';
	if (utilization >= 50 && utilization < 90) return 'utilization-warning';
	return 'utilization-danger';
};

const getMemoryBarClass = (gpu: GPUInfo): string => {
	const usage = (gpu.memory_used_mb || 0) / (gpu.memory_total_mb || 1);
	if (usage < 0.5) return 'memory-bar-good';
	if (usage >= 0.5 && usage < 0.8) return 'memory-bar-warning';
	return 'memory-bar-danger';
};

const getCompatibilityIconClass = (gpu: GPUInfo): string => {
	if (isGPUSuitable(gpu)) return 'compatibility-good';
	if (isGPUSelectable(gpu) && forceMemoryOverride.value) return 'compatibility-warning';
	return 'compatibility-danger';
};

const getGPUStatusType = (gpu: GPUInfo): 'success' | 'warning' | 'danger' => {
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

/* GPU List Container */
.gpu-list-container {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

/* GPU Card Styles */
.gpu-card {
	padding: 20px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s ease;
	background-color: #ffffff;
}

.gpu-card--selected {
	border-color: #3b82f6;
	background-color: #eff6ff;
}

.gpu-card--selectable {
	border-color: #d1d5db;
}

.gpu-card--override {
	border-color: #fbbf24;
	background-color: #fffbeb;
}

.gpu-card--disabled {
	border-color: #fca5a5;
	background-color: #fef2f2;
	opacity: 0.7;
	cursor: not-allowed;
}

/* GPU Card Content Layout */
.gpu-card-content {
	display: flex;
	align-items: center;
	width: 100%;
	gap: 20px;
}

/* Individual sections */
.gpu-checkbox {
	flex-shrink: 0;
}

.gpu-info {
	flex: 1;
	min-width: 180px;
	display: flex;
	align-items: center;
	gap: 12px;
}

.gpu-status {
	flex: 0 0 100px;
	text-align: center;
}

.gpu-memory,
.gpu-temperature,
.gpu-utilization,
.gpu-power {
	flex: 0 0 90px;
	text-align: center;
}

.gpu-memory-bar {
	flex: 0 0 70px;
	display: flex;
	justify-content: center;
}

.gpu-compatibility {
	flex-shrink: 0;
}

/* Text and Tag Styles */
.gpu-index-tag {
	font-family: monospace;
	font-size: 14px;
}

.gpu-name {
	font-size: 16px;
	font-weight: 500;
	color: #374151;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.status-tag {
	font-size: 14px;
}

/* Metric Display */
.metric-display {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
}

.metric-icon {
	font-size: 16px;
}

.metric-value {
	font-size: 14px;
	color: #6b7280;
	font-weight: 500;
}

/* Icon Colors */
.memory-icon {
	color: #3b82f6;
}

.power-icon {
	color: #f97316;
}

.temperature-good {
	color: #10b981;
}

.temperature-warning {
	color: #f59e0b;
}

.temperature-danger {
	color: #ef4444;
}

.temperature-unknown {
	color: #9ca3af;
}

.utilization-good {
	color: #10b981;
}

.utilization-warning {
	color: #f59e0b;
}

.utilization-danger {
	color: #ef4444;
}

.utilization-unknown {
	color: #9ca3af;
}

/* Memory Bar */
.memory-bar {
	width: 60px;
	height: 10px;
	background-color: #e5e7eb;
	border-radius: 5px;
	overflow: hidden;
}

.memory-bar-fill {
	height: 100%;
	border-radius: 5px;
	transition: all 0.3s ease;
}

.memory-bar-good {
	background-color: #10b981;
}

.memory-bar-warning {
	background-color: #f59e0b;
}

.memory-bar-danger {
	background-color: #ef4444;
}

/* Compatibility Icons */
.compatibility-icon {
	font-size: 20px;
}

.compatibility-good {
	color: #10b981;
}

.compatibility-warning {
	color: #f59e0b;
}

.compatibility-danger {
	color: #ef4444;
}

/* Error Panel */
.error-panel {
	background-color: #fef2f2;
}

/* Memory Estimation */
.memory-estimation {
	background-color: #eff6ff;
}

/* Configuration Options */
.config-options > div {
	padding: 16px 0;
	border-bottom: 1px solid #f3f4f6;
}

.config-options > div:last-child {
	border-bottom: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
	.gpu-card-content {
		gap: 12px;
	}
	
	.gpu-memory,
	.gpu-temperature,
	.gpu-utilization,
	.gpu-power {
		flex: 0 0 70px;
	}
	
	.metric-value {
		font-size: 13px;
	}
}

@media (max-width: 768px) {
	.gpu-card {
		padding: 16px;
	}
	
	.gpu-card-content {
		flex-wrap: wrap;
		gap: 8px;
	}
	
	.gpu-info {
		min-width: 140px;
	}
	
	.gpu-memory,
	.gpu-temperature,
	.gpu-utilization,
	.gpu-power {
		flex: 0 0 60px;
	}
	
	.metric-value {
		font-size: 12px;
	}
	
	.gpu-name {
		font-size: 15px;
	}
}
</style>