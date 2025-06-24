<!--
 * @Author: Claude Code Assistant
 * @Date: 2025-01-24
 * @Description: Enhanced Multi-GPU Monitor for distributed training
-->
<template>
	<div v-if="isMultiGPUTraining || showAdvanced" class="multi-gpu-monitor">
		<!-- Compact View (default) -->
		<div v-if="!expandedView" class="compact-view">
			<div class="multi-gpu-summary">
				<div class="summary-item">
					<div class="summary-label">GPUs</div>
					<div class="summary-value">{{ activeGPUs.length }}</div>
				</div>
				<div class="summary-item">
					<div class="summary-label">Avg Memory</div>
					<div class="summary-value">{{ averageMemoryUsage }}%</div>
				</div>
				<div class="summary-item">
					<div class="summary-label">Avg Power</div>
					<div class="summary-value">{{ averagePowerUsage }}%</div>
				</div>
				<div class="summary-item">
					<div class="summary-label">Max Temp</div>
					<div class="summary-value">{{ maxTemperature }}°C</div>
				</div>
			</div>
			
			<!-- Expand Button -->
			<div class="expand-controls">
				<el-button size="small" text @click="expandedView = true">
					<el-icon><ArrowDown /></el-icon>
					Details
				</el-button>
			</div>
		</div>

		<!-- Expanded View -->
		<div v-else class="expanded-view">
			<div class="header">
				<h4 class="title">Multi-GPU Training Monitor</h4>
				<div class="header-controls">
					<el-button size="small" @click="refreshGPUData" :loading="refreshing">
						<el-icon><Refresh /></el-icon>
					</el-button>
					<el-button size="small" text @click="expandedView = false">
						<el-icon><ArrowUp /></el-icon>
						Collapse
					</el-button>
				</div>
			</div>

			<!-- GPU Grid -->
			<div class="gpu-grid">
				<div 
					v-for="gpu in activeGPUs" 
					:key="gpu.index"
					class="gpu-card"
					:class="{
						'gpu-warning': getGPUWarningLevel(gpu) === 'warning',
						'gpu-critical': getGPUWarningLevel(gpu) === 'critical'
					}"
				>
					<div class="gpu-header">
						<span class="gpu-id">GPU {{ gpu.index }}</span>
						<span class="gpu-status" :class="getGPUStatusClass(gpu)">
							{{ getGPUStatusText(gpu) }}
						</span>
					</div>
					
					<div class="gpu-name">{{ gpu.name }}</div>
					
					<!-- Memory Usage -->
					<div class="metric">
						<div class="metric-header">
							<span class="metric-label">Memory</span>
							<span class="metric-value">{{ formatMemory(gpu.memory_used_mb) }} / {{ formatMemory(gpu.memory_total_mb) }}</span>
						</div>
						<div class="progress-container">
							<div class="progress-bar">
								<div 
									class="progress-fill memory"
									:style="{ width: `${gpu.memory_utilization_percent}%` }"
								></div>
							</div>
							<span class="progress-text">{{ Math.round(gpu.memory_utilization_percent) }}%</span>
						</div>
					</div>

					<!-- Power Usage -->
					<div v-if="gpu.power_limit_watts > 0" class="metric">
						<div class="metric-header">
							<span class="metric-label">Power</span>
							<span class="metric-value">{{ Math.round(gpu.power_draw_watts) }}W / {{ Math.round(gpu.power_limit_watts) }}W</span>
						</div>
						<div class="progress-container">
							<div class="progress-bar">
								<div 
									class="progress-fill power"
									:style="{ width: `${gpu.power_utilization_percent}%` }"
								></div>
							</div>
							<span class="progress-text">{{ Math.round(gpu.power_utilization_percent) }}%</span>
						</div>
					</div>

					<!-- Temperature & Utilization -->
					<div class="secondary-metrics">
						<div v-if="gpu.temperature_celsius" class="secondary-metric">
							<span class="secondary-label">Temp:</span>
							<span class="secondary-value" :class="{ 'high-temp': gpu.temperature_celsius > 80 }">
								{{ gpu.temperature_celsius }}°C
							</span>
						</div>
						<div v-if="gpu.utilization_percent !== null" class="secondary-metric">
							<span class="secondary-label">Load:</span>
							<span class="secondary-value">{{ gpu.utilization_percent }}%</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Training Statistics -->
			<div v-if="isTraining" class="training-stats">
				<div class="stats-grid">
					<div class="stat-item">
						<span class="stat-label">Total Memory Used:</span>
						<span class="stat-value">{{ formatMemory(totalMemoryUsed) }}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Total Power Draw:</span>
						<span class="stat-value">{{ Math.round(totalPowerDraw) }}W</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Memory Efficiency:</span>
						<span class="stat-value">{{ memoryEfficiency }}%</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Training Time:</span>
						<span class="stat-value">{{ formatTrainingTime }}</span>
					</div>
				</div>
			</div>

			<!-- Alerts -->
			<div v-if="alerts.length > 0" class="alerts">
				<el-alert
					v-for="alert in alerts"
					:key="alert.id"
					:title="alert.title"
					:type="alert.type"
					:description="alert.description"
					:closable="false"
					show-icon
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowDown, ArrowUp, Refresh } from '@element-plus/icons-vue';
import { gpuApi } from '@/api/gpu';
import type { GPUInfo } from '@/api/gpu/types';
import { useTrainingStore } from '@/stores';

