<!--
 * @Author: mulingyuer
 * @Date: 2025-08-12 17:15:19
 * @LastEditTime: 2025-08-25 10:30:53
 * @LastEditors: mulingyuer
 * @Description: 基本信息
 * @FilePath: \frontend\src\views\lora\qwen-image\components\BasicInfo\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="LoRA 名称" prop="config.output_name" popover-content="output_name">
		<el-input v-model="ruleForm.config.output_name" placeholder="请输入LoRA名称" />
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert" label="底模目录" prop="config.dit" popover-content="dit">
		<FolderSelector
			v-model="ruleForm.config.dit"
			placeholder="请选择训练用的底模所在目录，不知道可以不填，默认使用默认底模目录"
		/>
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert" label="VAE模型路径" prop="config.vae" popover-content="vae">
		<FileSelector
			v-model="ruleForm.config.vae"
			placeholder="请选择VAE模型，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="VAE模型的计算精度"
		prop="config.vae_dtype"
		popover-content="vae_dtype"
	>
		<el-select v-model="ruleForm.config.vae_dtype" placeholder="请选择VAE模型的计算精度">
			<el-option label="float16" value="float16" />
			<el-option label="bfloat16" value="bfloat16" />
			<el-option label="float32" value="float32" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="文本编码器模型路径"
		prop="config.text_encoder"
		popover-content="text_encoder"
	>
		<FileSelector
			v-model="ruleForm.config.text_encoder"
			placeholder="请选择文本编码器模型路径，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 保存路径" prop="config.output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.config.output_dir" placeholder="请选择LoRA保存路径" />
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
