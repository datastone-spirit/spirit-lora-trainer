<!--
 * @Author: mulingyuer
 * @Date: 2024-09-30 10:23:21
 * @LastEditTime: 2024-10-11 17:09:39
 * @LastEditors: mulingyuer
 * @Description: 导航tab
 * @FilePath: \element-admin-template\src\layout\admin-layout\components\NavTab\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<nav class="nav-tab" :class="[navTabClass]">
		<el-tabs v-model="activeName" @tab-change="onTabChange">
			<el-tab-pane
				v-for="item in navTabStore.navTabList"
				:key="item.fullPath"
				:label="item.title"
				:name="item.fullPath"
			>
				<template #label>
					<div class="nav-tab-label" @contextmenu.prevent="onNavTabContextmenu($event, item)">
						<Icon v-if="item.icon" class="nav-tab-icon" :name="item.icon" />
						<span class="nav-tab-title">{{ item.title }}</span>
						<Icon
							v-if="!item.affix"
							class="nav-tab-close"
							name="ri-close-line"
							size="14"
							@click.prevent.stop="onCloseNavTab(item.fullPath)"
						/>
					</div>
				</template>
			</el-tab-pane>
		</el-tabs>
		<NavTabTools />
		<NavTabContextmenu
			v-model:show="showNavTabContextmenu"
			:left="navTabContextmenuLeft"
			:top="navTabContextmenuTop"
			:full-path="navTabContextmenuFullPath"
		/>
	</nav>
</template>

<script setup lang="ts">
import NavTabTools from "./NavTabTools.vue";
import NavTabContextmenu from "./NavTabContextmenu.vue";
import type { TabPaneName } from "element-plus";
import { useAppStore, useNavTabStore } from "@/stores";
import type { RouteRecordRaw } from "vue-router";
import { updateNavTabToolsList } from "./helper";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const navTabStore = useNavTabStore();

const navTabClass = computed(() => {
	if (appStore.isMobile) {
		// 移动端
		return appStore.isCollapse ? "is-mobile-collapse" : "is-mobile";
	} else {
		return appStore.isCollapse ? "is-collapse" : "";
	}
});

/** 当前激活的路由 */
const activeName = computed({
	get() {
		return route.fullPath;
	},
	// HACK: 不允许写入，但是需要触发set方法，这样可以去除vue的警告
	set(_val: string) {}
});
/** 是否显示右键菜单 */
const showNavTabContextmenu = ref(false);
const navTabContextmenuLeft = ref(0);
const navTabContextmenuTop = ref(0);
const navTabContextmenuFullPath = ref("");

/** 切换tab */
function onTabChange(fullPath: TabPaneName) {
	router.push(fullPath as string);
}

/** 关闭tab */
function onCloseNavTab(fullPath: string) {
	navTabStore.removeNavTab(fullPath);
}

/** 右键菜单 */
function onNavTabContextmenu(event: MouseEvent, item: AdminApp.NavTabData) {
	// 更新右键菜单列表
	updateNavTabToolsList(item.fullPath, item.affix);
	// 更新当前右键菜单的fullPath
	navTabContextmenuFullPath.value = item.fullPath;
	// 计算菜单位置
	navTabContextmenuLeft.value = event.clientX;
	navTabContextmenuTop.value = event.clientY;
	// 显示右键菜单
	showNavTabContextmenu.value = true;
}

/** 从路由记录中筛选出affix路由 */
function getAffixRoutes(routes: RouteRecordRaw[]) {
	const list: AdminApp.NavTabData[] = [];

	routes.forEach((route) => {
		if (route.meta?.affix) {
			list.push({
				fullPath: route.path,
				name: route?.name as string,
				title: route.meta?.title,
				icon: route.meta?.icon,
				affix: route.meta?.affix
			});
		}
	});

	return list;
}

/** 初始化 */
function init() {
	// 获取所有路由列表，筛选出affix路由并添加到store中
	if (navTabStore.navTabList.length === 0) {
		const routes = router.getRoutes();
		const affixRoutes = getAffixRoutes(routes);
		affixRoutes.forEach((item) => {
			navTabStore.addNavTab(item);
		});
	}
}

/** 将当前路由添加到navTabList中 */
function addCurrentRoute() {
	navTabStore.addNavTab({
		fullPath: route.fullPath,
		name: route.name as string,
		title: route.meta.title,
		icon: route.meta.icon,
		affix: route.meta?.affix
	});
}

onMounted(() => {
	init();
	addCurrentRoute();
});

// 监听路由变化，添加当前路由到navTabList中
watch(
	() => route.fullPath,
	() => {
		addCurrentRoute();
	}
);
</script>

<style lang="scss" scoped>
.nav-tab {
	position: fixed;
	top: $header-height;
	left: $aside-width;
	right: 0;
	height: $nav-tab-height;
	background-color: var(--el-bg-color);
	box-shadow: 0 0 1px rgba(136, 136, 136);
	display: flex;
	align-items: center;
	transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 3;
	&.is-mobile-collapse,
	&.is-mobile {
		left: $aside-mobile-width;
	}
	&.is-collapse {
		left: $aside-mini-width;
	}
}
.nav-tab :deep(.el-tabs) {
	width: calc(100% - 80px);
	.is-scrollable .el-tabs__item:nth-child(2) {
		margin-left: 0 !important;
	}
	.el-tabs__header {
		margin-bottom: 0;
		.el-tabs__nav-wrap::after {
			height: 0;
		}
		.el-tabs__nav-prev,
		.el-tabs__nav-next {
			line-height: 30px;
		}
		.el-tabs__active-bar {
			display: none;
		}
		.el-tabs__item:nth-child(2) {
			margin-left: 12px;
		}
		.el-tabs__item {
			border: 1px solid var(--el-border-color-light);
			height: 31px;
			padding: 0;
			margin-left: 8px;
			border-radius: 2px;
			&:hover {
				border-color: var(--el-color-primary-light-3);
			}
		}
		.is-icon-close:hover {
			background-color: var(--el-color-primary);
		}
		.is-active {
			background: var(--el-color-primary-light-8);
			border-color: var(--el-color-primary-light-3);
		}
		.is-icon-close {
			margin-left: 8px;
		}
	}
}
.nav-tab-label {
	display: flex;
	align-items: center;
	gap: 8px;
	padding-left: 12px;
	padding-right: 9px;
}
.nav-tab-close {
	border-radius: 9999px;
	&:hover {
		color: #fff;
		background-color: var(--el-color-primary);
	}
}
</style>
