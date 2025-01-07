<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 14:43:24
 * @LastEditTime: 2025-01-07 16:43:57
 * @LastEditors: mulingyuer
 * @Description: LoRA 基本信息
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\BasicInfo\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="LoRA 名称" prop="output_name" popover-content="output_name">
		<el-input v-model="ruleForm.output_name" placeholder="请输入LoRA名称" />
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 触发词" prop="class_tokens" popover-content="class_tokens">
		<el-input
			v-model="ruleForm.class_tokens"
			placeholder="请输入触发词，多个词用英文逗号分隔"
			type="textarea"
			:rows="4"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="底模"
		prop="model_transformer_path"
		popover-content="model_transformer_path"
	>
		<FileSelector v-model="ruleForm.model_transformer_path" placeholder="请选择训练用的底模" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="VAE 模型文件"
		prop="model_vae_path"
		popover-content="model_vae_path"
	>
		<FileSelector v-model="ruleForm.model_vae_path" placeholder="请选择VAE 模型文件" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="LLM 模型文件"
		prop="model_llm_path"
		popover-content="model_llm_path"
	>
		<FileSelector v-model="ruleForm.model_llm_path" placeholder="请选择LLM 模型文件" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="Clip 模型文件"
		prop="model_clip_path"
		popover-content="model_clip_path"
	>
		<FileSelector v-model="ruleForm.model_clip_path" placeholder="请选择Clip 模型文件" />
	</PopoverFormItem>
	<ModelDtypeSelector
		v-show="isExpert"
		v-model="ruleForm.model_dtype"
		label="模型 dtype"
		prop="model_dtype"
		placeholder="请选择模型 dtype"
		popover-content="model_dtype"
	/>
	<ModelTransformerDtypeSelector
		v-show="isExpert"
		v-model="ruleForm.model_transformer_dtype"
		label="底模 dtype"
		prop="model_transformer_dtype"
		placeholder="请选择底模 dtype"
		popover-content="model_transformer_dtype"
	/>
	<ModelTimestepSampleMethodSelector
		v-show="isExpert"
		v-model="ruleForm.model_timestep_sample_method"
		label="采样时间方式"
		prop="model_timestep_sample_method"
		placeholder="请选择采样时间方式"
		popover-content="model_timestep_sample_method"
	/>
	<PopoverFormItem label="LoRA 保存路径" prop="output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";
import ModelDtypeSelector from "../Form/ModelDtypeSelector.vue";
import ModelTransformerDtypeSelector from "../Form/ModelTransformerDtypeSelector.vue";
import ModelTimestepSampleMethodSelector from "../Form/ModelTimestepSampleMethodSelector.vue";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
