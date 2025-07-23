<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 08:55:32
 * @LastEditTime: 2025-07-23 09:15:17
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\AdvancedSettings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<ModelConfig v-model:form="ruleForm" />
	<TargetConfig v-model:form="ruleForm" />
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import ModelConfig from "./ModelConfig.vue";
import TargetConfig from "./TargetConfig.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
