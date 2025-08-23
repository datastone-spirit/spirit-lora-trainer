<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 14:21:10
 * @LastEditTime: 2025-08-13 16:48:59
 * @LastEditors: mulingyuer
 * @Description: 性能优化
 * @FilePath: \frontend\src\views\lora\qwen-image\components\AdvancedSettings\Optimization.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="性能优化">
		<PopoverFormItem
			label="权重标准化防梯度爆炸"
			prop="config.scale_weight_norms"
			popover-content="scale_weight_norms"
		>
			<el-input-number v-model.number="ruleForm.config.scale_weight_norms" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="梯度裁剪阈值（防止梯度爆炸）"
			prop="config.max_grad_norm"
			popover-content="max_grad_norm"
		>
			<el-input-number v-model.number="ruleForm.config.max_grad_norm" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="通过时间换空间策略，减少约30%显存占用，开启会增加训练时间"
			prop="config.gradient_checkpointing"
			popover-content="gradient_checkpointing"
		>
			<el-switch v-model="ruleForm.config.gradient_checkpointing" />
		</PopoverFormItem>
		<PopoverFormItem label="使用PyTorch原生注意力" prop="config.sdpa" popover-content="sdpa">
			<el-switch v-model="ruleForm.config.sdpa" />
		</PopoverFormItem>
		<PopoverFormItem
			label="是否使用SageAttention优化节省显存"
			prop="config.sage_attn"
			popover-content="sage_attn"
		>
			<el-switch v-model="ruleForm.config.sage_attn" />
		</PopoverFormItem>
		<PopoverFormItem
			label="启用xformers优化库（需要安装xformers），用于CrossAttention层的显存优化"
			prop="config.xformers"
			popover-content="xformers"
		>
			<el-switch v-model="ruleForm.config.xformers" />
		</PopoverFormItem>
		<PopoverFormItem
			label="是否使用split attention优化（需要XFORMERS）"
			prop="config.split_attn"
			popover-content="split_attn"
		>
			<el-switch v-model="ruleForm.config.split_attn" />
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
		<PopoverFormItem label="启用基础FP8模式" prop="config.fp8_base" popover-content="fp8_base">
			<el-switch v-model="ruleForm.config.fp8_base" @change="onFP8BaseChange" />
		</PopoverFormItem>
		<PopoverFormItem label="启用FP8缩放模式" prop="config.fp8_scaled" popover-content="fp8_scaled">
			<el-switch v-model="ruleForm.config.fp8_scaled" @change="onFP8ScaledChange" />
		</PopoverFormItem>
		<PopoverFormItem
			label="文本编码器优化，显存小于16GB建议开启"
			prop="config.fp8_vl"
			popover-content="fp8_vl"
		>
			<el-switch v-model="ruleForm.config.fp8_vl" @change="onFP8ScaledChange" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { ElSwitch } from "element-plus";
import type { RuleForm } from "../../types";

type ChangeCallback = InstanceType<typeof ElSwitch>["onChange"];

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

// 监听fp8_base和fp8_scaled的变化，如果同时启用，则自动关闭另一个
const onFP8BaseChange: ChangeCallback = (val) => {
	if (val && ruleForm.value.config.fp8_scaled) {
		ruleForm.value.config.fp8_scaled = false;
	}
};
const onFP8ScaledChange: ChangeCallback = (val) => {
	if (val && ruleForm.value.config.fp8_base) {
		ruleForm.value.config.fp8_base = false;
	}
};
</script>

<style scoped></style>