// Props
interface Props {
	gpuIds?: number[];
	autoRefresh?: boolean;
	refreshInterval?: number;
	showAdvanced?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	gpuIds: () => [],
	autoRefresh: true,
	refreshInterval: 3000,
	showAdvanced: false
});

// State
const expandedView = ref(false);
const refreshing = ref(false);
const gpuData = ref<GPUInfo[]>([]);
const refreshTimer = ref<NodeJS.Timeout | null>(null);
const trainingStartTime = ref<Date | null>(null);

// Store
const trainingStore = useTrainingStore();

// Computed
const isMultiGPUTraining = computed(() => {
	return props.gpuIds.length > 1 || props.showAdvanced;
});

const isTraining = computed(() => {
	return trainingStore.currentTaskId !== null;
});

const activeGPUs = computed(() => {
	if (props.gpuIds.length === 0) {
		return gpuData.value;
	}
	return gpuData.value.filter(gpu => props.gpuIds.includes(gpu.index));
});

const averageMemoryUsage = computed(() => {
	if (activeGPUs.value.length === 0) return 0;
	const total = activeGPUs.value.reduce((sum, gpu) => sum + gpu.memory_utilization_percent, 0);
	return Math.round(total / activeGPUs.value.length);
});

const averagePowerUsage = computed(() => {
	if (activeGPUs.value.length === 0) return 0;
	const validGPUs = activeGPUs.value.filter(gpu => gpu.power_limit_watts > 0);
	if (validGPUs.length === 0) return 0;
	const total = validGPUs.reduce((sum, gpu) => sum + gpu.power_utilization_percent, 0);
	return Math.round(total / validGPUs.length);
});

const maxTemperature = computed(() => {
	const temps = activeGPUs.value
		.map(gpu => gpu.temperature_celsius)
		.filter(temp => temp !== null) as number[];
	return temps.length > 0 ? Math.max(...temps) : 0;
});

const totalMemoryUsed = computed(() => {
	return activeGPUs.value.reduce((sum, gpu) => sum + gpu.memory_used_mb, 0);
});

const totalPowerDraw = computed(() => {
	return activeGPUs.value.reduce((sum, gpu) => sum + gpu.power_draw_watts, 0);
});

const memoryEfficiency = computed(() => {
	const totalMemory = activeGPUs.value.reduce((sum, gpu) => sum + gpu.memory_total_mb, 0);
	if (totalMemory === 0) return 0;
	return Math.round((totalMemoryUsed.value / totalMemory) * 100);
});

