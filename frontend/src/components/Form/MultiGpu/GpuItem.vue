<!--
 * @Author: mulingyuer
 * @Date: 2025-08-14 14:47:37
 * @LastEditTime: 2025-08-20 14:15:46
 * @LastEditors: mulingyuer
 * @Description: gpu item
 * @FilePath: \frontend\src\components\Form\MultiGpu\GpuItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div
		class="multi-gpu-item"
		:class="{ active: active, disabled: disabled || !itemData.is_available }"
		@click="onGpuItemClick"
	>
		<div class="multi-gpu-item-checkbox">
			<el-checkbox :model-value="active" />
		</div>
		<div class="multi-gpu-item-content">
			<el-tooltip content="GPU索引" placement="top">
				<el-tag size="default" type="info" class="multi-gpu-item-index">
					GPU {{ itemData.index }}
				</el-tag>
			</el-tooltip>
			<el-tooltip :content="itemData.name || '未知GPU'" placement="top">
				<span class="multi-gpu-item-name">{{ gpuName }}</span>
			</el-tooltip>
			<el-tag :type="gpuStatusByTagType" size="default" class="multi-gpu-item-status">
				{{ gpuStatus }}
			</el-tag>
			<el-tooltip :content="`显存使用率: ${memoryUsagePercent.toFixed(1)}%`" placement="top">
				<el-progress
					class="multi-gpu-item-memory-progress"
					:percentage="Math.min(Math.floor(memoryUsagePercent), 100)"
					:color="customProgressColor"
					:show-text="false"
				/>
			</el-tooltip>
			<el-tooltip :content="`显存: ${usedMemory} / ${totalMemory}`" placement="top">
				<div class="multi-gpu-item-metric-display">
					<Icon class="multi-gpu-item-metric-icon memory-icon" name="ri-computer-line" />
					<span class="multi-gpu-item-metric-value">{{ freeMemory }}</span>
				</div>
			</el-tooltip>
			<el-tooltip :content="`温度: ${itemData.formatted_temperature_celsius}`" placement="top">
				<div class="multi-gpu-item-metric-display">
					<Icon
						class="multi-gpu-item-metric-icon"
						:class="temperatureIconClass"
						name="ri-temp-hot-line"
					/>
					<span class="multi-gpu-item-metric-value">
						{{ itemData.formatted_temperature_celsius }}
					</span>
				</div>
			</el-tooltip>
			<el-tooltip :content="`GPU使用率: ${itemData.formatted_utilization_percent}`" placement="top">
				<div class="multi-gpu-item-metric-display">
					<Icon
						class="multi-gpu-item-metric-icon"
						:class="utilizationIconClass"
						name="ri-line-chart-line"
					/>
					<span class="multi-gpu-item-metric-value">
						{{ itemData.formatted_utilization_percent }}
					</span>
				</div>
			</el-tooltip>
			<el-tooltip
				:content="`功耗: ${itemData.formatted_power_draw_watts} / ${itemData.formatted_power_limit_watts}`"
				placement="top"
			>
				<div class="multi-gpu-item-metric-display">
					<Icon class="multi-gpu-item-metric-icon power-icon" name="ri-flashlight-line" />
					<span class="multi-gpu-item-metric-value">
						{{ itemData.formatted_power_draw_watts }}
					</span>
				</div>
			</el-tooltip>
			<el-tooltip
				:content="disabled ? '训练状态' : itemData.formatted_gpu_available_text"
				placement="top"
			>
				<Icon
					class="multi-gpu-item-available-icon"
					:class="compatibilityIconClass"
					:name="availableIcon"
				/>
				<el-icon class="multi-gpu-item-compatibility-icon" :class="compatibilityIconClass">
				</el-icon>
			</el-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GpuInfoResult } from "@/hooks/useMultiGPU";
import type { TagProps } from "element-plus";
import { useMultiGPU } from "@/hooks/useMultiGPU";
import type { MultiGpuConfig } from "@/api/types";

export type ItemData = NonNullable<GpuInfoResult["data"]>["gpus"][number];

export interface GpuInfoProps {
	itemData: ItemData;
	/** 是否选中 */
	active: boolean;
	/** 是否禁用 */
	disabled?: boolean;
	/** 多gpu配置 */
	multiGpuConfig: MultiGpuConfig;
}
export interface GpuInfoEmits {
	itemClick: [data: ItemData];
}

const { formatMemory, isGpuAvailable } = useMultiGPU();
const props = withDefaults(defineProps<GpuInfoProps>(), { disabled: false });
const emit = defineEmits<GpuInfoEmits>();

