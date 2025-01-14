<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 15:28:48
 * @LastEditTime: 2025-01-10 11:18:54
 * @LastEditors: mulingyuer
 * @Description: 训练相关参数
 * @FilePath: \frontend\src\views\lora\sdxl\components\AdvancedSettings\TrainingOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="训练相关参数">
		<PopoverFormItem
			label="梯度检查点"
			prop="gradient_checkpointing"
			popover-content="gradient_checkpointing"
		>
			<el-switch v-model="ruleForm.gradient_checkpointing" />
		</PopoverFormItem>
		<PopoverFormItem
			label="梯度累加步数"
			prop="gradient_accumulation_steps"
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
			prop="network_train_unet_only"
			popover-content="network_train_unet_only"
		>
			<el-switch v-model="ruleForm.network_train_unet_only" />
		</PopoverFormItem>
		<PopoverFormItem
			label="仅训练文本编码器"
			prop="network_train_text_encoder_only"
			popover-content="network_train_text_encoder_only"
		>
			<el-switch v-model="ruleForm.network_train_text_encoder_only" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
