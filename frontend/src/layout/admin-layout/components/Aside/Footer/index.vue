<!--
 * @Author: mulingyuer
 * @Date: 2024-12-11 16:13:18
 * @LastEditTime: 2024-12-13 09:46:02
 * @LastEditors: mulingyuer
 * @Description: 底部
 * @FilePath: \spirit-lora-trainer\frontend\src\layout\admin-layout\components\Aside\Footer\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="aside-footer">
		<div class="aside-footer-content">
			<div class="aside-footer-content-left">
				<LightDarkToggle />
			</div>
			<div class="aside-footer-content-right">
				<MenuCollapse />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import LightDarkToggle from "./LightDarkToggle.vue";
import MenuCollapse from "./MenuCollapse.vue";
</script>

<style lang="scss" scoped>
.aside-footer {
	position: relative;
	box-shadow: 0px 0px 12px var(--zl-aside-footer-box-shadow);
}
.aside-footer-content {
	display: flex;
	flex-wrap: wrap;
	padding: 6px 0;
}
.aside-footer-content-left,
.aside-footer-content-right {
	padding: 2px 12.5px;
}
.aside-footer-content-right {
	margin-left: auto;
}
</style>
