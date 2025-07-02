<!--
 * @Author: mulingyuer
 * @Date: 2025-06-30 14:19:18
 * @LastEditTime: 2025-07-01 17:16:45
 * @LastEditors: mulingyuer
 * @Description: gpu列表项
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\DistributedTrainingOptions\GPUListItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div
		class="gpu-list-item"
		:class="{
			active: active,
			disabled: disabled,
			override: showOverride
		}"
		@click="onGpuItemClick"
	>
		<div class="gpu-list-item-checkbox" @click.prevent>
			<el-checkbox :model-value="active" />
		</div>
		<div class="gpu-list-item-content">
			<el-tooltip content="GPU索引" placement="top">
				<el-tag size="default" type="info" class="gpu-list-item-index-tag">
					GPU {{ gpuInfo.index }}
				</el-tag>
			</el-tooltip>
			<el-tooltip :content="gpuInfo.name || '未知GPU'" placement="top">
				<span class="gpu-list-item-gpu-name">{{ gpuName }}</span>
			</el-tooltip>
			<el-tag :type="gpuStatusByTagType" size="default" class="gpu-list-item-status-tag">
				{{ gpuStatus }}
			</el-tag>
			<el-tooltip :content="`内存使用率: ${memoryUsagePercent.toFixed(1)}%`" placement="top">
				<el-progress
					class="gpu-list-item-memory-progress"
					:percentage="Math.min(Math.floor(memoryUsagePercent), 100)"
					:color="customProgressColor"
					:show-text="false"
				/>
			</el-tooltip>
			<el-tooltip :content="`内存: ${usedMemory} / ${totalMemory}`" placement="top">
				<div class="gpu-list-item-metric-display">
					<el-icon class="gpu-list-item-metric-icon memory-icon">
						<Monitor />
					</el-icon>
					<span class="gpu-list-item-metric-value">{{ freeMemory }}</span>
				</div>
			</el-tooltip>
			<el-tooltip
				:content="
					gpuInfo.temperature_celsius ? `温度: ${gpuInfo.temperature_celsius}°C` : '温度不可用'
				"
				placement="top"
			>
				<div class="gpu-list-item-metric-display">
					<el-icon class="gpu-list-item-metric-icon" :class="temperatureIconClass">
						<Star />
					</el-icon>
					<span class="gpu-list-item-metric-value">
						{{ gpuInfo.temperature_celsius ? `${gpuInfo.temperature_celsius}°C` : "N/A" }}
					</span>
				</div>
			</el-tooltip>
			<el-tooltip
				:content="
					gpuInfo.utilization_percent !== null
						? `GPU使用率: ${gpuInfo.utilization_percent}%`
						: '使用率不可用'
				"
				placement="top"
			>
				<div class="gpu-list-item-metric-display">
					<el-icon class="gpu-list-item-metric-icon" :class="utilizationIconClass">
						<TrendCharts />
					</el-icon>
					<span class="gpu-list-item-metric-value">
						{{ gpuInfo.utilization_percent !== null ? `${gpuInfo.utilization_percent}%` : "N/A" }}
					</span>
				</div>
			</el-tooltip>
			<el-tooltip
				:content="
					gpuInfo.power_draw_watts
						? `功耗: ${gpuInfo.power_draw_watts}W / ${gpuInfo.power_limit_watts || '未知'}W`
						: '功耗信息不可用'
				"
				placement="top"
			>
				<div class="gpu-list-item-metric-display">
					<el-icon class="gpu-list-item-metric-icon power-icon">
						<Lightning />
					</el-icon>
					<span class="gpu-list-item-metric-value">
						{{ gpuInfo.power_draw_watts ? `${gpuInfo.power_draw_watts}W` : "N/A" }}
					</span>
				</div>
			</el-tooltip>
			<el-tooltip
				:content="
					disabled
						? '训练状态'
						: `需要: ${formatMemory(memoryRequired)} | 可用: ${formatMemory(gpuInfo.memory_free_mb || 0)}`
				"
				placement="top"
			>
				<el-icon class="gpu-list-item-compatibility-icon" :class="compatibilityIconClass">
					<CircleCheck v-if="disabled ? active : isSuitable" />
					<Warning v-else-if="disabled ? !active : isSelectable" />
					<CircleClose v-else />
				</el-icon>
			</el-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GPUInfo } from "@/api/gpu";
