<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 16:07:29
 * @LastEditTime: 2025-01-06 16:32:03
 * @LastEditors: mulingyuer
 * @Description: 模型参数调整
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\ModelParameters\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="epochs" prop="epochs" popover-content="epochs">
		<el-input-number v-model.number="ruleForm.epochs" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem
		label="单个 GPU 的一次前向/后向传递的批大小"
		prop="micro_batch_size_per_gpu"
		popover-content="micro_batch_size_per_gpu"
	>
		<el-input-number v-model.number="ruleForm.micro_batch_size_per_gpu" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem label="流水线并行度" prop="pipeline_stages" popover-content="pipeline_stages">
		<el-input-number v-model.number="ruleForm.pipeline_stages" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem
		label="GAS 表示由于更小的流水线空洞"
		prop="gradient_accumulation_steps"
		popover-content="gradient_accumulation_steps"
	>
		<el-input-number
			v-model.number="ruleForm.gradient_accumulation_steps"
			:step="1"
			step-strictly
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="梯度范数裁剪"
		prop="gradient_clipping"
		popover-content="gradient_clipping"
	>
		<el-input-number v-model.number="ruleForm.gradient_clipping" :step="0.1" :min="0" />
	</PopoverFormItem>
	<PopoverFormItem label="学习率预热" prop="warmup_steps" popover-content="warmup_steps">
		<el-input-number v-model.number="ruleForm.warmup_steps" :step="1" step-strictly :min="0" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
