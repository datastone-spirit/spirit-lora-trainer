<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 11:24:43
 * @LastEditTime: 2025-08-13 11:31:09
 * @LastEditors: mulingyuer
 * @Description: LoRA网络结构参数
 * @FilePath: \frontend\src\views\lora\qwen-image\components\AdvancedSettings\LoRANetwork.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="LoRA网络结构参数">
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
			label="LoRA权重缩放因子"
			prop="config.network_alpha"
			popover-content="network_alpha"
		>
			<el-input-number v-model.number="ruleForm.config.network_alpha" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="训练时随机失活比例"
			prop="config.network_dropout"
			popover-content="network_dropout"
		>
			<el-input-number v-model.number="ruleForm.config.network_dropout" :step="0.1" :min="0" />
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
			label="合并入底模的 LoRA 路径"
			prop="config.base_weights"
			popover-content="base_weights"
		>
			<FileSelector v-model="ruleForm.config.base_weights" placeholder="请选择合并入底模的 LoRA" />
		</PopoverFormItem>
		<PopoverFormItem
			label="合并入底模的 LoRA 权重"
			prop="config.base_weights_multiplier"
			popover-content="base_weights_multiplier"
		>
			<el-input-number
				v-model.number="ruleForm.config.base_weights_multiplier"
				:step="0.1"
				:min="0"
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
