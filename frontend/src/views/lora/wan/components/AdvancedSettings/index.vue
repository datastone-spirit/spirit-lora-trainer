<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 15:37:04
 * @LastEditTime: 2025-03-24 15:56:39
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\wan\components\AdvancedSettings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<SamplingOptions v-model:form="ruleForm" />
	<OptimizerOptions v-model:form="ruleForm" />
	<MiscOptions v-model:form="ruleForm" />
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import SamplingOptions from "./SamplingOptions.vue";
import OptimizerOptions from "./OptimizerOptions.vue";
import MiscOptions from "./MiscOptions.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
