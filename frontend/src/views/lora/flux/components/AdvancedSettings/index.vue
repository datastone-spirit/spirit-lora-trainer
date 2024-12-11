<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 09:35:29
 * @LastEditTime: 2024-12-10 16:19:41
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FluxOptions v-model:form="ruleForm" :form-props="formProps" />
	<TrainingOptions v-model:form="ruleForm" :form-props="formProps" />
	<LRAndOptimizer v-model:form="ruleForm" :form-props="formProps" />
	<NetworkOptions v-model:form="ruleForm" :form-props="formProps" />
	<TrainingPreviewOptions v-model:form="ruleForm" :form-props="formProps" />
	<LoggingOptions v-model:form="ruleForm" :form-props="formProps" />
	<CaptionOptions v-model:form="ruleForm" :form-props="formProps" />
	<DataEnhancerOptions v-model:form="ruleForm" :form-props="formProps" />
	<AdvancedOptions v-model:form="ruleForm" :form-props="formProps" />
	<SpeedOptimizationOptions v-model:form="ruleForm" :form-props="formProps" />
	<DistributedTrainingOptions v-model:form="ruleForm" :form-props="formProps" />
</template>

<script setup lang="ts">
import type { RuleForm, RuleFormProps } from "../../types";
import FluxOptions from "./FluxOptions.vue";
import TrainingOptions from "./TrainingOptions.vue";
import LRAndOptimizer from "./LRAndOptimizer.vue";
import NetworkOptions from "./NetworkOptions.vue";
import TrainingPreviewOptions from "./TrainingPreviewOptions.vue";
import LoggingOptions from "./LoggingOptions.vue";
import CaptionOptions from "./CaptionOptions.vue";
import DataEnhancerOptions from "./DataEnhancerOptions.vue";
import AdvancedOptions from "./AdvancedOptions.vue";
import SpeedOptimizationOptions from "./SpeedOptimizationOptions.vue";
import DistributedTrainingOptions from "./DistributedTrainingOptions.vue";

export interface AdvancedSettingsProps {
	/** 表单props */
	formProps: RuleFormProps;
}

defineProps<AdvancedSettingsProps>();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
