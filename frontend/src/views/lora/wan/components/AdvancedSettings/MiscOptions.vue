<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 15:51:35
 * @LastEditTime: 2025-03-24 16:19:55
 * @LastEditors: mulingyuer
 * @Description: 杂项设置
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\MiscOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="杂项设置">
		<PopoverFormItem
			label="显存优化"
			prop="gradient_checkpointing"
			popover-content="gradient_checkpointing"
		>
			<el-switch v-model="ruleForm.gradient_checkpointing" />
		</PopoverFormItem>
		<PopoverFormItem
			label="运动流控制参数"
			prop="discrete_flow_shift"
			popover-content="discrete_flow_shift"
		>
			<el-input-number
				v-model.number="ruleForm.discrete_flow_shift"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem label="文本长度限制" prop="text_len" popover-content="text_len">
			<el-input-number v-model.number="ruleForm.text_len" :step="1" step-strictly :min="0" />
		</PopoverFormItem>
		<PopoverFormItem label="分类器引导强度" prop="guidance_scale" popover-content="guidance_scale">
			<el-input-number v-model.number="ruleForm.guidance_scale" :step="1" step-strictly :min="0" />
		</PopoverFormItem>
		<PopoverFormItem label="sigmoid 缩放" prop="sigmoid_scale" popover-content="sigmoid_scale">
			<el-input-number v-model.number="ruleForm.sigmoid_scale" :step="1" step-strictly />
		</PopoverFormItem>
		<BaseSelector
			v-model="ruleForm.weighting_scheme"
			label="权重分配方案，控制训练中各部分的权重分布"
			prop="weighting_scheme"
			popoverContent="weighting_scheme"
			:options="weightingSchemeOptions"
		/>
		<PopoverFormItem label="logit_normal均值" prop="logit_mean" popover-content="logit_mean">
			<el-input-number v-model.number="ruleForm.logit_mean" :step="0.1" />
		</PopoverFormItem>
		<PopoverFormItem label="logit_normal标准差" prop="logit_std" popover-content="logit_std">
			<el-input-number v-model.number="ruleForm.logit_std" :step="0.1" />
		</PopoverFormItem>
		<PopoverFormItem label="mode加权缩放因子" prop="mode_scale" popover-content="mode_scale">
			<el-input-number v-model.number="ruleForm.mode_scale" :step="0.01" />
		</PopoverFormItem>
		<PopoverFormItem label="最小时间步（0-999）" prop="min_timestep" popover-content="min_timestep">
			<el-input-number
				v-model.number="ruleForm.min_timestep"
				:step="1"
				step-strictly
				:min="0"
				:max="999"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="最大时间步（1-1000）"
			prop="max_timestep"
			popover-content="max_timestep"
		>
			<el-input-number
				v-model.number="ruleForm.max_timestep"
				:step="1"
				step-strictly
				:min="1"
				:max="1000"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="扩散模型总时间步"
			prop="num_train_timesteps"
			popover-content="num_train_timesteps"
		>
			<el-input-number
				v-model.number="ruleForm.num_train_timesteps"
				:step="1"
				step-strictly
				:min="1"
				:max="1000"
			/>
		</PopoverFormItem>
		<PopoverFormItem label="视频patch划分" prop="patch_size" popover-content="patch_size">
			<el-input v-model="ruleForm.patch_size" placeholder="请输入视频patch划分" />
		</PopoverFormItem>

		<PopoverFormItem label="单帧训练模式" prop="target_frames" popover-content="target_frames">
			<el-input v-model="ruleForm.target_frames" placeholder="请输入单帧训练模式" />
		</PopoverFormItem>
		<BaseSelector
			v-model="ruleForm.frame_extraction"
			label="提取首帧方法"
			prop="frame_extraction"
			popoverContent="frame_extraction"
			:options="frameExtractionOptions"
		/>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import type { BaseSelectorProps } from "@/components/Form/BaseSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 权重分配方案选项 */
const weightingSchemeOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "sigma_sqrt",
		value: "sigma_sqrt"
	},
	{
		label: "logit_normal",
		value: "logit_normal"
	},
	{
		label: "mode",
		value: "mode"
	},
	{
		label: "cosmap",
		value: "cosmap"
	},
	{
		label: "uniform",
		value: "uniform"
	},
	{
		label: "none",
		value: "none"
	}
]);

/** 提取首帧方法选项 */
const frameExtractionOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "开头提取",
		value: "head"
	},
	{
		label: "中间部分提取",
		value: "chunk"
	},
	{
		label: "连续提取",
		value: "slide"
	},
	{
		label: "固定时间间隔提取",
		value: "uniform"
	}
]);
</script>

<style scoped></style>