import { formatMemory, isGPUSelectable, isGPUSuitable } from "./distributed-training.helper";

const props = defineProps<{
	/** gpu信息 */
	gpuInfo: GPUInfo;
	/** 是否禁用 */
	disabled: boolean;
	/** 是否选中 */
	active: boolean;
	/** 训练需要的内存 */
	memoryRequired: number;
	/** ？？？是否强制覆盖 */
	forceMemoryOverride: boolean;
}>();

const emits = defineEmits<{
	/** 点击 */
	itemClick: [gpuInfo: GPUInfo];
}>();

/** 是否合适 */
const isSuitable = computed(() => {
	const gpuInfo = props.gpuInfo;

	return isGPUSuitable({
		gpuInfo,
		memoryRequired: props.memoryRequired,
		forceMemoryOverride: props.forceMemoryOverride
	});
});

/** 是否可选 */
const isSelectable = computed(() => {
	const gpuInfo = props.gpuInfo;

	return isGPUSelectable({
		gpuInfo,
		memoryRequired: props.memoryRequired,
		forceMemoryOverride: props.forceMemoryOverride,
		shouldDisableValidation: props.disabled
	});
});

/** 显卡名称 */
const gpuName = computed(() => {
	const { name } = props.gpuInfo;
	if (!name) return "Unknown";
	return name.replace("NVIDIA GeForce ", "").replace("NVIDIA ", "");
});

/** 获取显卡状态对应的tag类型 */
const gpuStatusByTagType = computed(() => {
	// 如果显卡不可用，根据active状态显示success、warning
	if (props.disabled) return props.active ? "success" : "warning";

	if (isSuitable.value) {
		return "success";
	}

	if (isSelectable.value) {
		return props.forceMemoryOverride ? "warning" : "danger";
	}

	return "danger";
});
/** 获取显卡状态值 */
const gpuStatus = computed(() => {
	const gpuInfo = props.gpuInfo;
	if (!gpuInfo) return "未知";

	const memoryFree = gpuInfo.memory_free_mb || 0;
	const memoryRequired = props.memoryRequired;

	// During training, show special status for selected GPUs
	if (props.disabled) {
		if (props.active) return "训练中";
		return "不可用 (训练中)";
	}

	// Check if GPU is selectable first
	if (!isSelectable.value) {
		if (memoryFree < 2000) {
			return "内存严重不足";
		}
		if (gpuInfo.temperature_celsius && gpuInfo.temperature_celsius >= 90) {
			return "温度过高";
		}
		if (gpuInfo.utilization_percent && gpuInfo.utilization_percent >= 98) {
			return "使用率过高";
		}
		return "不可用";
	}

	// If selectable but not suitable under normal conditions
	if (!isSuitable.value) {
		if (props.forceMemoryOverride) {
			return "可用 (强制覆盖)";
		} else {
			if (memoryFree < memoryRequired) {
				return "内存不足";
			}
			if (gpuInfo.temperature_celsius && gpuInfo.temperature_celsius >= 85) {
				return "温度过高";
			}
			if (gpuInfo.utilization_percent && gpuInfo.utilization_percent >= 90) {
				return "使用率过高";
			}
			return "不适合";
		}
	}

	return "可用";
});

/** 已使用内存 */
const usedMemory = computed(() => {
	return formatMemory(props.gpuInfo.memory_used_mb ?? 0);
});
/** 总内存 */
const totalMemory = computed(() => {
	return formatMemory(props.gpuInfo.memory_total_mb ?? 0);
});
/** 可用内存 */
const freeMemory = computed(() => {
	return formatMemory(props.gpuInfo.memory_free_mb ?? 0);
});
/** 内存使用率 % */
const memoryUsagePercent = computed(() => {
	const used = props.gpuInfo.memory_used_mb ?? 0;
	const total = props.gpuInfo.memory_total_mb ?? 1;
	return Math.min(100, (used / total) * 100);
});
/** 内存条颜色 */
const customProgressColor = computed(() => {
	const usage = Math.floor(memoryUsagePercent.value);
	if (usage < 0.5) return "#10b981";
	if (usage >= 0.5 && usage < 0.8) return "#f59e0b";
	return "#ef4444";
});

