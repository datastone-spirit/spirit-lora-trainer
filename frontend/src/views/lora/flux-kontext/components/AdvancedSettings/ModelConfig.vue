<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 09:05:48
 * @LastEditTime: 2025-07-23 09:10:14
 * @LastEditors: mulingyuer
 * @Description: 模型设置
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\AdvancedSettings\ModelConfig.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="模型设置">
		<PopoverFormItem
			label="是否开启Transformer量化转换器"
			prop="config.model.quantize"
			popover-content="quantize"
		>
			<el-switch v-model="ruleForm.config.model.quantize" />
		</PopoverFormItem>
		<PopoverFormItem
			label="是否开启Text Encoder量化转换器"
			prop="config.model.quantize_te"
			popover-content="quantize_te"
		>
			<el-switch v-model="ruleForm.config.model.quantize_te" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
