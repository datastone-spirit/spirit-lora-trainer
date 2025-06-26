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
				<h4 class="gpu-list-title">可用GPU 列表</h4>
				<div class="gpu-list-container">
					<div
						v-for="gpu in gpuInfo.gpus"
						:key="gpu.index"
						class="gpu-card"
						:class="{
							'gpu-card--selected': selectedGPUs.includes(gpu.index),
							'gpu-card--selectable': !selectedGPUs.includes(gpu.index) && isGPUSelectable(gpu, false),
							'gpu-card--override': !selectedGPUs.includes(gpu.index) && isGPUSelectable(gpu, false) && !isGPUSuitable(gpu) && forceMemoryOverride,
							'gpu-card--disabled': !isGPUSelectable(gpu, false)
						}"
						@click="isGPUSelectable(gpu, false) && toggleGPU(gpu.index)"
					>
						<div class="gpu-card-content">
							<!-- Checkbox -->
							<div class="gpu-checkbox">
								<el-checkbox 
									:model-value="selectedGPUs.includes(gpu.index)"
									:disabled="!isGPUSelectable(gpu, false)"
									@click.stop
									@change="() => toggleGPU(gpu.index)"
								/>
							</div>

							<!-- GPU Index & Name -->
							<div class="gpu-info">
								<el-tooltip content="GPU索引" placement="top">
									<el-tag size="small" type="info" class="gpu-index-tag">
										GPU {{ gpu.index }}
									</el-tag>
								</el-tooltip>
								<el-tooltip :content="gpu.name || '未知GPU'" placement="top">
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
									:content="`内存: ${formatMemory(gpu.memory_used_mb || 0)} / ${formatMemory(gpu.memory_total_mb || 0)} 已使用`" 
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
									:content="gpu.temperature_celsius ? `温度: ${gpu.temperature_celsius}°C` : '温度不可用'" 
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
									:content="gpu.utilization_percent !== null ? `GPU使用率: ${gpu.utilization_percent}%` : '使用率不可用'" 
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
									:content="gpu.power_draw_watts ? `功耗: ${gpu.power_draw_watts}W / ${gpu.power_limit_watts || '未知'}W` : '功耗信息不可用'" 
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
									:content="`内存使用率: ${((gpu.memory_used_mb || 0) / (gpu.memory_total_mb || 1) * 100).toFixed(1)}%`" 
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
									:content="shouldDisableValidation ? '训练状态' : `需要: ${formatMemory(getEffectiveMemoryRequirement())} | 可用: ${formatMemory(gpu.memory_free_mb || 0)}`" 
									placement="top"
								>
									<el-icon 
										class="compatibility-icon"
										:class="getCompatibilityIconClass(gpu)"
									>
										<CircleCheck v-if="shouldDisableValidation ? selectedGPUs.includes(gpu.index) : isGPUSuitable(gpu)" />
										<Warning v-else-if="shouldDisableValidation ? !selectedGPUs.includes(gpu.index) : isGPUSelectable(gpu, false)" />
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
		<div v-else-if="loading" class="loading-state">
			<el-icon class="is-loading loading-icon">
				<Loading />
			</el-icon>
			<div class="loading-text">正在加载GPU信息...</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="error-panel">
			<div class="error-header">
				<el-icon><Warning /></el-icon>
				<span class="error-title">加载GPU信息失败</span>
			</div>
			<div class="error-message">{{ error }}</div>
			<el-button size="small" @click="loadGPUInfo">重试</el-button>
		</div>

		<!-- Configuration Options -->
		<div class="config-options">

			<!-- Manual GPU Selection -->
			<div v-if="!ruleForm.auto_gpu_selection && gpuInfo" class="manual-selection">
				<PopoverFormItem 
					:label="`已选择GPU: ${selectedGPUs.length}`"
					prop="gpu_ids"
				>
					<div v-if="shouldDisableValidation" class="training-notice">
						<el-alert
							title="训练进行中，GPU配置已从训练任务中恢复"
							type="info"
							show-icon
							:closable="false"
						/>
					</div>
					<div v-if="validationResult && !validationResult.is_valid && !shouldDisableValidation" class="validation-error">
						<el-alert
							:title="validationResult.error_message || '验证失败'"
							type="error"
							show-icon
							:closable="false"
						/>
					</div>
				</PopoverFormItem>
			</div>

			<!-- GPU Count (for auto selection) -->
			<div v-if="ruleForm.auto_gpu_selection" class="gpu-count">
				<PopoverFormItem 
					label="GPU数量"
					prop="num_gpus"
				>
					<el-input-number
						v-model="ruleForm.num_gpus"
						:min="1"
						:max="gpuInfo ? gpuInfo.total_gpus : 8"
						@change="handleGPUCountChange"
					/>
				</PopoverFormItem>
			</div>

			<!-- Distributed Backend -->
			<PopoverFormItem
				label="分布式后端"
				prop="distributed_backend"
			>
				<el-select v-model="ruleForm.distributed_backend">
					<el-option label="NCCL (推荐NVIDIA GPU使用)" value="nccl" />
					<el-option label="Gloo (CPU和GPU)" value="gloo" />
					<el-option label="MPI" value="mpi" />
				</el-select>
			</PopoverFormItem>

			<!-- Gradient Sync Interval -->
			<PopoverFormItem
				label="每N步进行梯度同步"
				prop="gradient_sync_every_n_steps"
			>
				<el-input-number
					v-model="ruleForm.gradient_sync_every_n_steps"
					:min="1"
					:max="100"
				/>
			</PopoverFormItem>
		</div>

		<!-- Actions -->
		<div class="actions">
			<el-button @click="refreshGPUInfo" :loading="loading">
				<el-icon><Refresh /></el-icon>
				刷新GPU信息
			</el-button>
			<el-button
				v-if="gpuInfo && selectedGPUs.length > 0"
				@click="validateConfiguration"
				:loading="validating"
			>
				<el-icon><Check /></el-icon>
				验证配置
			</el-button>
			<el-button
				v-if="gpuInfo && ruleForm.auto_gpu_selection"
				@click="selectOptimalGPUs"
				:loading="optimizing"
			>
				<el-icon><StarFilled /></el-icon>
				选择最佳GPU
			</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
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
import { useTrainingStore } from '@/stores';
import { useFluxLora } from '@/hooks/task/useFluxLora';
import PopoverFormItem from '@/components/Form/PopoverFormItem.vue';

