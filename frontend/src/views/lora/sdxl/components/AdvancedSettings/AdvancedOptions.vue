<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:07:57
 * @LastEditTime: 2024-12-09 15:09:42
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\sdxl\components\AdvancedSettings\AdvancedOptions.vue
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
		<PopoverFormItem
			label="危险：自定义参数，请输入 TOML 格式，将会直接覆盖当前界面内任何参数。实时更新，推荐写完后再粘贴过来"
			:prop="formProps.ui_custom_params"
			popover-content="ui_custom_params"
		>
			<el-input v-model="ruleForm.ui_custom_params" type="textarea" :autosize="{ minRows: 3 }" />
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
