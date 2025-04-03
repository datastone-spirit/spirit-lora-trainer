<!--
 * @Author: mulingyuer
 * @Date: 2025-04-02 15:43:56
 * @LastEditTime: 2025-04-02 16:24:26
 * @LastEditors: mulingyuer
 * @Description: lora任务日志弹窗
 * @FilePath: \frontend\src\components\Dialog\LoraTaskLogDialog.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-dialog
		v-model="open"
		title="训练日志"
		width="820px"
		append-to-body
		destroy-on-close
		align-center
	>
		<div class="lora-task-log-dialog">
			<TaskLog :task-id="taskId" />
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { useModalManagerStore } from "@/stores";

const modalManager = useModalManagerStore();
const open = computed({
	get() {
		return modalManager.loraTaskLogModal.open;
	},
	set(val: boolean) {
		modalManager.setLoraTaskLogModal({
			open: val,
			taskId: ""
		});
	}
});
const taskId = computed(() => modalManager.loraTaskLogModal.taskId);
</script>

<style scoped></style>
