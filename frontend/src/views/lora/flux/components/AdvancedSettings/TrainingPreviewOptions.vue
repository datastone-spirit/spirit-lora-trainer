<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 11:25:15
 * @LastEditTime: 2025-09-03 15:05:18
 * @LastEditors: mulingyuer
 * @Description: 训练预览图设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\TrainingPreviewOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="训练预览图设置">
		<PopoverFormItem
			label="启用训练预览图"
			prop="config.enable_preview"
			popover-content="enable_preview"
		>
			<el-switch v-model="ruleForm.config.enable_preview" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
