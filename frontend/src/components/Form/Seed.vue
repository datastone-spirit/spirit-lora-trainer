<!--
 * @Author: mulingyuer
 * @Date: 2025-08-21 15:35:10
 * @LastEditTime: 2025-08-21 16:13:51
 * @LastEditors: mulingyuer
 * @Description: 种子数组件
 * @FilePath: \frontend\src\components\Form\Seed.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-input-number
		v-model="seed"
		:step="1"
		step-strictly
		controls-position="right"
		:min="0"
		:max="4294967295"
	/>
	<el-tooltip content="随机生成种子" placement="top">
		<el-button class="seed-btn" :icon="RiDiceLine" @click="onRandomSeed"></el-button>
	</el-tooltip>
</template>

<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon";
import { generateSeed } from "@/utils/tools";

// icon
const RiDiceLine = useIcon({ name: "ri-dice-line", size: 20 });

const seed = defineModel({ type: [Number, null], required: true });

function onRandomSeed() {
	seed.value = generateSeed();
}
</script>

<style lang="scss" scoped>
.seed-btn {
	margin-left: $zl-padding;
	padding: 12px 16px;
	@include click-elastic();
}
</style>
