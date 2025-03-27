<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 14:52:03
 * @LastEditTime: 2025-03-27 16:03:17
 * @LastEditors: mulingyuer
 * @Description: 系统监控：gpu、训练轮数
 * @FilePath: \frontend\src\components\Monitor\GPUMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div v-if="isUseGpu" class="gpu-monitor">
		<div class="gpu-monitor-more">
			<el-popover placement="top" width="auto" trigger="click">
				<template #reference>
					<Icon name="ri-information-2-line" size="16" />
				</template>
				<table class="gpu-monitor-table">
					<colgroup>
						<col width="80" />
						<col width="80" />
						<col width="80" />
						<col width="80" />
						<col width="80" />
					</colgroup>
					<thead>
						<tr>
							<th><span class="gpu-monitor-table-title">显卡编号</span></th>
							<th><span class="gpu-monitor-table-title">当前功率</span></th>
							<th><span class="gpu-monitor-table-title">总功率</span></th>
							<th><span class="gpu-monitor-table-title">已用显存</span></th>
							<th><span class="gpu-monitor-table-title">总显存</span></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in gpuData.gpuList" :key="index">
							<td>{{ item.gpu_index }}</td>
							<td>{{ item.power_draw_watts }}</td>
							<td>{{ item.power_total_watts }}</td>
							<td>{{ item.memory_used_mb }}</td>
							<td>{{ item.memory_total_mb }}</td>
						</tr>
					</tbody>
				</table>
			</el-popover>
		</div>
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

const { monitorGPUData, isUseGpu } = useGPU();
const gpuData = computed(() => monitorGPUData.value.data);
</script>

<style lang="scss" scoped>
.gpu-monitor {
	height: 100%;
	display: flex;
	align-items: center;
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
.gpu-monitor-more {
	margin-left: 2px;
	color: var(--el-text-color-regular);
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}
.gpu-monitor-table {
	border-collapse: collapse;
	thead th,
	tbody td {
		height: 30px;
	}
	.gpu-monitor-table-title {
		padding-bottom: 4px;
		border-bottom: 1px solid var(--el-border-color);
	}
	td {
		text-align: center;
	}
}
</style>
