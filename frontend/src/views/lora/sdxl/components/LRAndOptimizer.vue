<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 15:38:25
 * @LastEditTime: 2024-12-06 16:19:13
 * @LastEditors: mulingyuer
 * @Description: 学习率与优化器设置
 * @FilePath: \frontend\src\views\lora\sdxl\components\LRAndOptimizer.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="学习率与优化器设置">
		<PopoverFormItem
			v-if="isExpert"
			label="总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效"
			prop="learning_rate"
			popover-content="learning_rate"
		>
			<el-input v-model="ruleForm.learning_rate" placeholder="请输入总学习率" />
		</PopoverFormItem>
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
			<el-select v-model="ruleForm.lr_scheduler" placeholder="请选择学习率调度器设置">
				<el-option
					v-for="item in lrSchedulerOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="学习率预热步数"
			prop="lr_warmup_steps"
			popover-content="lr_warmup_steps"
		>
			<el-input-number v-model.number="ruleForm.lr_warmup_steps" :step="1" step-strictly :min="1" />
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
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem label="优化器设置" prop="optimizer_type" popover-content="optimizer_type">
			<el-select v-model="ruleForm.optimizer_type" placeholder="请选择优化器设置">
				<el-option
					v-for="item in optimizerTypeOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			v-if="isExpert"
			label="最小信噪比伽马值, 如果启用推荐为 5"
			prop="min_snr_gamma"
			popover-content="min_snr_gamma"
		>
			<el-input-number v-model.number="ruleForm.min_snr_gamma" :step="1" step-strictly :min="1" />
		</PopoverFormItem>
		<PopoverFormItem
			v-if="isExpert"
			label="自定义 optimizer_args，回车分割"
			prop="optimizer_args_custom"
			popover-content="optimizer_args"
		>
			<el-input-tag
				v-model="ruleForm.optimizer_args_custom"
				clearable
				placeholder="请输入自定义 optimizer_args"
				tag-type="primary"
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../types";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
const ruleForm = defineModel({ type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

/** 学习率调度器options */
const lrSchedulerOptions = readonly(
	ref([
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
		}
	])
);

/** 优化器设置options */
const optimizerTypeOptions = readonly(
	ref([
		{
			label: "AdamW",
			value: "AdamW"
		},
		{
			label: "AdamW8bit",
			value: "AdamW8bit"
		},
		{
			label: "PagedAdamW8bit",
			value: "PagedAdamW8bit"
		},
		{
			label: "Lion",
			value: "Lion"
		},
		{
			label: "Lion8bit",
			value: "Lion8bit"
		},
		{
			label: "PagedLion8bit",
			value: "PagedLion8bit"
		},
		{
			label: "SGDNesterov",
			value: "SGDNesterov"
		},
		{
			label: "SGDNesterov8bit",
			value: "SGDNesterov8bit"
		},
		{
			label: "DAdaptation",
			value: "DAdaptation"
		},
		{
			label: "DAdaptAdam",
			value: "DAdaptAdam"
		},
		{
			label: "DAdaptAdaGrad",
			value: "DAdaptAdaGrad"
		},
		{
			label: "DAdaptAdanlP",
			value: "DAdaptAdanlP"
		},
		{
			label: "DAdaptAdaMax",
			value: "DAdaptAdaMax"
		},
		{
			label: "DAdaptLion",
			value: "DAdaptLion"
		},
		{
			label: "DAdaptsGD",
			value: "DAdaptsGD"
		},
		{
			label: "AdaFactor",
			value: "AdaFactor"
		},
		{
			label: "Prodigy",
			value: "Prodigy"
		}
	])
);
</script>

<style scoped></style>
