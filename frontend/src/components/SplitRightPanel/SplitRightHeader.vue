<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:58:26
 * @LastEditTime: 2024-12-12 17:01:19
 * @LastEditors: mulingyuer
 * @Description: 顶栏
 * @FilePath: \frontend\src\components\SplitRightPanel\SplitRightHeader.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="split-right-content-header">
		<div class="split-right-content-header-box">
			<PreviewSwitch />
			<el-button v-show="settingsStore.showAIDataset" type="primary">上传文件</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import PreviewSwitch from "./PreviewSwitch.vue";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
</script>

<style lang="scss" scoped>
.split-right-content-header {
	padding: $zl-padding;
	background-color: var(--zl-split-right-panel-bg);
	border-radius: $zl-border-radius;
	height: 60px;
	margin-bottom: $zl-padding;
}
.split-right-content-header-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 36px;
}
</style>
