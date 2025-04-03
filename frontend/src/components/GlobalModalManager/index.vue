<!--
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:39:40
 * @LastEditTime: 2025-04-03 09:33:05
 * @LastEditors: mulingyuer
 * @Description: 全局弹窗管理器，所有全局弹窗都在这里管理，状态数据存放在 modal-manager store中
 * @FilePath: \frontend\src\components\GlobalModalManager\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<ViewSamplingDrawer />
	<VideoPreview />
	<LoraTaskLogDialog />
	<LoRASavePathWarningDialog />
	<NetworkRetryDialog />
</template>

<script setup lang="ts">
import NetworkRetryDialog from "@/components/Dialog/NetworkRetryDialog.vue";
import LoraTaskLogDialog from "@/components/Dialog/LoraTaskLogDialog.vue";
import LoRASavePathWarningDialog from "@/components/Dialog/LoRASavePathWarningDialog.vue";
import VideoPreview from "@/components/VideoPreview/index.vue";
import ViewSamplingDrawer from "@/components/Drawer/ViewSamplingDrawer.vue";
</script>

<style scoped></style>
