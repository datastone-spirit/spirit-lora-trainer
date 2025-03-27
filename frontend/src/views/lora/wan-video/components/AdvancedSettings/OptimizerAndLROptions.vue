<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 14:47:20
 * @LastEditTime: 2025-03-26 15:56:15
 * @LastEditors: mulingyuer
 * @Description: 优化器与学习率
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\OptimizerAndLROptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="优化器与学习率">
		<BaseSelector
			v-model="ruleForm.config.optimizer_type"
			label="优化器类型"
			prop="config.optimizer_type"
			popoverContent="optimizer_type"
			:options="optimizerTypeOptions"
		/>
		<PopoverFormItem
			label="自定义优化器选项参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：weight_decay=0.01 betas=.9,.999"
			prop="config.optimizer_args"
			popover-content="optimizer_args"
		>
			<el-input
				v-model="ruleForm.config.optimizer_args"
				:autosize="{ minRows: 4 }"
				type="textarea"
				placeholder="请输入自定义优化器参数"
			/>
		</PopoverFormItem>
		<PopoverFormItem label="学习率" prop="config.learning_rate" popover-content="learning_rate">
			<el-input v-model="ruleForm.config.learning_rate" placeholder="请输入学习率" />
		</PopoverFormItem>
		<PopoverFormItem
			label="学习率衰减步数"
			prop="config.lr_decay_steps"
			popover-content="lr_decay_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.lr_decay_steps"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<BaseSelector
			v-model="ruleForm.config.lr_scheduler"
			label="学习率调度器类型"
			prop="config.lr_scheduler"
			popoverContent="lr_scheduler"
			:options="lrSchedulerOptions"
		/>
		<PopoverFormItem
			label="自定义调度器参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：T_max=100"
			prop="config.lr_scheduler_args"
			popover-content="lr_scheduler_args"
		>
			<el-input
				v-model="ruleForm.config.lr_scheduler_args"
				:autosize="{ minRows: 4 }"
				type="textarea"
				placeholder="请输入自定义调度器参数"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="最小学习率比例"
			prop="config.lr_scheduler_min_lr_ratio"
			popover-content="lr_scheduler_min_lr_ratio"
		>
			<el-input-number
				v-model.number="ruleForm.config.lr_scheduler_min_lr_ratio"
				:step="0.01"
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="余弦重启次数"
			prop="config.lr_scheduler_num_cycles"
			popover-content="lr_scheduler_num_cycles"
		>
			<el-input-number
				v-model.number="ruleForm.config.lr_scheduler_num_cycles"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="多项式衰减强度"
			prop="config.lr_scheduler_power"
			popover-content="lr_scheduler_power"
		>
			<el-input-number v-model.number="ruleForm.config.lr_scheduler_power" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="逆平方根调度时间系数"
			prop="config.lr_scheduler_timescale"
			popover-content="lr_scheduler_timescale"
		>
			<el-input-number
				v-model.number="ruleForm.config.lr_scheduler_timescale"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="自定义调度器模块，示例：linear"
			prop="config.lr_scheduler_type"
			popover-content="lr_scheduler_type"
		>
			<el-input v-model="ruleForm.config.lr_scheduler_type" placeholder="请输入自定义调度器模块" />
		</PopoverFormItem>
		<PopoverFormItem
			label="学习率预热步数"
			prop="config.lr_warmup_steps"
			popover-content="lr_warmup_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.lr_warmup_steps"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 优化器类型选项 */
const optimizerTypeOptions = ref<ElOptions>([
	{
		label: "adamw8bit",
		value: "adamw8bit"
	},
	{
		label: "adafactor",
		value: "adafactor"
	},
	{
		label: "lion",
		value: "lion"
	},
	{
		label: "lion8bit",
		value: "lion8bit"
	}
]);
/** 学习率调度器类型选项 */
const lrSchedulerOptions = ref<ElOptions>([
	{
		label: "linear",
		value: "linear"
	},
	{
		label: "cosine",
		value: "cosine"
	},
	{
		label: "cosine_with_restarts",
		value: "cosine_with_restarts"
	},
	{
		label: "polynomial",
		value: "polynomial"
	},
	{
		label: "constant",
		value: "constant"
	},
	{
		label: "constant_with_warmup",
		value: "constant_with_warmup"
	},
	{
		label: "sqrt",
		value: "sqrt"
	},
	{
		label: "triangular",
		value: "triangular"
	},
	{
		label: "triangular2",
		value: "triangular2"
	}
]);
</script>

<style scoped></style>
