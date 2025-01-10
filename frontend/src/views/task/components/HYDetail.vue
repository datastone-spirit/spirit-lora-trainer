<!--
 * @Author: mulingyuer
 * @Date: 2025-01-10 11:47:24
 * @LastEditTime: 2025-01-10 15:53:34
 * @LastEditors: mulingyuer
 * @Description: 混元视频任务详情
 * @FilePath: \frontend\src\views\task\components\HYDetail.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div>混元视频详情 {{ data }}</div>
</template>

<script setup lang="ts">
import type { HyVideoTrainingInfoResult } from "@/api/monitor";

export interface HYDetailProps {
	data: HyVideoTrainingInfoResult;
}

defineProps<HYDetailProps>();
</script>

<style scoped></style>
