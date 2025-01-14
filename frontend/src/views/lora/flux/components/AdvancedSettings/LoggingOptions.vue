<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 11:30:00
 * @LastEditTime: 2025-01-10 11:00:08
 * @LastEditors: mulingyuer
 * @Description: 日志设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\LoggingOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="日志设置">
		<PopoverFormItem label="日志保存文件夹" prop="logging_dir" popover-content="logging_dir">
			<el-input v-model="ruleForm.logging_dir" placeholder="请输入日志保存文件夹" disabled />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
