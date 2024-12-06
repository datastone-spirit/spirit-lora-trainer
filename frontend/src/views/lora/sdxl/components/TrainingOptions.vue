<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 15:28:48
 * @LastEditTime: 2024-12-06 15:50:16
 * @LastEditors: mulingyuer
 * @Description: 训练相关参数
 * @FilePath: \frontend\src\views\lora\sdxl\components\TrainingOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="训练相关参数">
		<PopoverFormItem
			label="最大训练 epoch（轮数）"
			prop="max_train_epochs"
			popover-content="max_train_epochs"
		>
			<el-input-number
				v-model.number="ruleForm.max_train_epochs"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="批量大小, 越高显存占用越高"
			prop="train_batch_size"
			popover-content="train_batch_size"
		>
			<el-input-number
				v-model.number="ruleForm.train_batch_size"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<template v-if="isExpert">
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
		</template>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../types";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
const ruleForm = defineModel({ type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
