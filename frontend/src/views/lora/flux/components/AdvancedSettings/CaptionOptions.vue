<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 11:41:51
 * @LastEditTime: 2025-01-10 11:00:22
 * @LastEditors: mulingyuer
 * @Description: caption（Tag）选项
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\CaptionOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="caption（Tag）选项">
		<PopoverFormItem
			label="Tag 文件扩展名"
			prop="caption_extension"
			popover-content="caption_extension"
		>
			<el-input v-model="ruleForm.caption_extension" placeholder="请输入Tag 文件扩展名" />
		</PopoverFormItem>
		<PopoverFormItem
			label="训练时随机打乱 tokens"
			prop="shuffle_caption"
			popover-content="shuffle_caption"
		>
			<el-switch v-model="ruleForm.shuffle_caption" />
		</PopoverFormItem>
		<PopoverFormItem
			label="使用带权重的 token，不推荐与 shuffle_caption 一同开启"
			prop="weighted_captions"
			popover-content="weighted_captions"
		>
			<el-switch v-model="ruleForm.weighted_captions" />
		</PopoverFormItem>
		<PopoverFormItem
			label="在随机打乱 tokens 时，保留前 N 个不变"
			prop="keep_tokens"
			popover-content="keep_tokens"
		>
			<el-input-number v-model.number="ruleForm.keep_tokens" :step="1" :min="0" step-strictly />
		</PopoverFormItem>
		<PopoverFormItem
			label="保留 tokens 时使用的分隔符"
			prop="keep_tokens_separator"
			popover-content="keep_tokens_separator"
		>
			<el-input
				v-model="ruleForm.keep_tokens_separator"
				placeholder="请输入保留 tokens 时使用的分隔符"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="丢弃全部标签的概率，对一个图片概率不使用 caption 或 class token"
			prop="caption_dropout_rate"
			popover-content="caption_dropout_rate"
		>
			<el-input-number v-model.number="ruleForm.caption_dropout_rate" :step="0.01" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="每 N 个 epoch 丢弃全部标签"
			prop="caption_dropout_every_n_epochs"
			popover-content="caption_dropout_every_n_epochs"
		>
			<el-input-number
				v-model.number="ruleForm.caption_dropout_every_n_epochs"
				:step="1"
				:min="0"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="按逗号分隔的标签来随机丢弃 tag 的概率"
			prop="caption_tag_dropout_rate"
			popover-content="caption_tag_dropout_rate"
		>
			<el-input-number v-model.number="ruleForm.caption_tag_dropout_rate" :step="0.01" :min="0" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
