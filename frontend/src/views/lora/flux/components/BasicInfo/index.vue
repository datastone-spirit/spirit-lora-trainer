<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 17:13:09
 * @LastEditTime: 2024-12-10 09:32:05
 * @LastEditors: mulingyuer
 * @Description: LoRA 基本信息
 * @FilePath: \frontend\src\views\lora\flux\components\BasicInfo\index.vue
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
		v-if="isExpert"
		label="从某个 save_state 保存的中断状态继续训练"
		:prop="formProps.resume"
		popover-content="resume"
	>
		<FileSelector v-model="ruleForm.resume" placeholder="请选择中断状态的模型" />
	</PopoverFormItem>
	<PopoverFormItem label="AE 模型文件" :prop="formProps.ae" popover-content="ae">
		<FileSelector v-model="ruleForm.ae" placeholder="请选择AE 模型文件" />
	</PopoverFormItem>
	<PopoverFormItem label="clip_l 模型文件" :prop="formProps.clip_l" popover-content="clip_l">
		<FileSelector v-model="ruleForm.clip_l" placeholder="请选择clip_l 模型文件" />
	</PopoverFormItem>
	<PopoverFormItem label="t5xxl 模型文件" :prop="formProps.t5xxl" popover-content="t5xxl">
		<FileSelector v-model="ruleForm.t5xxl" placeholder="请选择t5xxl 模型文件" />
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 保存路径" :prop="formProps.output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
	<template v-if="isExpert">
		<ModelSaveFormatSelector
			v-model="ruleForm.save_model_as"
			:prop="formProps.save_model_as"
			popoverContent="save_model_as"
		/>
		<ModelSavePrecisionSelector
			v-model="ruleForm.save_precision"
			:prop="formProps.save_precision"
			popover-content="save_precision"
		/>
		<PopoverFormItem
			label="保存训练状态 配合 resume 参数可以继续从某个状态训练"
			:prop="formProps.save_state"
			popover-content="save_state"
		>
			<el-switch v-model="ruleForm.save_state" />
		</PopoverFormItem>
	</template>
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
