<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 16:48:15
 * @LastEditTime: 2025-09-04 09:00:18
 * @LastEditors: mulingyuer
 * @Description: 杂项设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\MiscSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="杂项设置">
		<PopoverFormItem
			label="每 N epoch（轮）自动保存一次模型"
			prop="config.save_every_n_epochs"
			popover-content="save_every_n_epochs"
		>
			<el-input-number
				v-model.number="ruleForm.config.save_every_n_epochs"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="可以每 n 轮或分钟检查一次训练状态"
			prop="config.checkpoint_every_n_minutes"
			popover-content="checkpoint_every_n_minutes"
		>
			<el-input-number
				v-model.number="ruleForm.config.checkpoint_every_n_minutes"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="除非您有大量 VRAM，否则始终打开"
			prop="config.activation_checkpointing"
			popover-content="activation_checkpointing"
		>
			<el-switch v-model="ruleForm.config.activation_checkpointing" />
		</PopoverFormItem>
		<PopoverFormItem
			label="控制 Deepspeed 如何决定将层划分到 GPU 上"
			prop="config.partition_method"
			popover-content="partition_method"
		>
			<el-select
				v-model="ruleForm.config.partition_method"
				placeholder="请选择控制 Deepspeed 如何决定将层划分到 GPU 上"
			>
				<el-option label="parameters" value="parameters" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem label="模型保存 dtype" prop="config.model.dtype" popover-content="dtype">
			<el-select v-model="ruleForm.config.model.dtype" placeholder="请选择模型保存 dtype">
				<el-option label="bfloat16" value="bfloat16" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="缓存潜在变量和文本嵌入的批大小"
			prop="config.caching_batch_size"
			popover-content="caching_batch_size"
		>
			<el-input-number
				v-model.number="ruleForm.config.caching_batch_size"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="Deepspeed 记录到控制台的频率"
			prop="config.steps_per_print"
			popover-content="steps_per_print"
		>
			<el-input-number v-model.number="ruleForm.config.steps_per_print" :step="1" step-strictly />
		</PopoverFormItem>
		<PopoverFormItem
			label="提取视频帧的方式"
			prop="config.video_clip_mode"
			popover-content="video_clip_mode"
		>
			<el-select v-model="ruleForm.config.video_clip_mode" placeholder="请选择提取视频帧的方式">
				<el-option label="一个从视频开头开始的剪辑" value="single_beginning" />
				<el-option label="一个从视频中间开始的剪辑（等量裁剪掉开始和结束）" value="single_middle" />
				<el-option label="提取最少数量的剪辑以覆盖视频的全部范围" value="multiple_overlapping" />
			</el-select>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
