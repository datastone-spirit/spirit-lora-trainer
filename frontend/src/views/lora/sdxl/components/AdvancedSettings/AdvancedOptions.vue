<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:07:57
 * @LastEditTime: 2025-01-10 11:25:31
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\sdxl\components\AdvancedSettings\AdvancedOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="高级设置">
		<PopoverFormItem label="CLIP 跳过层数 玄学" prop="clip_skip" popover-content="clip_skip">
			<el-slider v-model="ruleForm.clip_skip" :min="0" :max="12" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
