<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:50:40
 * @LastEditTime: 2024-12-05 15:20:32
 * @LastEditors: mulingyuer
 * @Description: sdxl 模型训练页面
 * @FilePath: \frontend\src\views\lora\sdxl\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<TwoSplit class="lora-sdxl-page" :direction="direction" :sizes="sizes">
		<template #left>
			<div style="height: 2000px">SDXL</div>
		</template>
		<template #right>
			<div style="height: 100%">right</div>
		</template>
	</TwoSplit>
</template>

<script setup lang="ts">
import type { TwoSplitProps } from "@/components/Split/TwoSplit.vue";

const direction = ref<TwoSplitProps["direction"]>("horizontal");
const sizes = ref<TwoSplitProps["sizes"]>([70, 30]);
</script>

<style lang="scss" scoped>
.lora-sdxl-page {
	height: calc(100vh - $header-height - $padding * 2);
}
</style>
