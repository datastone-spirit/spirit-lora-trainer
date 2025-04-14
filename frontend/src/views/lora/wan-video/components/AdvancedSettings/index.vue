<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 15:37:04
 * @LastEditTime: 2025-03-26 17:05:01
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<OptimizerAndLROptions v-model:form="ruleForm" />
	<ModelOptions v-model:form="ruleForm" />
	<TrainingControlOptions v-model:form="ruleForm" />
	<TrainingDistributedOptions v-model:form="ruleForm" />
	<AdvancedMemoryOptimizer v-model:form="ruleForm" />
	<DiffusionModelOptions v-model:form="ruleForm" />
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import OptimizerAndLROptions from "./OptimizerAndLROptions.vue";
import ModelOptions from "./ModelOptions.vue";
import TrainingControlOptions from "./TrainingControlOptions.vue";
import TrainingDistributedOptions from "./TrainingDistributedOptions.vue";
import AdvancedMemoryOptimizer from "./AdvancedMemoryOptimizer.vue";
import DiffusionModelOptions from "./DiffusionModelOptions.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
