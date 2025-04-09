<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 15:46:13
 * @LastEditTime: 2025-04-09 11:17:27
 * @LastEditors: mulingyuer
 * @Description: 训练过程控制选项
 * @FilePath: \frontend\src\views\lora\wan-video\components\AdvancedSettings\TrainingControlOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="训练过程控制">
		<PopoverFormItem
			label="每N步保存模型"
			prop="config.save_every_n_steps"
			popover-content="save_every_n_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.save_every_n_steps"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="保留最近N个epoch的检查点"
			prop="config.save_last_n_epochs"
			popover-content="save_last_n_epochs"
		>
			<el-input-number
				v-model.number="ruleForm.config.save_last_n_epochs"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="保留最近N步训练状态"
			prop="config.save_last_n_epochs_state"
			popover-content="save_last_n_epochs_state"
		>
			<el-input-number
				v-model.number="ruleForm.config.save_last_n_epochs_state"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="保留最近N步的检查点"
			prop="config.save_last_n_steps"
			popover-content="save_last_n_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.save_last_n_steps"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="专门控制state步数保留（覆盖save_last_n_steps）"
			prop="config.save_last_n_steps_state"
			popover-content="save_last_n_steps_state"
		>
			<el-input-number
				v-model.number="ruleForm.config.save_last_n_steps_state"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="保存训练状态 配合 resume 参数可以继续从某个状态训练"
			prop="config.save_state"
			popover-content="save_state"
		>
			<el-switch v-model="ruleForm.config.save_state" />
		</PopoverFormItem>
		<PopoverFormItem
			label="训练结束时强制保存state（即使未启用save_state）"
			prop="config.save_state_on_train_end"
			popover-content="save_state_on_train_end"
		>
			<el-switch v-model="ruleForm.config.save_state_on_train_end" />
		</PopoverFormItem>
		<PopoverFormItem
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
			label="权重标准化防梯度爆炸"
			prop="config.scale_weight_norms"
			popover-content="scale_weight_norms"
		>
			<el-input-number v-model.number="ruleForm.config.scale_weight_norms" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="梯度裁剪阈值（防止梯度爆炸）"
			prop="config.max_grad_norm"
			popover-content="max_grad_norm"
		>
			<el-input-number v-model.number="ruleForm.config.max_grad_norm" :step="0.1" :min="0" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
