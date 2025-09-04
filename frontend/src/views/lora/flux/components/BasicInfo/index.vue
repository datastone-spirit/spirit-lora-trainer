<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 17:13:09
 * @LastEditTime: 2025-09-03 11:54:43
 * @LastEditors: mulingyuer
 * @Description: LoRA 基本信息
 * @FilePath: \frontend\src\views\lora\flux\components\BasicInfo\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="LoRA 名称" prop="config.output_name" popover-content="output_name">
		<el-input v-model="ruleForm.config.output_name" placeholder="请输入LoRA名称" />
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 触发词" prop="dataset.class_tokens" popover-content="class_tokens">
		<el-input
			v-model="ruleForm.dataset.class_tokens"
			placeholder="请输入触发词，多个词用英文逗号分隔"
			type="textarea"
			:rows="4"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="底模"
		prop="config.pretrained_model_name_or_path"
		popover-content="pretrained_model_name_or_path"
	>
		<FileSelector
			v-model="ruleForm.config.pretrained_model_name_or_path"
			placeholder="请选择训练用的底模，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert" label="AE 模型文件" prop="config.ae" popover-content="ae">
		<FileSelector
			v-model="ruleForm.config.ae"
			placeholder="请选择AE 模型文件，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="CLIP-L 模型文件"
		prop="config.clip_l"
		popover-content="clip_l"
	>
		<FileSelector
			v-model="ruleForm.config.clip_l"
			placeholder="请选择CLIP-L 模型文件，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="T5XXL 模型文件"
		prop="config.t5xxl"
		popover-content="t5xxl"
	>
		<FileSelector
			v-model="ruleForm.config.t5xxl"
			placeholder="请选择T5XXL 模型文件，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 保存路径" prop="config.output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.config.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="模型保存格式"
		prop="config.save_model_as"
		popoverContent="save_model_as"
	>
		<el-select v-model="ruleForm.config.save_model_as" placeholder="请选择模型保存格式">
			<el-option label="safetensors" value="safetensors" />
			<el-option label="pt" value="pt" />
			<el-option label="ckpt" value="ckpt" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="模型保存精度"
		prop="config.save_precision"
		popover-content="save_precision"
	>
		<el-select v-model="ruleForm.config.save_precision" placeholder="请选择模型保存精度">
			<el-option label="fp16" value="fp16" />
			<el-option label="float" value="float" />
			<el-option label="bf16" value="bf16" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="保存训练状态 配合 resume 参数可以继续从某个状态训练"
		prop="config.save_state"
		popover-content="save_state"
	>
		<el-switch v-model="ruleForm.config.save_state" />
	</PopoverFormItem>
	<el-form-item v-show="ruleForm.config.save_state">
		<el-alert
			class="no-select"
			title="注意：开启保存训练状态功能将增加存储空间的使用量，请确保您的存储空间充足。"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
	<PopoverFormItem
		v-show="isExpert"
		label="从某个 save_state 保存的中断状态继续训练"
		prop="config.resume"
		popover-content="resume"
	>
		<FolderSelector
			v-model="ruleForm.config.resume"
			placeholder="请选择中断状态的模型目录（state目录）"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="指定要交换的网络块数量"
		prop="config.blocks_to_swap"
		popover-content="blocks_to_swap"
	>
		<el-input-number
			v-model.number="ruleForm.config.blocks_to_swap"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<el-form-item v-show="isExpert">
		<el-alert
			class="no-select"
			title="注意：指定要交换的网络块数量数值越大，训练时长增加的越长"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
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
