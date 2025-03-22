<!--
 * @Author: mulingyuer
 * @Date: 2025-03-21 15:56:35
 * @LastEditTime: 2025-03-22 14:17:18
 * @LastEditors: mulingyuer
 * @Description: demo
 * @FilePath: \frontend\src\views\lora\wan\components\Demo.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="训练任务类型" prop="task" popover-content="task">
		<el-radio-group v-model="ruleForm.task">
			<el-radio-button label="图片训练（i2v）" value="i2v_14B" />
			<el-radio-button label="文本训练（t2v）" value="t2v_14B" />
		</el-radio-group>
	</PopoverFormItem>
	<PopoverFormItem label="wan2模型地址" prop="dit" popover-content="dit">
		<FileSelector v-model="ruleForm.dit" placeholder="请选择训练用的wan2模型" />
	</PopoverFormItem>
	<PopoverFormItem label="使用PyTorch原生注意力" prop="sdpa" popover-content="sdpa">
		<el-switch v-model="ruleForm.sdpa" />
	</PopoverFormItem>
	<BaseSelector
		v-model="ruleForm.mixed_precision"
		label="混合精度模式"
		prop="mixed_precision"
		popoverContent="mixed_precision"
		:options="mixedPrecisionOptions"
	/>
	<PopoverFormItem
		label="启用基础FP8模式（与fp8_scaled互斥）"
		prop="fp8_base"
		popover-content="fp8_base"
	>
		<el-switch v-model="ruleForm.fp8_base" />
	</PopoverFormItem>
	<PopoverFormItem
		label="FP8缩放模式（与fp8_base互斥）"
		prop="fp8_scaled"
		popover-content="fp8_scaled"
	>
		<el-switch v-model="ruleForm.fp8_scaled" />
	</PopoverFormItem>
	<PopoverFormItem label="T5模型路径" prop="t5_model" popover-content="t5_model">
		<FileSelector v-model="ruleForm.t5_model" placeholder="请选择T5模型" />
	</PopoverFormItem>
	<PopoverFormItem label="T5使用FP8模式" prop="fp8_t5" popover-content="fp8_t5">
		<el-switch v-model="ruleForm.fp8_t5" />
	</PopoverFormItem>
	<PopoverFormItem
		label="T5模型的预训练权重文件的路径"
		prop="t5_checkpoint"
		popover-content="t5_checkpoint"
	>
		<FileSelector v-model="ruleForm.t5_checkpoint" placeholder="请选择T5模型的预训练权重文件" />
	</PopoverFormItem>
	<BaseSelector
		v-model="ruleForm.t5_tokenizer"
		label="T5模型的分词器"
		prop="t5_tokenizer"
		popoverContent="t5_tokenizer"
		:options="t5TokenizerOptions"
	/>
	<PopoverFormItem label="VAE模型路径" prop="vae" popover-content="vae">
		<FileSelector v-model="ruleForm.vae" placeholder="请选择VAE模型" />
	</PopoverFormItem>
	<PopoverFormItem
		label="VAE模型的预训练权重文件"
		prop="vae_checkpoint"
		popover-content="vae_checkpoint"
	>
		<FileSelector v-model="ruleForm.vae_checkpoint" placeholder="请选择VAE模型的预训练权重文件" />
	</PopoverFormItem>
	<PopoverFormItem label="VAE维度跨度" prop="vae_stride" popover-content="vae_stride">
		<el-input v-model="ruleForm.vae_stride" placeholder="请输入VAE维度跨度" />
	</PopoverFormItem>
	<BaseSelector
		v-model="ruleForm.optimizer_type"
		label="优化器类型"
		prop="optimizer_type"
		popoverContent="optimizer_type"
		:options="optimizerTypeOptions"
	/>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../types";
import type { BaseSelectorProps } from "@/components/Form/BaseSelector.vue";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

/** 混合精度选项 */
const mixedPrecisionOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "fp16",
		value: "fp16"
	},
	{
		label: "bf16",
		value: "bf16"
	},
	{
		label: "none",
		value: "none"
	}
]);

/** T5模型的分词器选项 */
const t5TokenizerOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "google/umt5-xxl",
		value: "google/umt5-xxl"
	}
]);

/** 优化器类型选项 */
const optimizerTypeOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "adamw8bit",
		value: "adamw8bit"
	}
]);
</script>

<style scoped></style>
