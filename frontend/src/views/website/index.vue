<!--
 * @Author: mulingyuer
 * @Date: 2024-12-27 10:35:03
 * @LastEditTime: 2024-12-27 14:57:56
 * @LastEditors: mulingyuer
 * @Description: 官网介绍
 * @FilePath: \frontend\src\views\website\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="website">
		<div class="website-content">
			<Banner />
		</div>
	</div>
</template>

<script setup lang="ts">
import Banner from "./components/Banner.vue";
</script>

<style lang="scss" scoped>
.website-content {
	padding-right: $zl-padding;
}
</style>
