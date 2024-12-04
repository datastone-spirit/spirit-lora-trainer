<!--
 * @Author: mulingyuer
 * @Date: 2024-09-30 08:50:58
 * @LastEditTime: 2024-09-30 09:16:02
 * @LastEditors: mulingyuer
 * @Description: 面包屑
 * @FilePath: \spirit-app-microservice-admin\src\layout\admin-layout\components\Header\Breadcrumb.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-breadcrumb v-if="show" class="admin-breadcrumb" separator="/">
		<el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
			<a @click.prevent="onBreadcrumbClick(item)" class="admin-breadcrumb-link">
				{{ item.meta.title }}</a
			>
		</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import type { RouteLocationMatched } from "vue-router";

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

/** 是否显示面包屑 */
const show = computed(() => !appStore.isMobile);
/** 面包屑列表 */
const breadcrumbList = computed(() => {
	return route.matched.filter((item) => item.meta.title);
});

/** 面包屑点击事件 */
function onBreadcrumbClick(item: RouteLocationMatched) {
	const { redirect, name } = item;
	if (redirect) {
		router.push(redirect as string);
	} else {
		router.push({ name });
	}
}
</script>

<style lang="scss" scoped>
.admin-breadcrumb {
	padding: 0 8px;
}
.admin-breadcrumb-link {
	font-weight: normal;
}
</style>