// 显卡名称
const gpuName = computed(() => {
	const { name } = props.itemData;
	if (!name) return "Unknown";
	return name.replace("NVIDIA GeForce ", "").replace("NVIDIA ", "");
});
// 获取显卡状态对应的tag类型
const gpuStatusByTagType = computed<TagProps["type"]>(() => {
	// 如果显卡不可用，根据active状态显示success、warning
	if (props.disabled) return props.active ? "success" : "warning";
	if (props.itemData.is_available) return "success";

	return "danger";
});
// 获取显卡状态值
const gpuStatus = computed(() => {
	const memoryFree = props.itemData.memory_free_mb ?? 0;
	const memoryRequired = props.multiGpuConfig.memory_requirement_mb;

	if (props.disabled) {
		if (props.active) return "训练中";
		return "不可用 (训练中)";
	}

	if (!props.itemData.is_available) {
		if (memoryFree < memoryRequired) {
			return "显存不足";
		}
		if (memoryFree < 2000) {
			return "显存严重不足";
		}
		if (props.itemData.temperature_celsius && props.itemData.temperature_celsius >= 90) {
			return "温度过高";
		}
		if (props.itemData.utilization_percent && props.itemData.utilization_percent >= 98) {
			return "使用率过高";
		}
		return "不可用";
	}

	return "可用";
});
// 内存使用率 %
const memoryUsagePercent = computed(() => {
	const used = props.itemData.memory_used_mb ?? 0;
	const total = props.itemData.memory_total_mb ?? 1;
	return Math.min(100, (used / total) * 100);
});
// 内存条颜色
const customProgressColor = computed(() => {
	const usage = Math.floor(memoryUsagePercent.value);
	if (usage < 0.5) return "#10b981";
	if (usage >= 0.5 && usage < 0.8) return "#f59e0b";
	return "#ef4444";
});
// 已使用内存
const usedMemory = computed(() => {
	return formatMemory(props.itemData.memory_used_mb ?? 0);
});
// 总内存
const totalMemory = computed(() => {
	return formatMemory(props.itemData.memory_total_mb ?? 0);
});
// 可用内存
const freeMemory = computed(() => {
	return formatMemory(props.itemData.memory_free_mb ?? 0);
});
// 获取温度图标的class类名
const temperatureIconClass = computed(() => {
	const temperature = props.itemData.temperature_celsius;
	if (!temperature) return "temperature-unknown";
	if (temperature < 70) return "temperature-good";
	if (temperature >= 70 && temperature < 85) return "temperature-warning";
	return "temperature-danger";
});
// 获取使用率图标类名
const utilizationIconClass = computed(() => {
	const utilization = props.itemData.utilization_percent;
	if (typeof utilization !== "number") return "utilization-unknown";
	if (utilization < 50) return "utilization-good";
	if (utilization >= 50 && utilization < 90) return "utilization-warning";
	return "utilization-danger";
});
// 获取兼容性图标类名
const compatibilityIconClass = computed(() => {
	if (props.disabled) return props.active ? "compatibility-good" : "compatibility-warning";
	if (props.itemData.is_available) return "compatibility-good";
	return "compatibility-danger";
});
// 可用GPU Icon
const availableIcon = computed(() => {
	const isAvailable = isGpuAvailable({
		gpuInfo: props.itemData,
		min_memory_required_mb: props.multiGpuConfig.memory_requirement_mb
	});
	if (props.active || isAvailable) {
		return "ri-checkbox-circle-line";
	}

	return "ri-error-warning-line";
});

// item click
function onGpuItemClick() {
	if (props.disabled || !props.itemData.is_available) return;
	emit("itemClick", props.itemData);
}
</script>

<style lang="scss" scoped>
.multi-gpu-item {
	display: flex;
	align-items: center;
	padding: 9px 12px;
	border: 1px solid var(--el-input-border-color, var(--el-border-color));
	border-radius: $zl-border-radius;
	@include no-select();
	cursor: pointer;
	& + & {
		margin-top: 6px;
	}
	&.active {
		border-color: var(--el-color-primary);
	}
}
.multi-gpu-item.disabled {
	border-color: var(--el-color-danger);
	opacity: 0.7;
	cursor: not-allowed;

	.multi-gpu-item-checkbox {
		:deep(.el-checkbox),
		:deep(.el-checkbox__input) {
			cursor: not-allowed;
		}
	}
}
.multi-gpu-item.active.disabled {
	border-color: var(--el-color-primary);
}

.multi-gpu-item-checkbox {
	margin-right: 24px;
}
.multi-gpu-item-content {
	flex-grow: 1;
	min-width: 0;
	display: flex;
	line-height: 24px;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	gap: 6px 12px;
}
.multi-gpu-item-index {
	font-size: 14px;
}
.multi-gpu-item-name {
	color: var(--zl-popover-form-item-color);
	min-width: 80px;
}
.multi-gpu-item-status {
	font-size: 14px;
}
.multi-gpu-item-memory-progress {
	flex-grow: 1;
	min-width: 60px;
}
.multi-gpu-item-metric-display {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
}
.multi-gpu-item-metric-icon {
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
.multi-gpu-item-metric-value {
	font-size: 14px;
	color: var(--zl-multi-gpu-list-item-color);
	font-weight: 500;
}
.multi-gpu-item-available-icon {
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
</style>
