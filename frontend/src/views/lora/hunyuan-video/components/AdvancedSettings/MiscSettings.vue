<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 16:48:15
 * @LastEditTime: 2025-01-06 16:59:28
 * @LastEditors: mulingyuer
 * @Description: 杂项设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\MiscSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="杂项设置">
		<PopoverFormItem
			label="每 N epoch（轮）自动保存一次模型"
			prop="save_every_n_epochs"
			popover-content="save_every_n_epochs"
		>
			<el-input-number v-model.number="ruleForm.save_every_n_epochs" :step="1" step-strictly />
		</PopoverFormItem>
		<PopoverFormItem
			label="可以每 n 轮或分钟检查一次训练状态"
			prop="checkpoint_every_n_minutes"
			popover-content="checkpoint_every_n_minutes"
		>
			<el-input-number
				v-model.number="ruleForm.checkpoint_every_n_minutes"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="除非您有大量 VRAM，否则始终打开"
			prop="activation_checkpointing"
			popover-content="activation_checkpointing"
		>
			<el-switch v-model="ruleForm.activation_checkpointing" />
		</PopoverFormItem>
		<PartitionMethodSelector
			v-model="ruleForm.partition_method"
			label="控制 Deepspeed 如何决定将层划分到 GPU 上"
			prop="partition_method"
			placeholder="请选择控制 Deepspeed 如何决定将层划分到 GPU 上"
			popover-content="partition_method"
		/>
		<ModelDtypeSelector
			v-model="ruleForm.save_dtype"
			label="模型保存 dtype"
			prop="save_dtype"
			placeholder="请选择模型保存 dtype"
			popover-content="save_dtype"
		/>
		<PopoverFormItem
			label="缓存潜在变量和文本嵌入的批大小"
			prop="caching_batch_size"
			popover-content="caching_batch_size"
		>
			<el-input-number v-model.number="ruleForm.caching_batch_size" :step="1" step-strictly />
		</PopoverFormItem>
		<PopoverFormItem
			label="Deepspeed 记录到控制台的频率"
			prop="steps_per_print"
			popover-content="steps_per_print"
		>
			<el-input-number v-model.number="ruleForm.steps_per_print" :step="1" step-strictly />
		</PopoverFormItem>
		<VideoClipModeSelector
			v-model="ruleForm.video_clip_mode"
			label="提取视频帧的方式"
			prop="video_clip_mode"
			placeholder="请选择提取视频帧的方式"
			popover-content="video_clip_mode"
		/>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import PartitionMethodSelector from "../Form/PartitionMethodSelector.vue";
import ModelDtypeSelector from "../Form/ModelDtypeSelector.vue";
import VideoClipModeSelector from "../Form/VideoClipModeSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