// Props
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

// Emits
const emit = defineEmits<{
	gpuSelectionChanged: [gpuIds: number[]];
	configurationRestored: [config: any];
}>();

// Training store for checking current task status
const trainingStore = useTrainingStore();

// State
const gpuInfo = ref<GPUInfoResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const validating = ref(false);
const optimizing = ref(false);
const validationResult = ref<GPUValidationResponse | null>(null);
const memoryEstimation = ref<MemoryEstimationResponse | null>(null);
const forceMemoryOverride = ref(false);

// Training status computed properties
const isTraining = computed(() => trainingStore.hasRunningTask);
const isFluxTraining = computed(() => trainingStore.isFluxTraining);
const shouldDisableValidation = computed(() => isTraining.value && isFluxTraining.value);

// Fallback GPU info when API is not available
const getFallbackGPUInfo = () => {
	return {
		total_gpus: 1,
		system_info: {
			driver_version: '不可用',
			cuda_version: '不可用',
			gpu_count: 1,
			total_gpu_memory_mb: 8192
		},
		gpus: [
			{
				index: 0,
				name: 'GPU (接口不可用)',
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

const isGPUSelectable = (gpu: GPUInfo, forceAllow: boolean = false): boolean => {
	if (!gpu) return false;
	
	// During training, disable manual GPU selection but allow programmatic selection for restoration
	if (shouldDisableValidation.value && !forceAllow) {
		return false;
	}
	
	const memoryFree = gpu.memory_free_mb || 0;
	const temperature = gpu.temperature_celsius;
	const utilization = gpu.utilization_percent;
	
	// Always allow selection if force override is enabled (with minimal safety checks)
	if (forceMemoryOverride.value) {
		return memoryFree >= 2000 && // Minimum 2GB  
			   (temperature === undefined || temperature === null || temperature < 90) &&
			   (utilization === undefined || utilization === null || utilization < 98);
	}
	
	// If forceAllow is true (during training restoration), skip resource constraints
	if (forceAllow) {
		return true;
	}
	
	// Otherwise use the normal suitability check
	return isGPUSuitable(gpu);
};

const getGPUStatus = (gpu: GPUInfo): string => {
	if (!gpu) return '未知';
	
	const memoryFree = gpu.memory_free_mb || 0;
	const memoryRequired = getEffectiveMemoryRequirement();
	
	// During training, show special status for selected GPUs
	if (shouldDisableValidation.value) {
		if (selectedGPUs.value.includes(gpu.index)) {
			return '训练中';
		}
		return '不可用 (训练中)';
	}
	
	// Check if GPU is selectable first
	if (!isGPUSelectable(gpu, false)) {
		if (memoryFree < 2000) {
			return '内存严重不足';
		}
		if (gpu.temperature_celsius && gpu.temperature_celsius >= 90) {
			return '温度过高';
		}
		if (gpu.utilization_percent && gpu.utilization_percent >= 98) {
			return '使用率过高';
		}
		return '不可用';
	}
	
	// If selectable but not suitable under normal conditions
	if (!isGPUSuitable(gpu)) {
		if (forceMemoryOverride.value) {
			return '可用 (强制覆盖)';
		} else {
			if (memoryFree < memoryRequired) {
				return '内存不足';
			}
			if (gpu.temperature_celsius && gpu.temperature_celsius >= 85) {
				return '温度过高';
			}
			if (gpu.utilization_percent && gpu.utilization_percent >= 90) {
				return '使用率过高';
			}
			return '不适合';
		}
	}
	
	return '可用';
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
	// During training, show as compatible if selected, warning if not selected
	if (shouldDisableValidation.value) {
		return selectedGPUs.value.includes(gpu.index) ? 'compatibility-good' : 'compatibility-warning';
	}
	
	if (isGPUSuitable(gpu)) return 'compatibility-good';
	if (isGPUSelectable(gpu, false) && forceMemoryOverride.value) return 'compatibility-warning';
	return 'compatibility-danger';
};

const getGPUStatusType = (gpu: GPUInfo): 'success' | 'warning' | 'danger' => {
	// During training, show success for selected GPUs, warning for others
	if (shouldDisableValidation.value) {
		return selectedGPUs.value.includes(gpu.index) ? 'success' : 'warning';
	}
	
	if (isGPUSuitable(gpu)) {
		return 'success';
	}
	if (isGPUSelectable(gpu, false)) {
		return forceMemoryOverride.value ? 'warning' : 'danger';
	}
	return 'danger';
};

const toggleGPU = (gpuIndex: number) => {
	// During training, don't allow changing GPU selection
	if (shouldDisableValidation.value) {
		return;
	}
	
	const currentSelected = [...selectedGPUs.value];
	const index = currentSelected.indexOf(gpuIndex);
	
	if (index > -1) {
		currentSelected.splice(index, 1);
	} else {
		currentSelected.push(gpuIndex);
	}
	
	selectedGPUs.value = currentSelected.sort((a, b) => a - b);
	validateCurrentSelection();
	
	// Emit GPU selection change
	emit('gpuSelectionChanged', selectedGPUs.value);
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
				driver_version: '未知',
				cuda_version: '未知',
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
			error.value = 'GPU监控服务不可用。使用默认配置。';
			ElMessage.warning('GPU监控服务不可用。您仍可以配置多GPU训练。');
		} else {
			error.value = '无法加载实时GPU信息。使用默认配置。';
			ElMessage.warning('无法加载实时GPU信息。使用默认配置。');
		}
	} finally {
		loading.value = false;
	}
};

const refreshGPUInfo = () => {
	loadGPUInfo();
};

const validateConfiguration = async () => {
	// Skip validation during training
	if (shouldDisableValidation.value) {
		ElMessage.info('训练期间禁用GPU验证');
		return;
	}
	
	if (!selectedGPUs.value.length) {
		ElMessage.warning('请至少选择一个GPU');
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
				? 'GPU配置有效 (内存检查已覆盖)'
				: 'GPU配置有效';
			ElMessage.success(message);
		} else {
			ElMessage.error(validationResult.value.error_message || 'GPU配置无效');
		}
	} catch (err: any) {
		ElMessage.error('验证GPU配置失败');
	} finally {
		validating.value = false;
	}
};

const validateCurrentSelection = () => {
	// Skip validation during training
	if (shouldDisableValidation.value) {
		return;
	}
	
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
	ElMessage.success(`已选择最佳GPU: ${response.optimal_gpu_ids.join(', ')}`);
	
	// Emit GPU selection change
	emit('gpuSelectionChanged', selectedGPUs.value);
	
	// Validate the selection
	validateCurrentSelection();
	} catch (err: any) {
		ElMessage.error('选择最佳GPU失败: ' + err.message);
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
		console.warn('估计内存需求失败:', err);
	}
};

