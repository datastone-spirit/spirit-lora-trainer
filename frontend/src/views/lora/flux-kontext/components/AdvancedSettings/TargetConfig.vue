<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 09:10:50
 * @LastEditTime: 2025-07-23 09:14:49
 * @LastEditors: mulingyuer
 * @Description: 目标设置
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\AdvancedSettings\TargetConfig.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="目标设置">
		<PopoverFormItem label="Linear Rank" prop="config.network.linear" popover-content="linear">
			<el-input-number v-model.number="value" :step="1" step-strictly :min="0" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

const value = computed({
	get() {
		return ruleForm.value.config.network.linear;
	},
	set(val: number) {
		ruleForm.value.config.network.linear = val;
		ruleForm.value.config.network.linear_alpha = val;
	}
});
</script>

<style scoped></style>
