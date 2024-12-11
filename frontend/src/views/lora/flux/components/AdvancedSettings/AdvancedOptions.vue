<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:07:57
 * @LastEditTime: 2024-12-11 15:18:56
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\AdvancedOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="高级设置">
		<PopoverFormItem
			label="CLIP 跳过层数 玄学"
			:prop="formProps.clip_skip"
			popover-content="clip_skip"
		>
			<el-slider v-model="ruleForm.clip_skip" :min="0" :max="12" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm, RuleFormProps } from "../../types";

export interface AdvancedOptionsProps {
	/** 表单props */
	formProps: RuleFormProps;
}

defineProps<AdvancedOptionsProps>();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