const selectAllSuitableGPUs = async () => {
	if (!gpuInfo.value || !gpuInfo.value.gpus) return;
	
	try {
		let suitableGPUs: any[];
		
		// During training, try to detect which GPUs are actually being used
		if (shouldDisableValidation.value) {
			// First, try to detect GPUs that are actively being used for training
			// Look for GPUs with high utilization or significant memory usage
			const activeGPUs = gpuInfo.value.gpus.filter(gpu => {
				const utilization = gpu.utilization_percent || 0;
				const memoryUsage = (gpu.memory_used_mb || 0) / (gpu.memory_total_mb || 1);
				
				// Consider a GPU active if it has high utilization OR significant memory usage
				return utilization > 30 || memoryUsage > 0.3;
			});
			
			if (activeGPUs.length > 0) {
				// Use the actively used GPUs
				suitableGPUs = activeGPUs;
				ElMessage.success(`训练期间检测到正在使用的GPU，已选择: ${activeGPUs.map(gpu => gpu.index).join(', ')}`);
			} else {
				// Fallback: if no GPUs show high usage, try to detect GPUs with any usage
				const anyUsageGPUs = gpuInfo.value.gpus.filter(gpu => {
					const utilization = gpu.utilization_percent || 0;
					const memoryUsage = (gpu.memory_used_mb || 0) / (gpu.memory_total_mb || 1);
					
					// Consider a GPU if it has any utilization OR any significant memory usage
					return utilization > 0 || memoryUsage > 0.1;
				});
				
				if (anyUsageGPUs.length > 0) {
					suitableGPUs = anyUsageGPUs;
					ElMessage.success(`训练期间检测到有使用痕迹的GPU，已选择: ${anyUsageGPUs.map(gpu => gpu.index).join(', ')}`);
				} else {
					// Final fallback: select GPU 0 as a conservative choice
					suitableGPUs = [gpuInfo.value.gpus[0]];
					ElMessage.info('训练期间未检测到活跃GPU，已选择GPU 0作为默认选择');
				}
			}
		} else {
			// Normal operation: filter suitable GPUs based on memory and status
			suitableGPUs = gpuInfo.value.gpus.filter(gpu => isGPUSuitable(gpu));
		}
		
		if (suitableGPUs.length === 0) {
			ElMessage.warning('未找到符合条件的GPU');
			return;
		}
		
		// Select all suitable GPUs
		const selectedGPUIDs = suitableGPUs.map(gpu => gpu.index).sort((a, b) => a - b);
		selectedGPUs.value = selectedGPUIDs;
		
		// Emit GPU selection change
		emit('gpuSelectionChanged', selectedGPUs.value);
		
		if (!shouldDisableValidation.value) {
			ElMessage.success(`已选择 ${selectedGPUIDs.length} 个符合条件的GPU: ${selectedGPUIDs.join(', ')}`);
			// Validate the selection only when not in training
			validateCurrentSelection();
		}
	} catch (error: any) {
		console.error('Failed to select suitable GPUs:', error);
		ElMessage.error('选择适合的GPU失败: ' + (error.message || '未知错误'));
	}
};

