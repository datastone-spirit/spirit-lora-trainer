<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 17:49:22
 * @LastEditTime: 2024-12-20 17:10:14
 * @LastEditors: mulingyuer
 * @Description: 打标监控
 * @FilePath: \frontend\src\components\Monitor\TagMonitor\index.vue
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
		<el-text class="tag-monitor-round"> {{ data.current }}/{{ data.total }} </el-text>
	</div>
</template>

<script setup lang="ts">
import { manualTagInfo } from "@/api/monitor";
import { sleep } from "@/utils/tools";

export interface TagMonitorData {
	/** 当前第几个 */
	current: number;
	/** 总共多少个 */
	total: number;
}

const data = ref<TagMonitorData>({
	current: 0,
	total: 0
});
/** 计算百分比 */
const percentage = computed(() => {
	if (data.value.total === 0) return 0;
	const value = Math.floor((data.value.current / data.value.total) * 100);
	return value > 100 ? 100 : value;
});
const status = ref(false);
const sleepTime = 3000;
function update() {
	if (!status.value) return;
	manualTagInfo()
		.then((res) => {
			if (!res.detail) return;
			data.value.current = res.current;
			data.value.total = res.detail.total;
		})
		.finally(() => {
			status.value && sleep(sleepTime).then(update);
		});
}

/** 开始查询 */
function start() {
	status.value = true;
	update();
}

/** 停止查询 */
function stop() {
	status.value = false;
}

defineExpose({
	start,
	stop
});
</script>

<style lang="scss" scoped>
.tag-monitor {
	display: flex;
	align-items: center;
	min-width: 250px;
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
