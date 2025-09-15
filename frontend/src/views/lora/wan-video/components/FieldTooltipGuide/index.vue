<!--
 * @Author: mulingyuer
 * @Date: 2025-08-27 09:50:40
 * @LastEditTime: 2025-09-15 11:06:57
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
					<a :href="videoData1.href" target="_blank"> 《{{ videoData1.title }}》 </a>
				</li>
				<li v-if="videoData2.show">
					训练 Wan2.2视频教程，请观看
					<a :href="videoData2.href" target="_blank"> 《{{ videoData2.title }}》 </a>
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

<style lang="scss" scoped></style>