const restoreGPUConfiguration = (config: any) => {
	if (!config) return;
	
	try {
		// Restore GPU-related configuration
		if (config.gpu_ids && Array.isArray(config.gpu_ids)) {
			// During training, we need to bypass normal GPU selection constraints
			// and directly set the GPU IDs from the configuration
			selectedGPUs.value = config.gpu_ids;
		}
		if (config.num_gpus) {
			ruleForm.value.num_gpus = config.num_gpus;
		}
		if (config.distributed_backend) {
			ruleForm.value.distributed_backend = config.distributed_backend;
		}
		if (config.memory_requirement_mb) {
			ruleForm.value.memory_requirement_mb = config.memory_requirement_mb;
		}
		if (config.gradient_sync_every_n_steps) {
			ruleForm.value.gradient_sync_every_n_steps = config.gradient_sync_every_n_steps;
		}
		if (config.auto_gpu_selection !== undefined) {
			ruleForm.value.auto_gpu_selection = config.auto_gpu_selection;
		}
		
		// Emit configuration restored event
		emit('configurationRestored', config);
		
		// Skip validation during training since GPUs are already in use
		// and won't meet the normal availability criteria
		if (!shouldDisableValidation.value) {
			validateCurrentSelection();
		} else {
			// During training, just show success message without validation
			ElMessage.success(`已恢复GPU配置: ${config.gpu_ids ? config.gpu_ids.join(', ') : '未指定'}`);
		}
	} catch (error: any) {
		console.error('Failed to restore GPU configuration:', error);
		ElMessage.error('恢复GPU配置失败: ' + (error.message || '未知错误'));
	}
};

