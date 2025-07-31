<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 15:38:25
 * @LastEditTime: 2025-07-30 16:06:27
 * @LastEditors: mulingyuer
 * @Description: 学习率与优化器设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\LRAndOptimizer\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="学习率与优化器设置">
		<PopoverFormItem label="U-Net 学习率" prop="unet_lr" popover-content="unet_lr">
			<el-input v-model="ruleForm.unet_lr" placeholder="请输入U-Net 学习率" />
		</PopoverFormItem>
		<PopoverFormItem
			label="文本编码器学习率"
			prop="text_encoder_lr"
			popover-content="text_encoder_lr"
		>
			<el-input v-model="ruleForm.text_encoder_lr" placeholder="请输入文本编码器学习率" />
		</PopoverFormItem>
		<PopoverFormItem label="学习率调度器设置" prop="lr_scheduler" popover-content="lr_scheduler">
			<LrSchedulerSelect v-model="ruleForm.lr_scheduler" />
		</PopoverFormItem>
		<PopoverFormItem
			label="学习率预热步数"
			prop="lr_warmup_steps"
			popover-content="lr_warmup_steps"
		>
			<el-input-number v-model.number="ruleForm.lr_warmup_steps" :step="1" step-strictly :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="重启次数"
			prop="lr_scheduler_num_cycles"
			popover-content="lr_scheduler_num_cycles"
		>
			<el-input-number
				v-model.number="ruleForm.lr_scheduler_num_cycles"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem label="优化器设置" prop="optimizer_type" popover-content="optimizer_type">
			<OptimizerTypeSelect v-model="ruleForm.optimizer_type" />
		</PopoverFormItem>
		<PopoverFormItem
			label="最小信噪比伽马值, 如果启用推荐为 5"
			prop="min_snr_gamma"
			popover-content="min_snr_gamma"
		>
			<el-input-number v-model.number="ruleForm.min_snr_gamma" :step="1" step-strictly :min="1" />
		</PopoverFormItem>
		<PopoverFormItem
			label="自定义优化器选项参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：weight_decay=0.01 betas=.9,.999"
			prop="optimizer_args"
			popover-content="optimizer_args"
		>
			<el-input
				v-model="ruleForm.optimizer_args"
				:autosize="{ minRows: 4 }"
				type="textarea"
				placeholder="请输入自定义优化器参数"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="权重分配方案，控制训练中各部分的权重分布"
			prop="weighting_scheme"
			popover-content="weighting_scheme"
		>
			<WeightingSchemeSelect v-model="ruleForm.weighting_scheme" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../../types";
import { useSettingsStore } from "@/stores";
import OptimizerTypeSelect from "./OptimizerTypeSelect.vue";
import WeightingSchemeSelect from "./WeightingSchemeSelect.vue";
import LrSchedulerSelect from "./LrSchedulerSelect.vue";

const settingsStore = useSettingsStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
