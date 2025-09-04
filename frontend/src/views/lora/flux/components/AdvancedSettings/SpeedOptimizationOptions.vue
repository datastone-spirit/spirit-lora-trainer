<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:14:51
 * @LastEditTime: 2025-09-03 15:08:58
 * @LastEditors: mulingyuer
 * @Description: 速度优化选项
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\SpeedOptimizationOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="速度优化选项">
		<PopoverFormItem
			label="训练混合精度, RTX30系列以后也可以指定bf16"
			prop="config.mixed_precision"
			popover-content="mixed_precision"
		>
			<el-select v-model="ruleForm.config.mixed_precision" placeholder="请选择训练混合精度">
				<el-option label="no" value="no" />
				<el-option label="fp16" value="fp16" />
				<el-option label="bf16" value="bf16" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem label="完全使用 FP16 精度" prop="config.full_fp16" popover-content="full_fp16">
			<el-switch v-model="ruleForm.config.full_fp16" />
		</PopoverFormItem>
		<PopoverFormItem label="完全使用 BF16 精度" prop="config.full_bf16" popover-content="full_bf16">
			<el-switch v-model="ruleForm.config.full_bf16" />
		</PopoverFormItem>
		<PopoverFormItem
			label="对基础模型使用 FP8 精度"
			prop="config.fp8_base"
			popover-content="fp8_base"
		>
			<el-switch v-model="ruleForm.config.fp8_base" />
		</PopoverFormItem>
		<PopoverFormItem
			label="仅对 U-Net 使用 FP8 精度（CLIP-L不使用）"
			prop="config.fp8_base_unet"
			popover-content="fp8_base_unet"
		>
			<el-switch v-model="ruleForm.config.fp8_base_unet" />
		</PopoverFormItem>
		<PopoverFormItem
			label="不使用半精度 VAE"
			prop="config.no_half_vae"
			popover-content="no_half_vae"
		>
			<el-switch v-model="ruleForm.config.no_half_vae" />
		</PopoverFormItem>
		<PopoverFormItem label="启用 sdpa" prop="config.sdpa" popover-content="sdpa">
			<el-switch v-model="ruleForm.config.sdpa" />
		</PopoverFormItem>
		<PopoverFormItem
			label="低内存模式 该模式下会将 U-net、文本编码器、VAE 直接加载到显存中"
			prop="config.lowram"
			popover-content="lowram"
		>
			<el-switch v-model="ruleForm.config.lowram" />
		</PopoverFormItem>
		<PopoverFormItem
			label="缓存图像 latent, 缓存 VAE 输出以减少 VRAM 使用"
			prop="config.cache_latents"
			popover-content="cache_latents"
		>
			<el-switch v-model="ruleForm.config.cache_latents" />
		</PopoverFormItem>
		<PopoverFormItem
			label="缓存图像 latent 到磁盘"
			prop="config.cache_latents_to_disk"
			popover-content="cache_latents_to_disk"
		>
			<el-switch v-model="ruleForm.config.cache_latents_to_disk" />
		</PopoverFormItem>
		<PopoverFormItem
			label="是否缓存文本编码器结果"
			prop="config.cache_text_encoder_outputs"
			popover-content="cache_text_encoder_outputs"
		>
			<el-switch v-model="ruleForm.config.cache_text_encoder_outputs" />
		</PopoverFormItem>
		<PopoverFormItem
			label="是否把文本编码器结果缓存在磁盘"
			prop="config.cache_text_encoder_outputs_to_disk"
			popover-content="cache_text_encoder_outputs_to_disk"
		>
			<el-switch v-model="ruleForm.config.cache_text_encoder_outputs_to_disk" />
		</PopoverFormItem>
		<PopoverFormItem
			label="保留加载训练集的worker，减少每个 epoch 之间的停顿"
			prop="config.persistent_data_loader_workers"
			popover-content="persistent_data_loader_workers"
		>
			<el-switch v-model="ruleForm.config.persistent_data_loader_workers" />
		</PopoverFormItem>
		<PopoverFormItem
			label="vae 编码批量大小"
			prop="config.vae_batch_size"
			popover-content="vae_batch_size"
		>
			<el-input-number
				v-model.number="ruleForm.config.vae_batch_size"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
