<!--
 * @Author: mulingyuer
 * @Date: 2025-08-27 09:50:40
 * @LastEditTime: 2025-08-29 09:40:36
 * @LastEditors: mulingyuer
 * @Description: 功能介绍
 * @FilePath: \frontend\src\views\lora\wan-video\components\FieldTooltipGuide\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="field-tooltip-guide">
		<el-alert class="field-tooltip-guide-alert" type="info" :closable="false" show-icon>
			<template #icon>
				<Icon name="ri-information-fill" size="18" />
			</template>
			<div class="field-tooltip-guide-alert-desc">
				本训练页支持 <strong>Wan 2.1 LoRA</strong> 和
				<strong>Wan 2.2 LoRA</strong> 训练，您可以在这个页面设置参数并训练对应 LoRA
			</div>
		</el-alert>
		<div class="field-tooltip-guide-content">
			<p>使用支持：</p>
			<ul>
				<li>
					我们训练器采用的是：<el-link
						type="info"
						href="https://github.com/kohya-ss/musubi-tuner"
						target="_blank"
					>
						musubi-tuner
					</el-link>
					脚本
				</li>
				<li v-if="videoData1.show">
					训练 Wan2.1视频教程，请观看
					<el-link type="info" :href="videoData1.href" target="_blank">
						《{{ videoData1.title }}》
					</el-link>
				</li>
				<li v-if="videoData2.show">
					训练 Wan2.2视频教程，请观看
					<el-link type="info" :href="videoData2.href" target="_blank">
						《{{ videoData2.title }}》
					</el-link>
				</li>
				<li>如果还有其他GPU疑问，请访问我们的B站或添加训练器首页的二维码寻求帮助</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ZL_VIDEO_MAP } from "@/constants";

const videoData1 = ZL_VIDEO_MAP.WAN_2_1;
const videoData2 = ZL_VIDEO_MAP.WAN_2_2;
</script>

<style lang="scss" scoped>
.field-tooltip-guide {
	margin-bottom: $zl-collapse-margin;
	background-color: var(--zl-collapse-bg);
	border-radius: $zl-border-radius;
	padding: $zl-padding;
}
.field-tooltip-guide-alert {
	margin-bottom: 22px;
}
.field-tooltip-guide-alert-desc {
	font-size: 14px;
}
.field-tooltip-guide-content {
	font-size: 14px;
	line-height: 20px;
	p {
		margin-bottom: 6px;
	}
	ul {
		list-style: disc;
		padding-inline-start: 40px;
	}
	li + li {
		margin-top: 6px;
	}
}
</style>
