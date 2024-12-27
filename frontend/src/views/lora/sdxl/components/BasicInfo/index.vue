<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:18:16
 * @LastEditTime: 2024-12-27 10:01:13
 * @LastEditors: mulingyuer
 * @Description: LoRA 基本信息
 * @FilePath: \frontend\src\views\lora\sdxl\components\BasicInfo\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="LoRA 名称" :prop="formProps.output_name" popover-content="output_name">
		<el-input v-model="ruleForm.output_name" placeholder="请输入LoRA名称" />
	</PopoverFormItem>
	<PopoverFormItem
		label="LoRA 触发词"
		:prop="formProps.class_tokens"
		popover-content="class_tokens"
	>
		<el-input
			v-model="ruleForm.class_tokens"
			placeholder="请输入触发词，多个词用英文逗号分隔"
			type="textarea"
			:rows="4"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="底模"
		:prop="formProps.pretrained_model_name_or_path"
		popover-content="pretrained_model_name_or_path"
	>
		<FileSelector
			v-model="ruleForm.pretrained_model_name_or_path"
			placeholder="请选择训练用的底模"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="从某个 save_state 保存的中断状态继续训练"
		:prop="formProps.resume"
		popover-content="resume"
	>
		<FileSelector v-model="ruleForm.resume" placeholder="请选择中断状态的模型" />
	</PopoverFormItem>
	<PopoverFormItem label="VAE" :prop="formProps.vae" popover-content="vae">
		<FileSelector v-model="ruleForm.vae" placeholder="请选择VAE" />
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 保存路径" :prop="formProps.output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
	<ModelSaveFormatSelector
		v-show="isExpert"
		v-model="ruleForm.save_model_as"
		label="模型保存格式"
		:prop="formProps.save_model_as"
		popoverContent="save_model_as"
	/>
	<ModelSavePrecisionSelector
		v-show="isExpert"
		v-model="ruleForm.save_precision"
		label="模型保存精度"
		:prop="formProps.save_precision"
		popover-content="save_precision"
	/>
	<PopoverFormItem
		v-show="isExpert"
		label="保存训练状态 配合 resume 参数可以继续从某个状态训练"
		:prop="formProps.save_state"
		popover-content="save_state"
	>
		<el-switch v-model="ruleForm.save_state" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm, RuleFormProps } from "../../types";

export interface BasicInfoProps {
	/** 表单props */
	formProps: RuleFormProps;
}

defineProps<BasicInfoProps>();

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
