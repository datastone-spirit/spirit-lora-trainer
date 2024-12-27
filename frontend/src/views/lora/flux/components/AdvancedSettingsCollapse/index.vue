<!--
 * @Author: mulingyuer
 * @Date: 2024-12-27 10:07:30
 * @LastEditTime: 2024-12-27 10:28:58
 * @LastEditors: mulingyuer
 * @Description: 高级设置折叠容器
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettingsCollapse\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<SimpleCollapse v-model="open" :title="title">
		<AdvancedSettings v-model:form="ruleForm" :form-props="formProps" />
	</SimpleCollapse>
</template>

<script setup lang="ts">
import type { RuleForm, RuleFormProps } from "../../types";
const AdvancedSettings = defineAsyncComponent(() => import("../AdvancedSettings/index.vue"));

export interface AdvancedSettingsCollapseProps {
	/** 表单props */
	formProps: RuleFormProps;
	/** 标题 */
	title: string;
}

defineProps<AdvancedSettingsCollapseProps>();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const open = defineModel({ type: Boolean, required: true });
</script>

<style lang="scss" scoped></style>
