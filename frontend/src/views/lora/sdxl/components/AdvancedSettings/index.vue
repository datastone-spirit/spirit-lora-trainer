<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:21:08
 * @LastEditTime: 2025-01-10 11:27:28
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\sdxl\components\AdvancedSettings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<TrainingOptions v-model:form="ruleForm" />
	<LRAndOptimizer v-model:form="ruleForm" />
	<NetworkOptions v-model:form="ruleForm" />
	<TrainingPreviewOptions v-model:form="ruleForm" />
	<LoggingOptions v-model:form="ruleForm" />
	<CaptionOptions v-model:form="ruleForm" />
	<NoiseOptions v-model:form="ruleForm" />
	<DataEnhancerOptions v-model:form="ruleForm" />
	<AdvancedOptions v-model:form="ruleForm" />
	<SpeedOptimizationOptions v-model:form="ruleForm" />
	<DistributedTrainingOptions v-model:form="ruleForm" />
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import TrainingOptions from "./TrainingOptions.vue";
import LRAndOptimizer from "./LRAndOptimizer.vue";
import NetworkOptions from "./NetworkOptions.vue";
import TrainingPreviewOptions from "./TrainingPreviewOptions.vue";
import LoggingOptions from "./LoggingOptions.vue";
import CaptionOptions from "./CaptionOptions.vue";
import NoiseOptions from "./NoiseOptions.vue";
import DataEnhancerOptions from "./DataEnhancerOptions.vue";
import AdvancedOptions from "./AdvancedOptions.vue";
import SpeedOptimizationOptions from "./SpeedOptimizationOptions.vue";
import DistributedTrainingOptions from "./DistributedTrainingOptions.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
