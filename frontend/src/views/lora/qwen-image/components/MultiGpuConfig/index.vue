<!--
 * @Author: mulingyuer
 * @Date: 2025-08-19 15:29:01
 * @LastEditTime: 2025-08-19 16:05:35
 * @LastEditors: mulingyuer
 * @Description: 多GPU配置
 * @FilePath: \frontend\src\views\lora\qwen-image\components\MultiGpuConfig\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<Collapse v-model="open" title="第6步：多GPU配置" v-loading="loading">
		<el-form-item v-if="!show && !loading">
			<el-alert
				class="multi-gpu-alert"
				title="当前系统环境不支持多GPU配置"
				type="info"
				:closable="false"
			/>
		</el-form-item>
		<template v-if="show">
			<PopoverFormItem
				label="启用多GPU训练"
				prop="multi_gpu_config.multi_gpu_enabled"
				popover-content="multi_gpu_enabled"
			>
				<el-switch v-model="ruleForm.multi_gpu_config.multi_gpu_enabled" />
			</PopoverFormItem>
			<template v-if="ruleForm.multi_gpu_config.multi_gpu_enabled">
				<MultiGpu v-model:multi-gpu-config="ruleForm.multi_gpu_config" />
				<PopoverFormItem
					label="分布式后端"
					prop="multi_gpu_config.distributed_backend"
					popover-content="distributed_backend"
				>
					<el-select v-model="ruleForm.multi_gpu_config.distributed_backend">
						<el-option label="NCCL (推荐NVIDIA GPU使用)" value="nccl" />
						<el-option label="Gloo (CPU和GPU)" value="gloo" />
						<el-option label="MPI" value="mpi" />
					</el-select>
				</PopoverFormItem>
				<PopoverFormItem
					label="通过累积多个小批次的梯度来等效大batch_size训练"
					prop="multi_gpu_config.gradient_accumulation_steps"
					popover-content="gradient_accumulation_steps"
				>
					<el-input-number
						v-model.number="ruleForm.multi_gpu_config.gradient_accumulation_steps"
						:step="1"
						step-strictly
						:min="0"
					/>
				</PopoverFormItem>
				<PopoverFormItem
					label="每N步进行梯度同步"
					prop="multi_gpu_config.gradient_sync_every_n_steps"
					popover-content="gradient_sync_every_n_steps"
				>
					<el-input-number
						v-model="ruleForm.multi_gpu_config.gradient_sync_every_n_steps"
						:min="1"
						:max="100"
					/>
				</PopoverFormItem>
			</template>
		</template>
	</Collapse>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import { useMultiGPU, type GpuInfoResult } from "@/hooks/useMultiGPU";

const open = defineModel("open", { type: Boolean, required: true });
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

const { getGpuInfo } = useMultiGPU();
const loading = ref(true);
const show = ref(false);
const gpuResult = ref<GpuInfoResult>({ data: null, message: "" });

async function init() {
	try {
		loading.value = true;

		gpuResult.value = await getGpuInfo({
			min_memory_required_mb: ruleForm.value.multi_gpu_config.memory_requirement_mb
		});

		// 如果GPU数量小于等于1，不显示该表单组件
		if (!gpuResult.value.data || gpuResult.value.data.total_gpus <= 1) {
			show.value = false;
			ruleForm.value.multi_gpu_config.multi_gpu_enabled = false;
			return;
		}

		show.value = true;
	} catch {
		show.value = false;
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	init();
});
</script>

<style lang="scss" scoped>
.multi-gpu-alert {
	background-color: var(--el-fill-color-dark);
	color: var(--el-text-color-primary);
}
</style>
