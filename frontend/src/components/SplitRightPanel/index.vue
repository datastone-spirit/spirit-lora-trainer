<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:50:29
 * @LastEditTime: 2024-12-12 17:00:40
 * @LastEditors: mulingyuer
 * @Description: 右侧内容
 * @FilePath: \frontend\src\components\SplitRightPanel\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="split-right-panel">
		<SplitRightHeader />
		<SplitRightContent :toml="toml" />
	</div>
</template>

<script setup lang="ts">
import SplitRightHeader from "./SplitRightHeader.vue";
import SplitRightContent from "./SplitRightContent.vue";

export interface SplitRightContentProps {
	toml: string;
}

defineProps<SplitRightContentProps>();
</script>

<style lang="scss" scoped>
.split-right-panel {
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>
