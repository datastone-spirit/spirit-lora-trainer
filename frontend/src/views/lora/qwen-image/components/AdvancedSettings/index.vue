<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 11:23:10
 * @LastEditTime: 2025-08-13 14:31:28
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\qwen-image\components\AdvancedSettings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<LoRANetwork v-model:form="ruleForm" />
	<DiffusionModel v-model:form="ruleForm" />
	<Optimization v-model:form="ruleForm" />
	<System v-model:form="ruleForm" />
	<DistributedTraining v-model:form="ruleForm" />
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import LoRANetwork from "./LoRANetwork.vue";
import DiffusionModel from "./DiffusionModel.vue";
import Optimization from "./Optimization.vue";
import System from "./System.vue";
import DistributedTraining from "./DistributedTraining.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
