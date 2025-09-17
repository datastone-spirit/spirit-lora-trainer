<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 09:10:38
 * @LastEditTime: 2025-09-03 14:47:21
 * @LastEditors: mulingyuer
 * @Description: 模型参数
 * @FilePath: \frontend\src\views\lora\flux\components\ModelParameters\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="随机种子" prop="config.seed" popover-content="seed">
		<Seed v-model.number="ruleForm.config.seed" />
	</PopoverFormItem>
	<PopoverFormItem
		label="workers 数量"
		prop="config.max_data_loader_n_workers"
		popover-content="max_data_loader_n_workers"
	>
		<el-input-number
			v-model.number="ruleForm.config.max_data_loader_n_workers"
			:step="1"
			step-strictly
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效"
		prop="config.learning_rate"
		popover-content="learning_rate"
	>
		<el-input-number v-model.number="ruleForm.config.learning_rate" :step="0.0001" />
	</PopoverFormItem>
	<PopoverFormItem
		label="每 N epoch（轮）自动保存一次模型"
		prop="config.save_every_n_epochs"
		popover-content="save_every_n_epochs"
	>
		<el-input-number
			v-model.number="ruleForm.config.save_every_n_epochs"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="CFG 引导缩放"
		prop="config.guidance_scale"
		popover-content="guidance_scale"
	>
		<el-input-number v-model.number="ruleForm.config.guidance_scale" :step="0.01" />
	</PopoverFormItem>
	<PopoverFormItem
		label="时间步采样"
		prop="config.timestep_sampling"
		popover-content="timestep_sampling"
	>
		<el-select v-model="ruleForm.config.timestep_sampling" placeholder="请选择时间步采样">
			<el-option label="sigma" value="sigma" />
			<el-option label="uniform" value="uniform" />
			<el-option label="sigmoid" value="sigmoid" />
			<el-option label="shift" value="shift" />
			<el-option label="flux_shift" value="flux_shift" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		label="网络维度，常用 4~128，不是越大越好, 低dim可以降低显存占用"
		prop="config.network_dim"
		popover-content="network_dim"
	>
		<el-input-number v-model.number="ruleForm.config.network_dim" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="设置模型输出的logit均值，用于调整分布"
		prop="config.logit_mean"
		popover-content="logit_mean"
	>
		<el-input-number v-model.number="ruleForm.config.logit_mean" :step="0.1" :min="0" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="设置模型输出的logit标准差，控制输出的离散程度"
		prop="config.logit_std"
		popover-content="logit_std"
	>
		<el-input-number v-model.number="ruleForm.config.logit_std" :step="0.1" :min="0" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="模型模式的缩放因子，影响模型行为"
		prop="config.mode_scale"
		popover-content="mode_scale"
	>
		<el-input-number v-model.number="ruleForm.config.mode_scale" :step="0.01" :min="0" />
	</PopoverFormItem>
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
