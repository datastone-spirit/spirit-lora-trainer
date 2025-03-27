<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 16:10:12
 * @LastEditTime: 2025-03-26 16:13:52
 * @LastEditors: mulingyuer
 * @Description: 高级显存优化
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\AdvancedMemoryOptimizer.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="高级显存优化">
		<PopoverFormItem
			label="通过累积多个小批次的梯度来等效大batch_size训练"
			prop="config.gradient_accumulation_steps"
			popover-content="gradient_accumulation_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.gradient_accumulation_steps"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="通过时间换空间策略，减少约30%显存占用，开启会增加训练时间"
			prop="config.gradient_checkpointing"
			popover-content="gradient_checkpointing"
		>
			<el-switch v-model="ruleForm.config.gradient_checkpointing" />
		</PopoverFormItem>
		<PopoverFormItem
			label="将图像输入（img_in）和文本输入（txt_in）张量保留在CPU内存中，减少显存占用"
			prop="config.img_in_txt_in_offloading"
			popover-content="img_in_txt_in_offloading"
		>
			<el-switch v-model="ruleForm.config.img_in_txt_in_offloading" />
		</PopoverFormItem>
		<PopoverFormItem label="启用FlashAttention 3" prop="config.flash3" popover-content="flash3">
			<el-switch v-model="ruleForm.config.flash3" />
		</PopoverFormItem>
		<PopoverFormItem
			label="启用FlashAttention优化CrossAttention计算"
			prop="config.flash_attn"
			popover-content="flash_attn"
		>
			<el-switch v-model="ruleForm.config.flash_attn" />
		</PopoverFormItem>
		<PopoverFormItem
			label="是否使用SageAttention优化节省显存"
			prop="config.sage_attn"
			popover-content="sage_attn"
		>
			<el-switch v-model="ruleForm.config.sage_attn" />
		</PopoverFormItem>
		<PopoverFormItem label="使用PyTorch原生注意力" prop="config.sdpa" popover-content="sdpa">
			<el-switch v-model="ruleForm.config.sdpa" />
		</PopoverFormItem>
		<PopoverFormItem
			label="是否使用split attention优化（需要XFORMERS）"
			prop="config.split_attn"
			popover-content="split_attn"
		>
			<el-switch v-model="ruleForm.config.split_attn" />
		</PopoverFormItem>
		<PopoverFormItem
			label="启用xformers优化库（需要安装xformers），用于CrossAttention层的显存优化"
			prop="config.xformers"
			popover-content="xformers"
		>
			<el-switch v-model="ruleForm.config.xformers" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
