<!--
 * @Author: mulingyuer
 * @Date: 2025-03-10 15:36:10
 * @LastEditTime: 2025-03-27 10:39:36
 * @LastEditors: mulingyuer
 * @Description: 网络重试弹窗
 * @FilePath: \frontend\src\components\Dialog\NetworkRetryDialog.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-dialog
		v-model="open"
		class="network-retry-dialog"
		width="420"
		title="网络连接中断"
		align-center
	>
		<div class="network-retry-dialog-content">
			<p>您可以尝试以下操作：</p>
			<ol>
				<li>检查您的网络连接是否正常，并确保能够访问互联网；</li>
				<li>
					若网络正常，请耐心等待页面自动重新连接，或者前往 GPU
					详情页重新打开训练器页面以查看训练进度；
				</li>
			</ol>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { useModalManagerStore } from "@/stores";

const modalManagerStore = useModalManagerStore();

const open = computed({
	get() {
		return modalManagerStore.networkDisconnectModal;
	},
	set(val: boolean) {
		modalManagerStore.setNetworkDisconnectModal(val);
	}
});
</script>

<style lang="scss" scoped>
.network-retry-dialog-content {
	font-size: 16px;
}
.network-retry-dialog-content ol {
	padding-inline-start: 40px;
	margin-block-start: 14px;
	margin-block-end: 14px;
}
</style>