// Expose methods to parent component
defineExpose({
	selectAllSuitableGPUs,
	restoreGPUConfiguration,
	selectOptimalGPUs,
	validateConfiguration,
	loadGPUInfo
});

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
	
	// Listen for restore config events from flux monitor
	const { fluxLoraMonitor } = useFluxLora();
	
	const handleRestoreConfig = (config: any) => {
		if (config && config.multi_gpu_enabled) {
			// Restore GPU selection from config
			if (config.gpu_ids && Array.isArray(config.gpu_ids)) {
				selectedGPUs.value = config.gpu_ids;
			}
		}
	};
	
	// Add event listener
	fluxLoraMonitor.events.on('restoreConfig', handleRestoreConfig);
	
	// Clean up on unmount
	onUnmounted(() => {
		fluxLoraMonitor.events.off('restoreConfig', handleRestoreConfig);
	});
});
</script>

<style lang="scss" scoped>
.multi-gpu-config {
	max-width: 100%;
}

/* GPU List Title */
.gpu-list-title {
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin-bottom: 24px;
}

/* Loading State */
.loading-state {
	text-align: center;
	padding: 32px 0;
}

.loading-icon {
	margin-bottom: 8px;
}

.loading-text {
	color: #6b7280;
}

/* Error Panel */
.error-panel {
	padding: 16px;
	background-color: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: 8px;
}

.error-header {
	display: flex;
	align-items: center;
	gap: 8px;
	color: #b91c1c;
	margin-bottom: 8px;
}

.error-title {
	font-weight: 500;
}

.error-message {
	color: #dc2626;
	font-size: 14px;
	margin-bottom: 12px;
}

/* Actions */
.actions {
	margin-top: 24px;
	display: flex;
	gap: 12px;
}

/* Configuration Options */
.config-options {
	.manual-selection,
	.gpu-count {
		margin-bottom: 16px;
	}
	
	.training-notice {
		margin-bottom: 8px;
	}
	
	.validation-error {
		margin-top: 8px;
	}
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

/* Memory Estimation */
.memory-estimation {
	background-color: #eff6ff;
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