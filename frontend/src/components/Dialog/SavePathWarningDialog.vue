<!--
 * @Author: mulingyuer
 * @Date: 2025-03-05 14:45:29
 * @LastEditTime: 2025-03-07 10:25:55
 * @LastEditors: mulingyuer
 * @Description: Lora保存路径警告弹窗
 * @FilePath: \frontend\src\components\Dialog\SavePathWarningDialog.vue
 * 怎么可能会有bug！！！
-->

<template>
	<el-dialog
		v-model="open"
		title="警告"
		width="420"
		align-center
		:close-on-press-escape="false"
		:close-on-click-modal="false"
		:show-close="false"
	>
		<div class="save-path-warning-dialog">
			<Icon class="save-path-warning-dialog-icon" name="el-icon-warning-filled" size="24" />
			<div class="save-path-warning-dialog-content">
				注意：您当前选择的LoRA保存目录不在/root存储路径下。这可能导致训练结果无法保存在存储中，从而导致训练结果丢失。请修改LoRA保存目录为/root路径下的目录。
			</div>
		</div>
		<template #footer>
			<el-button type="primary" @click="onConfirm"> 我知道了 </el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
const open = defineModel({ type: Boolean, required: true });

function onConfirm() {
	open.value = false;
}
</script>

<style lang="scss" scoped>
.save-path-warning-dialog {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	line-height: 1.6;
}
.save-path-warning-dialog-icon {
	color: var(--el-color-warning);
}
.save-path-warning-dialog-content {
	font-size: 20px;
	font-weight: bold;
	color: var(--el-text-color-primary);
}
</style>
