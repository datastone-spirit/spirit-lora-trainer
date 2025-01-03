<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 10:02:58
 * @LastEditTime: 2025-01-03 15:05:22
 * @LastEditors: mulingyuer
 * @Description: about页面
 * @FilePath: \frontend\src\views\about\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="about-page">
		<div class="about-page-left">
			<div class="about-page-left-body">
				<img
					v-if="!isDark"
					class="about-page-logo"
					src="@/assets/images/logo_light.svg"
					:alt="logoTitle"
				/>
				<img v-else class="about-page-logo" src="@/assets/images/logo_dark.svg" :alt="logoTitle" />
				<h2 class="about-page-title">{{ logoTitle }}</h2>
				<p class="about-page-description">这是一个由智灵算力平台开源的 AIGC LoRA 训练平台</p>
			</div>
			<div class="about-page-left-footer">
				<div class="about-page-left-footer-title">最后更新时间</div>
				<div class="about-page-left-footer-value">{{ commitId }}</div>
				<div class="about-page-left-footer-value">{{ commitTime }}</div>
			</div>
		</div>
		<div class="about-page-right">
			<div class="about-page-right-item">
				<h3 class="about-page-right-item-title">资源一览</h3>
				<div class="about-page-right-item-body">
					<el-space direction="vertical" alignment="flex-start" :size="12">
						<a
							v-for="(item, index) in linkList"
							:key="index"
							class="about-page-right-item-link"
							:href="item.link"
							:target="item.target"
							:title="item.title"
						>
							<Icon class="about-page-right-item-link-icon" :name="item.icon" size="20"></Icon>
							{{ item.title }}
						</a>
					</el-space>
				</div>
			</div>
			<el-divider class="about-page-right-divider" />
			<div class="about-page-right-item">
				<h3 class="about-page-right-item-title">联系我们</h3>
				<div class="about-page-right-item-body">
					<el-space :size="24">
						<div class="about-page-qr-code">
							<img
								v-if="!isDark"
								class="about-page-qr-code-img"
								src="@/assets/images/about/wx_gzh_dark.png"
								alt="添加智灵公众号"
							/>
							<img
								v-else
								class="about-page-qr-code-img"
								src="@/assets/images/about/wx_gzh_light.png"
								alt="添加智灵公众号"
							/>
							<div class="about-page-qr-code-text">添加智灵公众号</div>
						</div>
						<div class="about-page-qr-code">
							<img
								v-if="!isDark"
								class="about-page-qr-code-img"
								src="@/assets/images/about/service_dark.png"
								alt="添加智灵客服"
							/>
							<img
								v-else
								class="about-page-qr-code-img"
								src="@/assets/images/about/service_light.png"
								alt="添加智灵客服"
							/>
							<div class="about-page-qr-code-text">添加智灵客服</div>
						</div>
					</el-space>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { formatDate } from "@/utils/dayjs";

type LinkList = Array<{
	title: string;
	icon: string;
	link: string;
	target: HTMLAnchorElement["target"];
}>;

const appStore = useAppStore();
const logoTitle = import.meta.env.VITE_APP_TITLE;
const isDark = storeToRefs(appStore).isDark;

const linkList = ref<LinkList>([
	{
		title: "训练器GitHub仓库",
		icon: "ri-github-fill",
		link: "https://github.com/datastone-spirit/spirit-lora-trainer",
		target: "_blank"
	},
	{
		title: "进入智灵官网",
		icon: "ri-window-2-fill",
		link: "https://serverless.datastone.cn/",
		target: "_blank"
	},
	{
		title: "进入智灵后台",
		icon: "ri-tools-fill",
		link: "https://serverless.datastone.cn/sprite/app/",
		target: "_blank"
	},
	{
		title: "查看使用手册",
		icon: "ri-booklet-fill",
		link: "https://serverless.datastone.cn/sprite/docs/zh/",
		target: "_blank"
	},
	{
		title: "查看训练器使用教程",
		icon: "ri-movie-fill",
		link: "https://www.bilibili.com/video/BV1VW61YxE5N",
		target: "_blank"
	}
]);

const commitTime = formatDate(__GIT_COMMIT_TIME__, "YYYY/MM/DD HH:mm:ss");
const commitId = __GIT_COMMIT_ID__;
</script>

<style lang="scss" scoped>
.about-page {
	display: flex;
	gap: $zl-padding;
	padding-right: $zl-padding;
	min-height: 100%;
}
.about-page-left,
.about-page-right {
	background-color: var(--zl-about-page-bg);
	border-radius: $zl-border-radius;
	height: calc(100vh - $zl-padding * 2);
	min-height: 700px;
	overflow: auto;
	padding: 32px;
}
.about-page-left {
	width: 300px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.about-page-logo {
	width: 100px;
	height: 100px;
	vertical-align: top;
}
.about-page-title,
.about-page-description {
	color: var(--zl-about-page-color);
}
.about-page-title {
	margin-top: 24px;
	font-size: 32px;
	font-weight: bold;
}
.about-page-description {
	margin-top: 24px;
	font-size: 14px;
}
.about-page-left-footer {
	margin-top: $zl-padding;
}
.about-page-left-footer-title,
.about-page-left-footer-value {
	font-size: 14px;
}
.about-page-left-footer-title {
	font-size: 14px;
	color: var(--zl-about-page-color);
	font-weight: bold;
}
.about-page-left-footer-value {
	margin-top: 4px;
	color: var(--el-text-color-secondary);
}
.about-page-right {
	flex-grow: 1;
	min-width: 400px;
}
.about-page-right-divider {
	margin: 36px 0;
}
.about-page-right-item-title {
	font-size: 24px;
	font-weight: bold;
	color: var(--zl-about-page-color);
	margin-bottom: 24px;
}
.about-page-right-item-link {
	display: inline-flex;
	align-items: center;
	font-size: 14px;
	text-decoration: none;
	border-radius: 9999px;
	padding: 8px 15px;
	color: var(--zl-about-page-color);
	border: var(--el-border);
	background-color: var(--el-fill-color-blank);
	transition: 0.1s;
	@include no-select();
	&:hover {
		color: var(--el-color-primary);
		border-color: var(--el-color-primary-light-7);
		background-color: var(--el-color-primary-light-9);
		outline: none;
	}
}
.about-page-right-item-link-icon {
	margin-right: 11px;
}
.about-page-qr-code {
	text-align: center;
	padding: 10px;
}
.about-page-qr-code-img {
	width: 140px;
	height: 140px;
	vertical-align: top;
}
.about-page-qr-code-text {
	margin-top: 10px;
	font-size: 14px;
	color: var(--zl-about-page-color);
}
</style>
