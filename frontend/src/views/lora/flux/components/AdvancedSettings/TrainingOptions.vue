<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 15:28:48
 * @LastEditTime: 2025-09-03 14:51:24
 * @LastEditors: mulingyuer
 * @Description: 训练相关参数
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\TrainingOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="训练相关参数">
		<PopoverFormItem
			label="梯度检查点"
			prop="config.gradient_checkpointing"
			popover-content="gradient_checkpointing"
		>
			<el-switch v-model="ruleForm.config.gradient_checkpointing" />
		</PopoverFormItem>
		<PopoverFormItem
			label="梯度累加步数"
			prop="config.gradient_accumulation_steps"
			popover-content="gradient_accumulation_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.gradient_accumulation_steps"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="仅训练 U-Net 训练SDXL Lora时推荐开启"
			prop="config.network_train_unet_only"
			popover-content="network_train_unet_only"
		>
			<el-switch v-model="ruleForm.config.network_train_unet_only" />
		</PopoverFormItem>
		<PopoverFormItem
			label="仅训练文本编码器"
			prop="config.network_train_text_encoder_only"
			popover-content="network_train_text_encoder_only"
		>
			<el-switch v-model="ruleForm.config.network_train_text_encoder_only" />
		</PopoverFormItem>
		<PopoverFormItem
			label="输出训练配置"
			prop="config.output_config"
			popover-content="output_config"
		>
			<el-switch v-model="ruleForm.config.output_config" />
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="是否禁用内存映射加载Safetensors文件，默认不禁用以节省内存"
			prop="config.disable_mmap_load_safetensors"
			popover-content="disable_mmap_load_safetensors"
		>
			<el-switch v-model="ruleForm.config.disable_mmap_load_safetensors" />
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="验证阶段的最大步数，限制验证时间"
			prop="config.max_validation_steps"
			popover-content="max_validation_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.max_validation_steps"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="每隔多少个epoch进行一次验证"
			prop="config.validate_every_n_epochs"
			popover-content="validate_every_n_epochs"
		>
			<el-input-number
				v-model.number="ruleForm.config.validate_every_n_epochs"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="每隔多少步进行一次验证"
			prop="config.validate_every_n_steps"
			popover-content="validate_every_n_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.validate_every_n_steps"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="验证阶段的随机种子，确保验证可重复"
			prop="config.validation_seed"
			popover-content="validation_seed"
		>
			<el-input-number
				v-model.number="ruleForm.config.validation_seed"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="数据集中用于验证的比例"
			prop="config.validation_split"
			popover-content="validation_split"
		>
			<el-input-number v-model.number="ruleForm.config.validation_split" :step="0.1" :min="0" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
