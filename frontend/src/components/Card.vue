<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 17:23:13
 * @LastEditTime: 2024-12-04 17:29:33
 * @LastEditors: mulingyuer
 * @Description: 卡片组件
 * @FilePath: \frontend\src\components\Card.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-card :shadow="shadow">
		<slot></slot>
	</el-card>
</template>

<script setup lang="ts">
import type { CardProps as ElCardProps } from "element-plus";

interface CardProps {
	/** 卡片阴影显示时机 */
	shadow?: ElCardProps["shadow"];
}

withDefaults(defineProps<CardProps>(), {
	shadow: "never"
});
</script>

<style scoped></style>
