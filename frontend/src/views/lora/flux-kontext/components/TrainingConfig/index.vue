<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 15:34:35
 * @LastEditTime: 2025-07-23 17:40:54
 * @LastEditors: mulingyuer
 * @Description: 训练配置
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\TrainingConfig\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem label="批量大小" prop="train.batch_size" popover-content="batch_size">
				<el-input-number
					v-model.number="ruleForm.train.batch_size"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="训练步数" prop="train.steps" popover-content="steps">
				<el-input-number v-model.number="ruleForm.train.steps" :step="1" step-strictly :min="1" />
			</PopoverFormItem>
		</el-col>
		<template v-if="isExpert">
			<el-col :span="12">
				<PopoverFormItem
					label="梯度累积"
					prop="train.gradient_accumulation_steps"
					popover-content="gradient_accumulation_steps"
				>
					<el-input-number
						v-model.number="ruleForm.train.gradient_accumulation_steps"
						:step="1"
						step-strictly
						:min="1"
					/>
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem label="学习率" prop="train.lr" popover-content="lr">
					<el-input-number v-model.number="ruleForm.train.lr" :step="0.0001" :min="0" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="24">
				<PopoverFormItem label="优化器" prop="train.optimizer" popover-content="optimizer">
					<OptimizerSelect v-model="ruleForm.train.optimizer" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="权重衰减"
					prop="train.optimizer_params.weight_decay"
					popover-content="weight_decay"
				>
					<el-input-number
						v-model.number="ruleForm.train.optimizer_params.weight_decay"
						:step="0.0001"
						:min="0"
					/>
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="时间步类型"
					prop="train.timestep_type"
					popover-content="timestep_type"
				>
					<TimestepTypeSelect v-model="ruleForm.train.timestep_type" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="时间步长偏差"
					prop="train.content_or_style"
					popover-content="content_or_style"
				>
					<ContentStyleSelect v-model="ruleForm.train.content_or_style" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="噪声调度器"
					prop="train.noise_scheduler"
					popover-content="noise_scheduler"
				>
					<NoiseSchedulerSelect v-model="ruleForm.train.noise_scheduler" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem label="使用 EMA" prop="train.ema_config.use_ema" popover-content="use_ema">
					<el-switch v-model="ruleForm.train.ema_config.use_ema" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="EMA 衰减"
					prop="train.ema_config.ema_decay"
					popover-content="ema_decay"
				>
					<el-input-number
						v-model.number="ruleForm.train.ema_config.ema_decay"
						:step="0.01"
						:min="0"
					/>
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="卸载文本编码器"
					prop="train.unload_text_encoder"
					popover-content="unload_text_encoder"
				>
					<el-switch v-model="ruleForm.train.unload_text_encoder" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="正则化-差分输出保留"
					prop="train.diff_output_preservation"
					popover-content="diff_output_preservation"
				>
					<el-switch v-model="ruleForm.train.diff_output_preservation" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="12">
				<PopoverFormItem
					label="DOP 损失乘数"
					prop="train.diff_output_preservation_multiplier"
					popover-content="diff_output_preservation_multiplier"
				>
					<el-input-number
						v-model.number="ruleForm.train.diff_output_preservation_multiplier"
						:step="1"
						step-strictly
						:min="0"
					/>
				</PopoverFormItem>
			</el-col>
			<el-col :span="24">
				<PopoverFormItem
					label="DOP 保护类"
					prop="train.diff_output_preservation_class"
					popover-content="diff_output_preservation_class"
				>
					<el-input
						v-model="ruleForm.train.diff_output_preservation_class"
						placeholder="默认person"
					/>
				</PopoverFormItem>
			</el-col>
		</template>
	</el-row>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";
import OptimizerSelect from "./OptimizerSelect.vue";
import TimestepTypeSelect from "./TimestepTypeSelect.vue";
import ContentStyleSelect from "./ContentStyleSelect.vue";
import NoiseSchedulerSelect from "./NoiseSchedulerSelect.vue";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
