<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 15:28:48
 * @LastEditTime: 2024-12-26 11:16:22
 * @LastEditors: mulingyuer
 * @Description: 训练相关参数
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\TrainingOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="训练相关参数">
		<PopoverFormItem
			label="梯度检查点"
			:prop="formProps.gradient_checkpointing"
			popover-content="gradient_checkpointing"
		>
			<el-switch v-model="ruleForm.gradient_checkpointing" />
		</PopoverFormItem>
		<PopoverFormItem
			label="梯度累加步数"
			:prop="formProps.gradient_accumulation_steps"
			popover-content="gradient_accumulation_steps"
		>
			<el-input-number
				v-model.number="ruleForm.gradient_accumulation_steps"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="仅训练 U-Net 训练SDXL Lora时推荐开启"
			:prop="formProps.network_train_unet_only"
			popover-content="network_train_unet_only"
		>
			<el-switch v-model="ruleForm.network_train_unet_only" />
		</PopoverFormItem>
		<PopoverFormItem
			label="仅训练文本编码器"
			:prop="formProps.network_train_text_encoder_only"
			popover-content="network_train_text_encoder_only"
		>
			<el-switch v-model="ruleForm.network_train_text_encoder_only" />
		</PopoverFormItem>
		<PopoverFormItem
			label="输出训练配置"
			:prop="formProps.output_config"
			popover-content="output_config"
		>
			<el-switch v-model="ruleForm.output_config" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm, RuleFormProps } from "../../types";

export interface TrainingOptionsProps {
	/** 表单props */
	formProps: RuleFormProps;
}

defineProps<TrainingOptionsProps>();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