/** 获取温度图标的class */
const temperatureIconClass = computed(() => {
	const temperature = props.gpuInfo.temperature_celsius;
	if (!temperature) return "temperature-unknown";
	if (temperature < 70) return "temperature-good";
	if (temperature >= 70 && temperature < 85) return "temperature-warning";
	return "temperature-danger";
});

/** 获取使用率图标类名 */
const utilizationIconClass = computed(() => {
	const utilization = props.gpuInfo.utilization_percent;
	if (typeof utilization !== "number") return "utilization-unknown";
	if (utilization < 50) return "utilization-good";
	if (utilization >= 50 && utilization < 90) return "utilization-warning";
	return "utilization-danger";
});

/** 获取兼容性图标类名 */
const compatibilityIconClass = computed(() => {
	if (props.disabled) return props.active ? "compatibility-good" : "compatibility-warning";
	if (isSuitable.value) return "compatibility-good";
	if (isSelectable.value && props.forceMemoryOverride) return "compatibility-warning";
	return "compatibility-danger";
});

/** gpu点击 */
function onGpuItemClick() {
	if (props.disabled) return;
	emits("itemClick", props.gpuInfo);
}

/** 是否显示覆盖 */
const showOverride = computed(() => {
	return !props.active && isSelectable.value && !isSuitable.value && props.forceMemoryOverride;
});
</script>

<style lang="scss" scoped>
.gpu-list-item {
	display: flex;
	align-items: center;
	padding: 9px 12px;
	border: 1px solid var(--el-input-border-color, var(--el-border-color));
	border-radius: $zl-border-radius;
	margin-bottom: 10px;
	white-space: nowrap;
	cursor: pointer;
	gap: 24px;
	&.active {
		border-color: var(--el-color-primary);
	}
	&.disabled {
		border-color: var(--el-color-danger);
		opacity: 0.7;
		cursor: not-allowed;
	}
}
.gpu-list-item-checkbox {
	flex-shrink: 0;
}
.gpu-list-item-content {
	flex-grow: 1;
	min-width: 0;
	display: flex;
	line-height: 24px;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 6px 16px;
}
.gpu-list-item-index-tag {
	font-size: 14px;
}
.gpu-list-item-gpu-name {
	color: var(--zl-popover-form-item-color);
	min-width: 80px;
}
.gpu-list-item-status-tag {
	font-size: 14px;
}
.gpu-list-item-metric-display {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
}
.gpu-list-item-metric-icon {
	font-size: 14px;
	&.memory-icon {
		color: #3b82f6;
	}
	&.power-icon {
		color: #f97316;
	}
	&.temperature-good {
		color: #10b981;
	}
	&.temperature-warning {
		color: #f59e0b;
	}
	&.temperature-danger {
		color: #ef4444;
	}
	&.temperature-unknown {
		color: #9ca3af;
	}
	&.utilization-good {
		color: #10b981;
	}
	&.utilization-warning {
		color: #f59e0b;
	}
	&.utilization-danger {
		color: #ef4444;
	}
	&.utilization-unknown {
		color: #9ca3af;
	}
}
.gpu-list-item-metric-value {
	font-size: 14px;
	color: var(--zl-multi-gpu-list-item-color);
	font-weight: 500;
}
.gpu-list-item-compatibility-icon {
	font-size: 20px;
	vertical-align: middle;
	&.compatibility-good {
		color: #10b981;
	}
	&.compatibility-warning {
		color: #f59e0b;
	}
	&.compatibility-danger {
		color: #ef4444;
	}
}
.gpu-list-item-memory-progress {
	flex-grow: 1;
	min-width: 60px;
}
</style>
