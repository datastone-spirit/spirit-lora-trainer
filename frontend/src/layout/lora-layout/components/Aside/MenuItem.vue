<!--
 * @Author: mulingyuer
 * @Date: 2024-09-27 16:40:29
 * @LastEditTime: 2024-12-04 16:02:35
 * @LastEditors: mulingyuer
 * @Description: 按钮item
 * @FilePath: \frontend\src\layout\admin-layout\components\Aside\MenuItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
		<template #title>
			<Icon v-if="menu.icon" :name="menu.icon" size="19" />
			<span class="truncate">{{ menu.title }}</span>
		</template>
		<MenuItem v-for="menuItem in menu.children" :key="menuItem.path" :menu="menuItem" />
	</el-sub-menu>
	<el-menu-item v-else :index="menu.path">
		<Icon v-if="menu.icon" :name="menu.icon" size="19" />
		<span class="truncate">{{ menu.title }}</span>
	</el-menu-item>
</template>

<script setup lang="ts">
defineProps({
	menu: {
		type: Object as PropType<AdminApp.Menu>,
		required: true
	}
});
</script>

<style scoped></style>
