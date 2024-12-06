<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 16:25:06
 * @LastEditTime: 2024-12-06 16:25:06
 * @LastEditors: mulingyuer
 * @Description: 网络配置
 * @FilePath: \frontend\src\views\lora\sdxl\components\NetworkConfig.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="网络设置"> </FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../types";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
const ruleForm = defineModel({ type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
