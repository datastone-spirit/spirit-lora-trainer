<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 09:05:48
 * @LastEditTime: 2025-07-23 17:49:30
 * @LastEditors: mulingyuer
 * @Description: 模型设置
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\AdvancedSettings\ModelConfig.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="模型设置">
		<PopoverFormItem
			label="是否开启Transformer量化转换器"
			prop="model.quantize"
			popover-content="quantize"
		>
			<el-switch v-model="ruleForm.model.quantize" />
		</PopoverFormItem>
		<el-form-item>
			<el-alert
				class="no-select"
				title="注意：显存24G需开启Transformer量化转换器。"
				type="warning"
				:closable="false"
				show-icon
				effect="dark"
			/>
		</el-form-item>
		<PopoverFormItem
			label="是否开启Text Encoder量化转换器"
			prop="model.quantize_te"
			popover-content="quantize_te"
		>
			<el-switch v-model="ruleForm.model.quantize_te" />
		</PopoverFormItem>
		<el-form-item>
			<el-alert
				class="no-select"
				title="注意：显存24G需开启Text Encoder量化转换器。"
				type="warning"
				:closable="false"
				show-icon
				effect="dark"
			/>
		</el-form-item>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
