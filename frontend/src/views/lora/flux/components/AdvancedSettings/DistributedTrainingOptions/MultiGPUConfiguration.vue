<!--
 * @Author: Claude Code Assistant
 * @Date: 2025-01-24
 * @Description: Multi-GPU configuration component for Flux training
-->
<template>
	<div class="multi-gpu-config">
		<div v-if="gpuInfoLoading" class="loading-state">
			<el-icon class="loading-icon">
				<Loading />
			</el-icon>
			<div class="loading-text">正在加载GPU信息...</div>
		</div>
		<div v-else-if="isGupInfoError" class="error-panel">
			<div class="error-header">
				<el-icon><Warning /></el-icon>
				<span class="error-title">加载GPU信息失败</span>
			</div>
			<div class="error-message">{{ gpuInfoErrorMsg }}</div>
			<el-button size="small" @click="refreshGPUInfo">重试</el-button>
		</div>
		<!-- GPU Information Panel -->
		<div v-else-if="gpuInfo" class="gpu-info-panel">
			<!-- GPU List -->
			<PopoverFormItem>
				<div class="gpu-list">
					<h4 class="gpu-list-title">可用GPU 列表</h4>
					<div class="gpu-list-container">
						<GPUListItem
							v-for="item in gpuInfo.gpus"
							:key="item.index"
							:gpu-info="item"
							:disabled="isDisabled(item)"
							:active="selectedGPUs.includes(item.index)"
							:force-memory-override="forceMemoryOverride"
							:memory-required="ruleForm.memory_requirement_mb"
							@item-click="onGpuItemClick"
						/>
					</div>
				</div>
				<el-alert
					class="gpu-list-alert"
					:title="`已选择GPU：${selectedGPUs.length}`"
					type="info"
					:closable="false"
					effect="dark"
				/>
				<!-- Actions -->
				<el-space :size="12">
					<el-button @click="refreshGPUInfo" :loading="gpuInfoLoading" size="default">
						<el-icon><Refresh /></el-icon>
						刷新GPU信息
					</el-button>
					<el-button
						v-if="gpuInfo && selectedGPUs.length > 0"
						@click="validateConfiguration"
						:loading="validateGPUConfigLoading"
						size="default"
					>
						<el-icon><Check /></el-icon>
						验证配置
					</el-button>
				</el-space>
				<el-alert
					v-if="shouldDisableValidation"
					class="training-notice"
					title="训练进行中，GPU配置已从训练任务中恢复"
					type="info"
					show-icon
					:closable="false"
				/>
				<el-alert
					v-if="
						validateGPUConfigResult && !validateGPUConfigResult.is_valid && !shouldDisableValidation
					"
					class="validation-error"
					:title="validateGPUConfigResult.error_message || '验证失败'"
					type="error"
					show-icon
					:closable="false"
				/>
			</PopoverFormItem>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GPUInfo } from "@/api/gpu/types";
import PopoverFormItem from "@/components/Form/PopoverFormItem.vue";
import { useTrainingStore } from "@/stores";
import { ElMessage } from "element-plus";
import { useMultiGPU } from "../../../composables/useMultiGPU";
import type { RuleForm } from "../../../types";
import GPUListItem from "./GPUListItem.vue";
import { isGPUSelectable } from "./distributed-training.helper";

// Props
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

// Training store for checking current task status
const trainingStore = useTrainingStore();
const {
	gpuInfo,
	gpuInfoLoading,
	isGupInfoError,
	gpuInfoErrorMsg,
	getGPUInfo,
	estimateMemory,
	validateGPUConfig,
	validateGPUConfigLoading,
	validateGPUConfigResult
} = useMultiGPU();

// State
const forceMemoryOverride = ref(false);

// Training status computed properties
const isTraining = computed(() => trainingStore.hasRunningTask);
const isFluxTraining = computed(() => trainingStore.isFluxTraining);
const shouldDisableValidation = computed(() => isTraining.value && isFluxTraining.value);

// Computed
const selectedGPUs = computed({
	get: () => ruleForm.value.gpu_ids || [],
	set: (value: number[]) => {
		ruleForm.value.gpu_ids = value;
		ruleForm.value.num_gpus = value.length;
	}
});

const refreshGPUInfo = () => {
	getGPUInfo();
};

const validateConfiguration = async () => {
	// Skip validation during training
	if (shouldDisableValidation.value) {
		ElMessage.info("训练期间禁用GPU验证");
		return;
	}

	if (!selectedGPUs.value.length) {
		ElMessage.warning("请至少选择一个GPU");
		return;
	}

	await validateGPUConfig(ruleForm, forceMemoryOverride.value);
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

/** gpu item 点击 */
function onGpuItemClick(gpuInfo: GPUInfo) {
	const newSelected = [...selectedGPUs.value];
	const findIndex = selectedGPUs.value.findIndex((item) => item === gpuInfo.index);

	if (findIndex !== -1) {
		newSelected.splice(findIndex, 1);
	} else {
		newSelected.push(gpuInfo.index);
	}

	selectedGPUs.value = newSelected.sort((a, b) => a - b);

	// 校验gpu配置
	validateCurrentSelection();
}

/** 是否禁用gpu */
function isDisabled(gpuInfo: GPUInfo) {
	// 如果在训练中，则全部都是禁用状态
	if (isTraining.value) return true;

	// 未在训练中，则需要判断这个GPU是否符合要求，不符合也禁用
	const isSelectable = isGPUSelectable({
		gpuInfo,
		memoryRequired: ruleForm.value.memory_requirement_mb,
		forceMemoryOverride: forceMemoryOverride.value,
		shouldDisableValidation: shouldDisableValidation.value
	});
	if (!isSelectable) return true;

	// 符合要求，则不禁用
	return false;
}

// Watchers
const watchFn = useDebounceFn(() => estimateMemory(ruleForm), 500);
watch([() => ruleForm.value.train_batch_size, () => ruleForm.value.mixed_precision], watchFn);
watch(
	() => forceMemoryOverride.value,
	() => {
		validateCurrentSelection();
	}
);
</script>

<style lang="scss" scoped>
.multi-gpu-config {
	max-width: 100%;
}

.gpu-list {
	width: 100%;
}

/* GPU List Title */
.gpu-list-title {
	font-size: 14px;
	font-weight: 500;
	color: var(--zl-popover-form-item-color);
	margin-bottom: 6px;
}
.gpu-list-alert {
	background-color: var(--zl-multi-gpu-list-alert-bg);
	color: var(--zl-multi-gpu-list-alert-color);
	margin-bottom: 12px;
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
	color: var(--el-text-color-regular);
}

/* Error Panel */
.error-panel {
	padding: 16px;
	background-color: var(--el-color-error-light-9);
	border: 1px solid var(--el-color-error);
	border-radius: 8px;
	margin-bottom: 12px;
}

.error-header {
	display: flex;
	align-items: center;
	gap: 8px;
	color: var(--el-color-error);
	margin-bottom: 8px;
}

.error-title {
	font-weight: 500;
}

.error-message {
	color: var(--el-color-error);
	font-size: 14px;
	margin-bottom: 12px;
}

/* Actions */
.actions {
	margin-top: 24px;
	display: flex;
	gap: 12px;
}

.training-notice,
.validation-error {
	margin-top: 12px;
}
</style>
