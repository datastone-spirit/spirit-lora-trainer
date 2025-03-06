<!--
 * @Author: mulingyuer
 * @Date: 2025-03-05 14:45:29
 * @LastEditTime: 2025-03-06 16:39:36
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
		@closed="onClosed"
	>
		<div class="save-path-warning-dialog">
			<Icon class="save-path-warning-dialog-icon" name="el-icon-warning-filled" size="24" />
			<div class="save-path-warning-dialog-content">
				注意：您当前选择的LoRA保存目录不在/root存储路径下。这可能导致训练结果无法保存在存储中，可能导致训练结果丢失。您确定要继续训练吗？
			</div>
		</div>
		<template #footer>
			<el-button @click="onCancel">取消</el-button>
			<el-button type="primary" :disabled="isDisabled" @click="onConfirm">
				继续训练
				<span v-if="countDown > 0">({{ countDown }})</span>
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
type ResolveFunc = (value: boolean) => void;

const open = ref(false);
const countDownDuration = 15;
const countDown = ref(countDownDuration);
let resolveFunc: ResolveFunc | null = null;
const isDisabled = ref(true);
const { pause, resume, isActive } = useIntervalFn(() => {
	if (countDown.value > 0) {
		countDown.value--;
	} else {
		pause();
		isDisabled.value = false;
	}
}, 1000);
// 初始调用暂停状态
pause();

function onCancel() {
	open.value = false;
	if (resolveFunc) {
		resolveFunc(false);
	}
}

function onConfirm() {
	open.value = false;
	if (resolveFunc) {
		resolveFunc(true);
	}
}

function onClosed() {
	resetCountDown();
}

/** 重置倒计时 */
function resetCountDown() {
	pause();
	countDown.value = countDownDuration;
	isDisabled.value = true;
}

/**  显示弹窗 */
function onShow(resolve: ResolveFunc) {
	if (open.value) return;
	resolveFunc = resolve;
	countDown.value = 15;
	open.value = true;
	if (!isActive.value) {
		resume();
		isDisabled.value = true;
	}
}

defineExpose({
	show: onShow
});
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
