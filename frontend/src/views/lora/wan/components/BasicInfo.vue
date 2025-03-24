<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 10:12:06
 * @LastEditTime: 2025-03-24 16:15:51
 * @LastEditors: mulingyuer
 * @Description: lora基本信息
 * @FilePath: \frontend\src\views\lora\wan\components\BasicInfo.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="训练任务类型" prop="task" popover-content="task">
		<el-radio-group v-model="ruleForm.task">
			<el-radio-button label="图片训练（i2v）" value="i2v_14B" />
			<el-radio-button label="文本训练（t2v）" value="t2v_14B" />
		</el-radio-group>
	</PopoverFormItem>
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
	<PopoverFormItem label="LoRA 保存路径" prop="output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="保存训练状态 配合 resume 参数可以继续从某个状态训练"
		prop="save_state"
		popover-content="save_state"
	>
		<el-switch v-model="ruleForm.save_state" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="从某个 save_state 保存的中断状态继续训练"
		prop="resume"
		popover-content="resume"
	>
		<FileSelector v-model="ruleForm.resume" placeholder="请选择中断状态的模型" />
	</PopoverFormItem>
	<PopoverFormItem label="LoRA维度" prop="network_dim" popover-content="network_dim">
		<el-input-number v-model.number="ruleForm.network_dim" :step="1" step-strictly :min="0" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
