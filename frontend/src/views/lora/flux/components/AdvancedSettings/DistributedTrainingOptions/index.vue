<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:39:43
 * @LastEditTime: 2025-07-01 17:14:42
 * @LastEditors: mulingyuer
 * @Description: 分布式训练和多GPU配置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\DistributedTrainingOptions\index.vue
 * Enhanced with multi-GPU support
-->
<template>
	<FieldSetWrapper title="分布式训练">
		<!-- Multi-GPU Training Toggle -->
		<PopoverFormItem
			label="启用多GPU训练"
			prop="multi_gpu_enabled"
			popover-content="multi_gpu_enabled"
		>
			<el-switch
				v-model="ruleForm.multi_gpu_enabled"
				:loading="loading"
				:before-change="onMultiGPUToggleBeforeChange"
				@change="onMultiGPUToggle"
			/>
		</PopoverFormItem>

		<div v-if="ruleForm.multi_gpu_enabled" class="multi-gpu-panel">
			<MultiGPUConfiguration v-model:form="ruleForm" />
			<PopoverFormItem
				label="分布式后端"
				prop="distributed_backend"
				popover-content="distributed_backend"
			>
				<el-select v-model="ruleForm.distributed_backend">
					<el-option label="NCCL (推荐NVIDIA GPU使用)" value="nccl" />
					<el-option label="Gloo (CPU和GPU)" value="gloo" />
					<el-option label="MPI" value="mpi" />
				</el-select>
			</PopoverFormItem>
			<PopoverFormItem
				label="每N步进行梯度同步"
				prop="gradient_sync_every_n_steps"
				popover-content="gradient_sync_every_n_steps"
			>
				<el-input-number v-model="ruleForm.gradient_sync_every_n_steps" :min="1" :max="100" />
			</PopoverFormItem>
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
import FieldSetWrapper from "@/components/FieldSetWrapper/FieldSetWrapper.vue";
import PopoverFormItem from "@/components/Form/PopoverFormItem.vue";
import { useMultiGPU } from "../../../composables/useMultiGPU";
import type { RuleForm } from "../../../types";
import MultiGPUConfiguration from "./MultiGPUConfiguration.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

const { getGPUInfo, gpuInfo, estimateMemory } = useMultiGPU();

// State
const loading = ref(false);

/** 启动多GPU开关前 */
async function onMultiGPUToggleBeforeChange() {
	if (!ruleForm.value.multi_gpu_enabled) {
		loading.value = true;
		await getGPUInfo(); // 保证开启后GPU信息已获取
		await estimateMemory(ruleForm); // 估算显存
		loading.value = false;
	}

	return true;
}

/** 启动多GPU开关 */
function onMultiGPUToggle() {
	const enabled = ruleForm.value.multi_gpu_enabled;
	// 如果开启时没有选中过gpu，则默认全选
	if (enabled && gpuInfo.value && ruleForm.value.gpu_ids.length === 0) {
		ruleForm.value.gpu_ids = gpuInfo.value.gpus.map((item) => item.index).sort((a, b) => a - b);
	}
}

(async function init() {
	if (ruleForm.value.multi_gpu_enabled) {
		loading.value = true;
		await getGPUInfo(); // 保证开启后GPU信息已获取
		await estimateMemory(ruleForm); // 估算显存
		loading.value = false;
	}
})();
</script>

<style scoped>
.multi-gpu-panel {
	border: 1px solid var(--el-input-border-color, var(--el-border-color));
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
