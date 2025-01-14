<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 14:52:03
 * @LastEditTime: 2025-01-08 17:30:42
 * @LastEditors: mulingyuer
 * @Description: 系统监控：gpu、训练轮数
 * @FilePath: \frontend\src\components\Monitor\GPUMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="gpu-monitor">
		<div class="gpu-monitor-item">
			<div class="gpu-monitor-item-label">GPU功率</div>
			<div class="gpu-monitor-item-value">{{ gpuData.gpuPower }}%</div>
		</div>
		<div class="gpu-monitor-item">
			<div class="gpu-monitor-item-label">GPU显存</div>
			<div class="gpu-monitor-item-value">{{ gpuData.gpuMemory }}%</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useGPU } from "@/hooks/useGPU";

const { monitorGPUData } = useGPU();
const gpuData = computed(() => monitorGPUData.value.data);
</script>

<style lang="scss" scoped>
.gpu-monitor {
	display: flex;
}
.gpu-monitor-item {
	width: 70px;
	text-align: center;
	color: var(--el-text-color-primary);
}
.gpu-monitor-item-label {
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
	padding-bottom: 2px;
	border-bottom: 1px solid var(--el-color-primary);
}
.gpu-monitor-item-value {
	padding-top: 2px;
	font-size: 16px;
}
</style>
