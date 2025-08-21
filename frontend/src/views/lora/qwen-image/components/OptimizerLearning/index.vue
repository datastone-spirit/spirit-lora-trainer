<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 10:44:14
 * @LastEditTime: 2025-08-21 11:44:25
 * @LastEditors: mulingyuer
 * @Description: 优化器和学习率配置
 * @FilePath: \frontend\src\views\lora\qwen-image\components\OptimizerLearning\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="优化器类型" prop="config.optimizer_type" popoverContent="optimizer_type">
		<el-select v-model="ruleForm.config.optimizer_type" placeholder="请选择优化器类型">
			<el-option label="adamw8bit" value="adamw8bit" />
			<el-option label="adafactor" value="adafactor" />
			<el-option label="lion" value="lion" />
			<el-option label="lion8bit" value="lion8bit" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="自定义优化器选项参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：weight_decay=0.01 betas=.9,.999"
		prop="config.optimizer_args"
		popover-content="optimizer_args"
	>
		<el-input
			v-model="ruleForm.config.optimizer_args"
			:rows="6"
			type="textarea"
			placeholder="请输入自定义优化器参数"
		/>
	</PopoverFormItem>
	<PopoverFormItem label="学习率" prop="config.learning_rate" popover-content="learning_rate">
		<el-input-number v-model.number="ruleForm.config.learning_rate" :step="0.0001" />
	</PopoverFormItem>
	<PopoverFormItem
		label="学习率调度器类型"
		prop="config.lr_scheduler"
		popoverContent="lr_scheduler"
	>
		<el-select v-model="ruleForm.config.lr_scheduler" placeholder="请选择优化器类型">
			<el-option label="linear" value="linear" />
			<el-option label="cosine" value="cosine" />
			<el-option label="cosine_with_restarts" value="cosine_with_restarts" />
			<el-option label="polynomial" value="polynomial" />
			<el-option label="constant" value="constant" />
			<el-option label="constant_with_warmup" value="constant_with_warmup" />
			<el-option label="sqrt" value="sqrt" />
			<el-option label="triangular" value="triangular" />
			<el-option label="triangular2" value="triangular2" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="自定义调度器参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：T_max=100"
		prop="config.lr_scheduler_args"
		popover-content="lr_scheduler_args"
	>
		<el-input
			v-model="ruleForm.config.lr_scheduler_args"
			:rows="6"
			type="textarea"
			placeholder="请输入自定义调度器参数"
		/>
	</PopoverFormItem>
	<el-row v-show="isExpert">
		<el-col :span="12">
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
		</el-col>
		<el-col :span="12">
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
		</el-col>
		<el-col :span="12">
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
		</el-col>
		<el-col :span="12">
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
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="多项式衰减强度"
				prop="config.lr_scheduler_power"
				popover-content="lr_scheduler_power"
			>
				<el-input-number v-model.number="ruleForm.config.lr_scheduler_power" :step="0.1" :min="0" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
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
		</el-col>
	</el-row>
	<PopoverFormItem
		v-show="isExpert"
		label="自定义调度器模块，示例：linear"
		prop="config.lr_scheduler_type"
		popover-content="lr_scheduler_type"
	>
		<el-input v-model="ruleForm.config.lr_scheduler_type" placeholder="请输入自定义调度器模块" />
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
