<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 16:35:42
 * @LastEditTime: 2025-01-06 17:36:49
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\AdvancedSettings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<EvalSettings :form="ruleForm" />
	<MiscSettings :form="ruleForm" />
	<AdapterSettings :form="ruleForm" />
	<OptimizerSettings :form="ruleForm" />
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import EvalSettings from "./EvalSettings.vue";
import MiscSettings from "./MiscSettings.vue";
import AdapterSettings from "./AdapterSettings.vue";
import OptimizerSettings from "./OptimizerSettings.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
