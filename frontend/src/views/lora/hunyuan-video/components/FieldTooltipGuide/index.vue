<!--
 * @Author: mulingyuer
 * @Date: 2025-08-27 09:50:40
 * @LastEditTime: 2025-08-28 11:58:28
 * @LastEditors: mulingyuer
 * @Description: 功能介绍
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\FieldTooltipGuide\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="field-tooltip-guide">
		<el-alert class="field-tooltip-guide-alert" type="info" :closable="false" show-icon>
			<template #icon>
				<Icon name="ri-information-fill" size="18" />
			</template>
			<div class="field-tooltip-guide-alert-desc">
				本训练页支持
				<strong>混元视频（HunyuanVideo）LoRA</strong> 训练，您可以在这个页面设置参数并训练对应 LoRA
			</div>
		</el-alert>
		<div class="field-tooltip-guide-content">
			<p>使用支持：</p>
			<ul>
				<li>
					我们训练器采用的是：<el-link
						type="info"
						href="https://github.com/tdrussell/diffusion-pipe"
						target="_blank"
					>
						diffusion-pipe
					</el-link>
					脚本
				</li>
				<li>
					如果你不知道如何使用这个训练器，请观看
					<el-link type="info" :href="videoData.href" target="_blank">
						《{{ videoData.title }}》
					</el-link>
				</li>
				<li>如果还有其他GPU疑问，请访问我们的B站或添加训练器首页的二维码寻求帮助</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ZL_VIDEO_MAP } from "@/constants";

const videoData = ZL_VIDEO_MAP.HUNYUAN_VIDEO;
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
