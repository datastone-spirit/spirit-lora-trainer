<!--
 * @Author: mulingyuer
 * @Date: 2025-08-14 11:08:28
 * @LastEditTime: 2025-08-15 10:38:44
 * @LastEditors: mulingyuer
 * @Description: 多GPU表单组件
 * @FilePath: \frontend\src\components\Form\MultiGpu\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-form-item>
		<div class="multi-gpu" v-loading="loading">
			<div v-if="isError" class="multi-gpu-status error">
				<div class="multi-gpu-status-head">
					<Icon class="multi-gpu-status-icon" name="ri-error-warning-line" />
					<div class="multi-gpu-status-text">加载GPU信息失败</div>
				</div>
				<div class="multi-gpu-status-body">
					<el-button class="multi-gpu-status-btn" round size="small" @click="onMultiGpuRetry">
						重试
					</el-button>
				</div>
			</div>
			<div v-if="!isError && gpuInfoResult.data" class="multi-gpu-content">
				<div class="multi-gpu-title">可用GPU列表：</div>
				<div class="multi-gpu-list">
					<GpuItem
						v-for="item in gpuInfoResult.data.gpus"
						:key="item.uuid"
						:item-data="item"
						:active="isActiveGPU(item)"
						:disabled="disabled"
						:multi-gpu-config="multiGpuConfig"
						@item-click="onGpuItemClick"
					/>
				</div>
				<div class="multi-gpu-footer">
					<el-alert
						class="multi-gpu-list-alert"
						:title="`已选择GPU：${multiGpuConfig.gpu_ids.length}`"
						type="info"
						:closable="false"
						effect="dark"
					/>
					<div class="multi-gpu-actions">
						<el-space :size="12">
							<el-button :icon="RiRefreshLine" @click="onMultiGpuRetry"> 刷新GPU信息 </el-button>
						</el-space>
					</div>
				</div>
			</div>
		</div>
	</el-form-item>
</template>

<script setup lang="ts">
import type { MultiGpuConfig } from "@/api/types";
import { useIcon } from "@/hooks/useIcon";
import type { FormattedGPUItem, GpuInfoResult } from "@/hooks/useMultiGPU";
import { useMultiGPU } from "@/hooks/useMultiGPU";
import type { ItemData } from "./GpuItem.vue";
import GpuItem from "./GpuItem.vue";
import { useTrainingStore } from "@/stores";

// Icon
const RiRefreshLine = useIcon({ name: "ri-refresh-line" });

const { getGpuInfo } = useMultiGPU();
const trainingStore = useTrainingStore();
const multiGpuConfig = defineModel("multiGpuConfig", {
	type: Object as PropType<MultiGpuConfig>,
	required: true
});

const loading = ref(false);
const gpuInfoResult = ref<GpuInfoResult>({ data: null, message: "" });
const isError = computed(() => {
	return !loading.value && Boolean(gpuInfoResult.value.message);
});
const disabled = computed(() => trainingStore.currentTaskInfo.type !== "none");

/** api 获取gpu信息 */
async function getGpuInfoResult() {
	loading.value = true;

	const result = await getGpuInfo({
		min_memory_required_mb: multiGpuConfig.value.memory_requirement_mb
	});

	if (result.data) {
		gpuInfoResult.value = result;
	} else {
		ElMessage.error(result.message);
	}

	loading.value = false;
}

// 重试
function onMultiGpuRetry() {
	getGpuInfoResult();
}

// 是否选中该gpu
function isActiveGPU(gpu: FormattedGPUItem) {
	return multiGpuConfig.value.gpu_ids.includes(gpu.index);
}

function onGpuItemClick(data: ItemData) {
	const newSelected = [...multiGpuConfig.value.gpu_ids];
	const findIndex = multiGpuConfig.value.gpu_ids.findIndex((item) => item === data.index);

	if (findIndex !== -1) {
		newSelected.splice(findIndex, 1);
	} else {
		newSelected.push(data.index);
	}

	multiGpuConfig.value.gpu_ids = newSelected.sort((a, b) => a - b);
	multiGpuConfig.value.num_gpus = newSelected.length;
}

onMounted(() => {
	getGpuInfoResult();
});
</script>

<style lang="scss" scoped>
.multi-gpu {
	width: 100%;
	border: 1px solid var(--el-border-color-light);
	background-color: var(--el-fill-color-blank);
	border-radius: 4px;
	color: var(--el-text-color-primary);
	min-height: 110px;
	padding: $zl-padding;
	line-height: normal;
	--el-loading-spinner-size: 32px;
}
.multi-gpu-status {
	height: 110px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: var(--el-color-danger);
}
.multi-gpu-status-head {
	display: flex;
	align-items: center;
}
.multi-gpu-status-icon {
	margin-right: 6px;
}
.multi-gpu-status-body {
	margin-top: 8px;
}
.multi-gpu-status-btn {
	min-width: 60px;
}

.multi-gpu-title {
	font-size: 16px;
}
.multi-gpu-list {
	margin-top: $zl-padding;
}
.multi-gpu-footer {
	margin-top: 6px;
}
.multi-gpu-list-alert {
	background-color: var(--el-fill-color-dark);
	color: var(--el-text-color-primary);
}
.multi-gpu-actions {
	margin-top: 6px;
}
</style>
