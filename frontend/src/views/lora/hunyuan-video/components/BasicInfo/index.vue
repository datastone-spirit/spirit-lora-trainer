<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 14:43:24
 * @LastEditTime: 2025-09-03 17:47:13
 * @LastEditors: mulingyuer
 * @Description: LoRA 基本信息
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\BasicInfo\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="LoRA 触发词"
		prop="aiTagRuleForm.class_token"
		popover-content="class_token"
	>
		<el-input
			v-model="ruleForm.aiTagRuleForm.class_token"
			placeholder="请输入触发词，多个词用英文逗号分隔"
			type="textarea"
			:rows="8"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="底模"
		prop="config.model.transformer_path"
		popover-content="transformer_path"
	>
		<FileSelector
			v-model="ruleForm.config.model.transformer_path"
			placeholder="请选择训练用的底模，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="VAE 模型文件"
		prop="config.model.vae_path"
		popover-content="vae_path"
	>
		<FileSelector
			v-model="ruleForm.config.model.vae_path"
			placeholder="请选择VAE 模型文件，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="LLM 模型文件"
		prop="config.model.llm_path"
		popover-content="llm_path"
	>
		<FileSelector
			v-model="ruleForm.config.model.llm_path"
			placeholder="请选择LLM 模型文件，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="Clip 模型文件"
		prop="config.model.clip_path"
		popover-content="clip_path"
	>
		<FileSelector
			v-model="ruleForm.config.model.clip_path"
			placeholder="请选择Clip 模型文件，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="模型的基础 dtype"
		prop="config.model.dtype"
		popover-content="dtype"
	>
		<el-select v-model="ruleForm.config.model.dtype" placeholder="请选择模型 dtype">
			<el-option label="bfloat16" value="bfloat16" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="底模 dtype"
		prop="config.model.transformer_dtype"
		popover-content="transformer_dtype"
	>
		<el-select v-model="ruleForm.config.model.transformer_dtype" placeholder="请选择底模 dtype">
			<el-option label="float8" value="float8" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="采样时间方式"
		prop="config.model.timestep_sample_method"
		popover-content="timestep_sample_method"
	>
		<el-select
			v-model="ruleForm.config.model.timestep_sample_method"
			placeholder="请选择采样时间方式"
		>
			<el-option label="logit_normal" value="logit_normal" />
			<el-option label="uniform" value="uniform" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 保存路径" prop="config.output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.config.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
	<el-alert
		class="training-data-alert"
		title="请确保保存路径下的目录内容为空，并且提供足够的存储空间，因为Hunyuan模型训练需要较多的轮数，会产生过多的中间文件，所以需要较大的存储空间。"
		type="warning"
		:closable="false"
		show-icon
		effect="dark"
	/>
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