const formatTrainingTime = computed(() => {
	if (!trainingStartTime.value) return '00:00:00';
	const diff = Date.now() - trainingStartTime.value.getTime();
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const alerts = computed(() => {
	const alertList: Array<{ id: string; title: string; type: string; description: string }> = [];
	
	activeGPUs.value.forEach(gpu => {
		if (gpu.temperature_celsius && gpu.temperature_celsius > 85) {
			alertList.push({
				id: `temp-${gpu.index}`,
				title: `GPU ${gpu.index} High Temperature`,
				type: 'warning',
				description: `Temperature: ${gpu.temperature_celsius}°C (>85°C)`
			});
		}
		
		if (gpu.memory_utilization_percent > 95) {
			alertList.push({
				id: `memory-${gpu.index}`,
				title: `GPU ${gpu.index} Memory Critical`,
				type: 'error',
				description: `Memory usage: ${Math.round(gpu.memory_utilization_percent)}% (>95%)`
			});
		}
		
		if (gpu.power_utilization_percent > 90) {
			alertList.push({
				id: `power-${gpu.index}`,
				title: `GPU ${gpu.index} High Power Usage`,
				type: 'warning',
				description: `Power usage: ${Math.round(gpu.power_utilization_percent)}% (>90%)`
			});
		}
	});
	
	return alertList;
});

// Methods
const formatMemory = (mb: number): string => {
	if (mb >= 1024) {
		return `${(mb / 1024).toFixed(1)} GB`;
	}
	return `${mb} MB`;
};

const getGPUWarningLevel = (gpu: GPUInfo): 'normal' | 'warning' | 'critical' => {
	if (gpu.memory_utilization_percent > 95 || (gpu.temperature_celsius && gpu.temperature_celsius > 90)) {
		return 'critical';
	}
	if (gpu.memory_utilization_percent > 85 || (gpu.temperature_celsius && gpu.temperature_celsius > 80) || gpu.power_utilization_percent > 90) {
		return 'warning';
	}
	return 'normal';
};

const getGPUStatusClass = (gpu: GPUInfo): string => {
	const level = getGPUWarningLevel(gpu);
	return `status-${level}`;
};

const getGPUStatusText = (gpu: GPUInfo): string => {
	const level = getGPUWarningLevel(gpu);
	switch (level) {
		case 'critical': return 'Critical';
		case 'warning': return 'Warning';
		default: return 'Normal';
	}
};

const refreshGPUData = async () => {
	if (refreshing.value) return;
	
	refreshing.value = true;
	try {
		const response = await gpuApi.getGPUInfo();
		gpuData.value = response.gpus;
	} catch (error: any) {
		console.error('Failed to refresh GPU data:', error);
		ElMessage.error('Failed to refresh GPU data');
	} finally {
		refreshing.value = false;
	}
};

const startAutoRefresh = () => {
	if (!props.autoRefresh) return;
	
	refreshTimer.value = setInterval(() => {
		refreshGPUData();
	}, props.refreshInterval);
};

const stopAutoRefresh = () => {
	if (refreshTimer.value) {
		clearInterval(refreshTimer.value);
		refreshTimer.value = null;
	}
};

// Lifecycle
onMounted(() => {
	refreshGPUData();
	startAutoRefresh();
	
	// Set training start time if training is active
	if (isTraining.value) {
		trainingStartTime.value = new Date();
	}
});

onUnmounted(() => {
	stopAutoRefresh();
});

// Watch for training state changes
watch(() => isTraining.value, (newValue) => {
	if (newValue) {
		trainingStartTime.value = new Date();
	} else {
		trainingStartTime.value = null;
	}
});
</script>

<style scoped>
.multi-gpu-monitor {
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	background-color: #ffffff;
	overflow: hidden;
}

.compact-view {
	padding: 12px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.multi-gpu-summary {
	display: flex;
	gap: 20px;
}

.summary-item {
	text-align: center;
}

.summary-label {
	font-size: 12px;
	color: #6b7280;
	margin-bottom: 2px;
}

.summary-value {
	font-size: 16px;
	font-weight: 600;
	color: #111827;
}

.expand-controls {
	display: flex;
	align-items: center;
}

.expanded-view {
	padding: 16px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid #e5e7eb;
}

.title {
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #111827;
}

.header-controls {
	display: flex;
	gap: 8px;
}

.gpu-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 16px;
	margin-bottom: 16px;
}

.gpu-card {
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 12px;
	background-color: #f9fafb;
	transition: all 0.2s ease;
}

.gpu-card.gpu-warning {
	border-color: #f59e0b;
	background-color: #fffbeb;
}

.gpu-card.gpu-critical {
	border-color: #ef4444;
	background-color: #fef2f2;
}

.gpu-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.gpu-id {
	font-weight: 600;
	color: #111827;
}

.gpu-status {
	padding: 2px 8px;
	border-radius: 12px;
	font-size: 11px;
	font-weight: 500;
}

.status-normal {
	background-color: #dcfce7;
	color: #166534;
}

.status-warning {
	background-color: #fef3c7;
	color: #92400e;
}

.status-critical {
	background-color: #fecaca;
	color: #991b1b;
}

.gpu-name {
	font-size: 12px;
	color: #6b7280;
	margin-bottom: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.metric {
	margin-bottom: 12px;
}

.metric-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 4px;
}

.metric-label {
	font-size: 12px;
	font-weight: 500;
	color: #374151;
}

.metric-value {
	font-size: 11px;
	color: #6b7280;
}

.progress-container {
	display: flex;
	align-items: center;
	gap: 8px;
}

.progress-bar {
	flex: 1;
	height: 6px;
	background-color: #e5e7eb;
	border-radius: 3px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	border-radius: 3px;
	transition: width 0.3s ease;
}

.progress-fill.memory {
	background-color: #3b82f6;
}

.progress-fill.power {
	background-color: #10b981;
}

.progress-text {
	font-size: 10px;
	color: #6b7280;
	min-width: 30px;
	text-align: right;
}

.secondary-metrics {
	display: flex;
	gap: 12px;
}

.secondary-metric {
	font-size: 11px;
}

.secondary-label {
	color: #6b7280;
}

.secondary-value {
	color: #111827;
	font-weight: 500;
}

.high-temp {
	color: #dc2626 !important;
}

.training-stats {
	margin-bottom: 16px;
	padding: 12px;
	background-color: #f3f4f6;
	border-radius: 6px;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 12px;
}

.stat-item {
	display: flex;
	justify-content: space-between;
}

.stat-label {
	font-size: 12px;
	color: #6b7280;
}

.stat-value {
	font-size: 12px;
	font-weight: 600;
	color: #111827;
}

.alerts {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

:deep(.el-alert) {
	margin: 0;
}

@media (max-width: 768px) {
	.gpu-grid {
		grid-template-columns: 1fr;
	}
	
	.multi-gpu-summary {
		gap: 12px;
	}
	
	.stats-grid {
		grid-template-columns: 1fr;
	}
}
</style>