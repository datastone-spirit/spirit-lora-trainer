<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:49:22
 * @LastEditTime: 2024-12-16 17:54:11
 * @LastEditors: mulingyuer
 * @Description: 打标监控
 * @FilePath: \frontend\src\components\TagMonitor\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="tag-monitor">
		<el-text class="tag-monitor-label"> 打标进度 </el-text>
		<el-progress
			class="tag-monitor-progress"
			:percentage="percentage"
			:show-text="false"
			:stroke-width="8"
		></el-progress>
		<el-text class="tag-monitor-round"> {{ data.currentRound }}/{{ data.totalRound }} </el-text>
	</div>
</template>

<script setup lang="ts">
export interface TagMonitorProps {
	data: {
		/** 当前第几个 */
		currentRound: number;
		/** 总共多少个 */
		totalRound: number;
	};
}

const props = withDefaults(defineProps<TagMonitorProps>(), {
	data: () => ({
		currentRound: 0,
		totalRound: 0
	})
});

/** 计算百分比 */
const percentage = computed(() => {
	if (props.data.totalRound === 0) return 0;
	const value = Math.floor((props.data.currentRound / props.data.totalRound) * 100);
	return value > 100 ? 100 : value;
});
</script>

<style lang="scss" scoped>
.tag-monitor {
	display: flex;
	align-items: center;
}
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
