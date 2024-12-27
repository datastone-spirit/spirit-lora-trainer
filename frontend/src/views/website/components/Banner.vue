<!--
 * @Author: mulingyuer
 * @Date: 2024-12-27 11:44:30
 * @LastEditTime: 2024-12-27 15:32:06
 * @LastEditors: mulingyuer
 * @Description: banner
 * @FilePath: \frontend\src\views\website\components\banner.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="website-banner">
		<div class="website-banner-content">
			<h2 class="website-banner-title">通过 <strong>Serverless</strong> 扩展机器学习</h2>
			<p class="website-banner-desc">快速运行您的AI模型，并在需要时自动扩展</p>
			<div class="website-banner-btn-wrapper">
				<el-space :size="24">
					<el-button
						class="website-banner-btn"
						type="primary"
						size="large"
						round
						@click="onContactClick"
					>
						联系我们
						<Icon class="website-banner-btn-icon" name="ri-question-line" size="28" />
					</el-button>
					<el-button class="website-banner-btn" type="warning" size="large" @click="onWebsiteClick">
						前往官网
						<Icon class="website-banner-btn-icon" name="ri-navigation-line" size="28" />
					</el-button>
				</el-space>
			</div>
		</div>
		<div class="desc-list">
			<div class="desc-list-content">
				<div v-for="(item, index) in list" :key="index" class="desc-list-item">
					<div class="desc-list-item-content">
						<div class="desc-list-item-title-wrapper">
							<h3 class="desc-list-item-title">
								{{ item.title }}
							</h3>
						</div>
						<p class="desc-list-item-desc">{{ item.desc }}</p>
					</div>
				</div>
			</div>
		</div>
		<el-dialog v-model="showContactDialog" title="联系我们" width="auto" align-center>
			<div class="contact-dialog-content">
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
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="showContactDialog = false"> 我已经扫码啦 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

type List = Array<{
	title: string;
	desc: string;
}>;

const appStore = useAppStore();
const isDark = storeToRefs(appStore).isDark;

/** 前往官网 */
function onWebsiteClick() {
	window.open("https://serverless.datastone.cn/", "_blank");
}

/** 联系我们 */
const showContactDialog = ref(false);
function onContactClick() {
	showContactDialog.value = true;
}

const list = ref<List>([
	{
		title: "GPU服务",
		desc: "多种GPU配置点击即用，功能强大、价格实惠，适用于任何场景"
	},
	{
		title: "快速部署",
		desc: "无需预置或管理基础设施即可运行代码，提供包括ComfyUI与SD在内的多种常用开源AI软件，长久及时更新"
	},
	{
		title: "内置训练器",
		desc: "内置智灵官方出品AIGC训练器，一键即可满足您的所有需求"
	},
	{
		title: "弹性收费",
		desc: "按实际使用计算资源计费，无请求时无需支付任何费用，避免资源闲置造成无效付费"
	}
]);
</script>

<style lang="scss" scoped>
.website-banner {
	height: calc(100vh - $zl-padding * 2);
	display: flex;
	background-image: url("/images/loading_bg.png");
	background-color: var(--zl-website-banner-bg);
	background-position: center;
	background-repeat: no-repeat;
	background-size: 1405px 1108px;
	padding-top: 194px;
	border-radius: $zl-border-radius;
	position: relative;
}
.website-banner-content {
	margin: 10px auto auto;
	text-align: center;
}

.website-banner-title,
.website-banner-desc {
	font-weight: bold;
	color: var(--zl-website-banner-color);
}
.website-banner-title {
	font-size: 64px;
}
.website-banner-title strong {
	color: #24d3b3;
	position: relative;
}
.website-banner-title strong::before {
	content: "";
	position: absolute;
	top: -120px;
	width: 156px;
	height: 120px;
	background-image: url("/images/hey.svg");
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	filter: drop-shadow(-18px 12px 30px rgba(36, 211, 179, 0.3));
}
.website-banner-desc {
	margin-top: 16px;
	font-size: 36px;
}
.website-banner-btn-wrapper {
	margin-top: 36px;
}
.website-banner-btn {
	width: 220px;
	height: 55px;
	border-radius: 9999px;
	font-size: 28px;
}
.website-banner-btn-icon {
	margin-left: 8px;
}
.desc-list {
	position: absolute;
	bottom: 24px;
	left: 24px;
	right: 24px;
	margin-top: $zl-padding;
}
.desc-list-content {
	display: flex;
	gap: $zl-padding;
}
.desc-list-item {
	flex-grow: 1;
	width: 1px;
	min-width: 325px;
	min-height: 304px;
	padding-bottom: 20%;
	background-color: var(--zl-page-bg);
	border-radius: $zl-border-radius;
	position: relative;
}
.desc-list-item-content {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 40px;
}
.desc-list-item-title-wrapper {
	text-align: center;
	margin-top: 25px;
	margin-bottom: 42px;
}
.desc-list-item-title {
	display: inline-block;
	font-size: 28px;
	font-weight: bold;
	color: var(--zl-website-banner-color);
	position: relative;
}
.desc-list-item-title::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: -6px;
	height: 4px;
	background-color: #24d3b3;
}
.desc-list-item-desc {
	font-size: 16px;
	color: var(--zl-website-banner-color);
	line-height: 1.5;
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
	color: var(--zl-website-banner-color);
}
</style>
