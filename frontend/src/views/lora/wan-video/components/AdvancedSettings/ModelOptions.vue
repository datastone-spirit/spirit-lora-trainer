<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 15:31:41
 * @LastEditTime: 2025-03-26 15:44:51
 * @LastEditors: mulingyuer
 * @Description: 模型结构参数设置
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\ModelOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="模型结构参数">
		<PopoverFormItem
			label="LoRA权重缩放因子"
			prop="config.network_alpha"
			popover-content="network_alpha"
		>
			<el-input-number v-model.number="ruleForm.config.network_alpha" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="自定义网络参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：conv_dim=4 conv_alpha=1"
			prop="config.network_args"
			popover-content="network_args"
		>
			<el-input
				v-model="ruleForm.config.network_args"
				:autosize="{ minRows: 4 }"
				type="textarea"
				placeholder="自定义网络参数"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="LoRA的秩（rank）"
			prop="config.network_dim"
			popover-content="network_dim"
		>
			<el-input-number
				v-model.number="ruleForm.config.network_dim"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="训练时随机失活比例"
			prop="config.network_dropout"
			popover-content="network_dropout"
		>
			<el-input-number v-model.number="ruleForm.config.network_dropout" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="指定要加载的神经网络模块"
			prop="config.network_module"
			popover-content="network_module"
		>
			<FileSelector
				v-model="ruleForm.config.network_module"
				placeholder="请选择要加载的神经网络模块"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="预训练权重文件"
			prop="config.network_weights"
			popover-content="network_weights"
		>
			<FileSelector v-model="ruleForm.config.network_weights" placeholder="请选择预训练权重文件" />
		</PopoverFormItem>
		<PopoverFormItem
			label="用于自动从预训练权重中推断网络维度（rank）,必须与 --network_weights 配合使用"
			prop="config.dim_from_weights"
			popover-content="dim_from_weights"
		>
			<el-switch v-model="ruleForm.config.dim_from_weights" />
		</PopoverFormItem>
		<PopoverFormItem
			label="指定要交换的网络块数量"
			prop="config.blocks_to_swap"
			popover-content="blocks_to_swap"
		>
			<el-input-number
				v-model.number="ruleForm.config.blocks_to_swap"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<el-form-item>
			<el-alert
				class="no-select"
				title="注意：指定要交换的网络块数量数值越大，训练时长增加的越长"
				type="warning"
				:closable="false"
				show-icon
				effect="dark"
			/>
		</el-form-item>
		<PopoverFormItem label="启用基础FP8模式" prop="config.fp8_base" popover-content="fp8_base">
			<el-switch v-model="ruleForm.config.fp8_base" />
		</PopoverFormItem>
		<PopoverFormItem label="启用FP8缩放模式" prop="config.fp8_scaled" popover-content="fp8_scaled">
			<el-switch v-model="ruleForm.config.fp8_scaled" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
