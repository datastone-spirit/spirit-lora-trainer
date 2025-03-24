<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 14:53:34
 * @LastEditTime: 2025-03-24 16:19:51
 * @LastEditors: mulingyuer
 * @Description: 模型参数调整
 * @FilePath: \frontend\src\views\lora\wan\components\ModelParameters.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="wan2模型地址" prop="dit" popover-content="dit">
		<FileSelector v-model="ruleForm.dit" placeholder="请选择训练用的wan2模型" />
	</PopoverFormItem>
	<PopoverFormItem label="VAE模型路径" prop="vae" popover-content="vae">
		<FileSelector v-model="ruleForm.vae" placeholder="请选择VAE模型" />
	</PopoverFormItem>
	<PopoverFormItem
		label="VAE模型的预训练权重文件"
		prop="vae_checkpoint"
		popover-content="vae_checkpoint"
	>
		<FileSelector v-model="ruleForm.vae_checkpoint" placeholder="请选择VAE模型的预训练权重文件" />
	</PopoverFormItem>
	<PopoverFormItem label="VAE维度跨度" prop="vae_stride" popover-content="vae_stride">
		<el-input v-model="ruleForm.vae_stride" placeholder="请输入VAE维度跨度" />
	</PopoverFormItem>
	<PopoverFormItem label="T5模型" prop="t5_model" popover-content="t5_model">
		<FileSelector v-model="ruleForm.t5_model" placeholder="请选择T5模型" />
	</PopoverFormItem>
	<PopoverFormItem label="T5使用FP8模式" prop="fp8_t5" popover-content="fp8_t5">
		<el-switch v-model="ruleForm.fp8_t5" />
	</PopoverFormItem>
	<PopoverFormItem
		label="T5模型的预训练权重文件的路径"
		prop="t5_checkpoint"
		popover-content="t5_checkpoint"
	>
		<FileSelector v-model="ruleForm.t5_checkpoint" placeholder="请选择T5模型的预训练权重文件" />
	</PopoverFormItem>
	<BaseSelector
		v-model="ruleForm.t5_tokenizer"
		label="T5模型的分词器"
		prop="t5_tokenizer"
		popoverContent="t5_tokenizer"
		:options="t5TokenizerOptions"
	/>
	<PopoverFormItem label="CLIP模型路径" prop="clip" popover-content="clip">
		<FileSelector v-model="ruleForm.clip" placeholder="请选择CLIP模型" />
	</PopoverFormItem>
	<PopoverFormItem
		label="CLIP模型的预训练权重文件"
		prop="clip_checkpoint"
		popover-content="clip_checkpoint"
	>
		<FileSelector v-model="ruleForm.clip_checkpoint" placeholder="请选择CLIP模型的预训练权重文件" />
	</PopoverFormItem>
	<BaseSelector
		v-model="ruleForm.clip_tokenizer"
		label="CLIP模型的分词器"
		prop="clip_tokenizer"
		popoverContent="clip_tokenizer"
		:options="clipTokenizerOptions"
	/>
	<PopoverFormItem label="缓存的目录" prop="cache_directory" popover-content="cache_directory">
		<FolderSelector v-model="ruleForm.cache_directory" placeholder="请选择缓存的目录" />
	</PopoverFormItem>
	<PopoverFormItem label="使用PyTorch原生注意力" prop="sdpa" popover-content="sdpa">
		<el-switch v-model="ruleForm.sdpa" />
	</PopoverFormItem>
	<BaseSelector
		v-model="ruleForm.mixed_precision"
		label="混合精度模式"
		prop="mixed_precision"
		popoverContent="mixed_precision"
		:options="mixedPrecisionOptions"
	/>
	<PopoverFormItem
		label="启用基础FP8模式（与fp8_scaled互斥）"
		prop="fp8_base"
		popover-content="fp8_base"
	>
		<el-switch v-model="ruleForm.fp8_base" />
	</PopoverFormItem>
	<PopoverFormItem
		label="FP8缩放模式（与fp8_base互斥）"
		prop="fp8_scaled"
		popover-content="fp8_scaled"
	>
		<el-switch v-model="ruleForm.fp8_scaled" />
	</PopoverFormItem>
	<PopoverFormItem label="学习率" prop="learning_rate" popover-content="learning_rate">
		<el-input v-model="ruleForm.learning_rate" placeholder="请输入学习率" />
	</PopoverFormItem>
	<PopoverFormItem
		label="融合模型保存名称"
		prop="save_merged_model"
		popover-content="save_merged_model"
	>
		<el-input v-model="ruleForm.save_merged_model" placeholder="融合模型保存名称" />
	</PopoverFormItem>
	<el-form-item>
		<el-alert
			class="no-select"
			title="注意：设置了融合模型保存名称会占用更多存储空间，请谨慎设置！"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
	<PopoverFormItem
		label="保存间隔轮数"
		prop="save_every_n_epochs"
		popover-content="save_every_n_epochs"
	>
		<el-input-number
			v-model.number="ruleForm.save_every_n_epochs"
			:step="1"
			step-strictly
			:min="0"
		/>
	</PopoverFormItem>
	<PopoverFormItem label="隐藏层维度" prop="dim" popover-content="dim">
		<el-input-number v-model.number="ruleForm.dim" :step="1" step-strictly :min="0" />
	</PopoverFormItem>
	<PopoverFormItem label="FeedForward维度" prop="ffn_dim" popover-content="ffn_dim">
		<el-input-number v-model.number="ruleForm.ffn_dim" :step="1" step-strictly :min="0" />
	</PopoverFormItem>
	<PopoverFormItem label="注意力头数" prop="num_heads" popover-content="num_heads">
		<el-input-number v-model.number="ruleForm.num_heads" :step="1" step-strictly :min="0" />
	</PopoverFormItem>
	<PopoverFormItem label="总层数" prop="num_layers" popover-content="num_layers">
		<el-input-number v-model.number="ruleForm.num_layers" :step="1" step-strictly :min="0" />
	</PopoverFormItem>
	<PopoverFormItem label="全局注意力窗口" prop="window_size" popover-content="window_size">
		<el-input v-model="ruleForm.window_size" placeholder="请输入全局注意力窗口" />
	</PopoverFormItem>
	<PopoverFormItem label="Q/K归一化" prop="qk_norm" popover-content="qk_norm">
		<el-switch v-model="ruleForm.qk_norm" />
	</PopoverFormItem>
	<PopoverFormItem
		label="交叉注意力归一化"
		prop="cross_attn_norm"
		popover-content="qk_norcross_attn_normm"
	>
		<el-switch v-model="ruleForm.cross_attn_norm" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { RuleForm } from "../types";
import type { BaseSelectorProps } from "@/components/Form/BaseSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** T5模型的分词器选项 */
const t5TokenizerOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "google/umt5-xxl",
		value: "google/umt5-xxl"
	}
]);

/** CLIP模型的分词器选项 */
const clipTokenizerOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "xlm-roberta-large",
		value: "xlm-roberta-large"
	}
]);

/** 混合精度选项 */
const mixedPrecisionOptions = ref<BaseSelectorProps["options"]>([
	{
		label: "fp16",
		value: "fp16"
	},
	{
		label: "bf16",
		value: "bf16"
	},
	{
		label: "none",
		value: "none"
	}
]);
</script>

<style scoped></style>
