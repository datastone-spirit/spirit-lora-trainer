<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 14:56:49
 * @LastEditTime: 2025-07-22 15:29:54
 * @LastEditors: mulingyuer
 * @Description: lora基本信息
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\BasicInfo\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="LoRA 名称" prop="config.name" popover-content="name">
		<el-input v-model="ruleForm.config.name" placeholder="请输入LoRA名称" />
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 触发词" prop="config.trigger_word" popover-content="trigger_word">
		<el-input
			v-model="ruleForm.config.trigger_word"
			placeholder="请输入触发词，多个词用英文逗号分隔"
			type="textarea"
			:rows="4"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="底模"
		prop="config.model.name_or_path"
		popover-content="name_or_path"
	>
		<FileSelector v-model="ruleForm.config.model.name_or_path" placeholder="请选择训练用的底模" />
	</PopoverFormItem>
	<PopoverFormItem
		label="LoRA 保存路径"
		prop="config.training_folder"
		popover-content="training_folder"
	>
		<FolderSelector v-model="ruleForm.config.training_folder" placeholder="请选择LoRA保存路径" />
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
