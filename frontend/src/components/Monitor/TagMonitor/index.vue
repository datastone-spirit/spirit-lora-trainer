<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:49:22
 * @LastEditTime: 2025-01-06 09:59:47
 * @LastEditors: mulingyuer
 * @Description: 打标监控
 * @FilePath: \frontend\src\components\Monitor\TagMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="tag-monitor">
		<div v-if="isLoad" class="tag-monitor-head">
			<el-text class="tag-monitor-tips"> 打标模型加载中，请耐心等待 </el-text>
			<el-text class="text-dot"></el-text>
		</div>
		<div v-else class="tag-monitor-body">
			<el-text class="tag-monitor-label"> 打标进度 </el-text>
			<el-progress
				class="tag-monitor-progress"
				:percentage="tagData.percentage"
				:show-text="false"
				:stroke-width="8"
			></el-progress>
			<el-text class="tag-monitor-round"> {{ tagData.current }}/{{ tagData.total }} </el-text>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTag } from "@/hooks/useTag";

export interface TagMonitorData {
	/** 当前第几个 */
	current: number;
	/** 总共多少个 */
	total: number;
}

const { tagData } = useTag();

/** 是否在加载中 */
const isLoad = computed(() => {
	return tagData.value.current <= 0;
});
</script>

<style lang="scss" scoped>
.tag-monitor {
	min-width: 250px;
}
.tag-monitor-head {
	text-align: center;
	margin-bottom: 6px;
}
.tag-monitor-body {
	display: flex;
	align-items: center;
}
.tag-monitor-tips,
.tag-monitor-label,
.tag-monitor-round {
	flex-shrink: 0;
	font-size: 12px;
	color: var(--el-text-color-primary);
}
.tag-monitor-label {
	margin-right: 8px;
}
.tag-monitor-round {
	margin-left: 8px;
}
.tag-monitor-progress {
	flex-grow: 1;
}
</style>
