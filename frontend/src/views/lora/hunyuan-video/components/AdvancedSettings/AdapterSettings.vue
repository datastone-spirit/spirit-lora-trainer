<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 17:00:20
 * @LastEditTime: 2025-01-06 17:06:20
 * @LastEditors: mulingyuer
 * @Description: 适配器设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\AdapterSettings.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="适配器设置">
		<AdapterTypeSelector
			v-model="ruleForm.adapter.type"
			label="适配器类型"
			prop="adapter.type"
			placeholder="请选择适配器类型"
			popover-content="type"
		/>
		<PopoverFormItem label="rank" prop="adapter.rank" popover-content="rank">
			<el-input-number v-model.number="ruleForm.adapter.rank" :step="1" step-strictly />
		</PopoverFormItem>
		<ModelDtypeSelector
			v-model="ruleForm.adapter.dtype"
			label="训练的 LoRA 权重的 dtype"
			prop="adapter.dtype"
			placeholder="请选择训练的 LoRA 权重的 dtype"
			popover-content="adapter.dtype"
		/>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import AdapterTypeSelector from "../Form/AdapterTypeSelector.vue";
import ModelDtypeSelector from "../Form/ModelDtypeSelector.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
